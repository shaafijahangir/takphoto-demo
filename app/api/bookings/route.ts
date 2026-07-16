import { NextResponse } from "next/server";
import { db, tx, get } from "@/lib/db";
import { hasConflict, isOpenFor } from "@/lib/availability";
import { notifyBooking } from "@/lib/notify";
import { type Service } from "@/lib/types";

export const dynamic = "force-dynamic";

function makeReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `TAK-${n}`;
}

function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// GET /api/bookings -> all bookings with the service name (simple admin view).
export async function GET() {
  const rows = db
    .prepare(
      `SELECT b.*, s.name AS service_name
       FROM bookings b JOIN services s ON s.id = b.service_id
       ORDER BY b.date, b.start_min`
    )
    .all();
  return NextResponse.json({ bookings: rows });
}

// POST /api/bookings { serviceId, date, startMin, name, email, phone }
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { serviceId, date, startMin, name, email, phone } = body ?? {};
  if (!serviceId || !date || startMin == null || !name || !email || !phone) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  if (!validEmail(String(email))) {
    return NextResponse.json({ error: "please enter a valid email" }, { status: 400 });
  }

  const service = get<Service>("SELECT * FROM services WHERE id = ?", Number(serviceId));
  if (!service) return NextResponse.json({ error: "service not found" }, { status: 404 });

  const start = Number(startMin);
  const end = start + service.duration_min;

  if (!isOpenFor(date, start, end)) {
    return NextResponse.json(
      { error: "The studio is closed then. Please pick a time inside opening hours." },
      { status: 400 }
    );
  }

  let result;
  try {
    result = tx(() => {
      // Re-check inside the transaction: the slot may have been taken since the
      // customer loaded availability. One station = any overlap is a conflict.
      if (hasConflict(date, start, end)) {
        throw { code: 409, msg: "That time was just taken. Please pick another slot." };
      }

      const reference = makeReference();
      db.prepare(
        `INSERT INTO bookings (reference, service_id, customer_name, email, phone, date, start_min, end_min)
         VALUES (?,?,?,?,?,?,?,?)`
      ).run(reference, service.id, String(name), String(email), String(phone), date, start, end);

      return { reference, service, date, start, end };
    });
  } catch (e: any) {
    if (e && e.code) return NextResponse.json({ error: e.msg }, { status: e.code });
    console.error(e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }

  // Notify the studio inbox. Awaited but non-fatal; booking already committed.
  await notifyBooking({
    reference: result.reference,
    service: result.service,
    date: result.date,
    start_min: result.start,
    end_min: result.end,
    customer_name: String(name),
    email: String(email),
    phone: String(phone),
  });

  return NextResponse.json(
    {
      ok: true,
      booking: {
        reference: result.reference,
        service: result.service,
        date: result.date,
        start: result.start,
        end: result.end,
      },
    },
    { status: 201 }
  );
}
