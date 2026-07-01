import { NextResponse } from "next/server";
import { get } from "@/lib/db";
import { getAvailableSlots } from "@/lib/availability";
import { minutesToLabel, type Service } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/availability?serviceId=1&date=YYYY-MM-DD
// Single photo station: open slots are computed across ALL bookings that day.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date") ?? "";

  if (!Number.isFinite(serviceId) || serviceId <= 0 || !date) {
    return NextResponse.json({ error: "serviceId and date are required" }, { status: 400 });
  }

  const service = get<Service>("SELECT * FROM services WHERE id = ?", serviceId);
  if (!service) {
    return NextResponse.json({ error: "service not found" }, { status: 404 });
  }

  const slots = getAvailableSlots(service.duration_min, date).map((min) => ({
    min,
    label: minutesToLabel(min),
  }));

  return NextResponse.json({ slots, duration_min: service.duration_min });
}
