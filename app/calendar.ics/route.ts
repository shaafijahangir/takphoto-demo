import { all } from "@/lib/db";
import { icsFeed, type CalendarEvent } from "@/lib/calendar";

export const dynamic = "force-dynamic";

interface Row {
  reference: string;
  service_name: string;
  price_display: string;
  customer_name: string;
  email: string;
  phone: string;
  date: string;
  start_min: number;
  end_min: number;
}

/**
 * GET /calendar.ics
 *
 * Every booking as an iCalendar feed. The studio adds this URL once under
 * Google Calendar → Other calendars → From URL, and appointments then appear
 * in the calendar they already keep open in Gmail. No OAuth, no API key.
 *
 * The feed is public by design: a subscribed calendar client cannot send
 * credentials. It carries customer names and numbers, so on handover this
 * moves behind an unguessable path or a token before it goes near real
 * customer data.
 */
export async function GET(): Promise<Response> {
  const rows = all<Row>(
    `SELECT b.reference, s.name AS service_name, s.price_display,
            b.customer_name, b.email, b.phone, b.date, b.start_min, b.end_min
       FROM bookings b
       JOIN services s ON s.id = b.service_id
      ORDER BY b.date, b.start_min`
  );

  const events: CalendarEvent[] = rows.map((r) => ({
    reference: r.reference,
    service: { name: r.service_name, price_display: r.price_display },
    customer_name: r.customer_name,
    email: r.email,
    phone: r.phone,
    date: r.date,
    start_min: r.start_min,
    end_min: r.end_min,
  }));

  return new Response(icsFeed(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="phototak-bookings.ics"',
      "Cache-Control": "no-cache, must-revalidate",
    },
  });
}
