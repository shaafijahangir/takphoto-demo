import { db, all } from "./db";
import { hoursFor } from "./types";

const SLOT_STEP = 15; // minutes between candidate start times

interface Interval {
  start_min: number;
  end_min: number;
}

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one from `new Date(str)`). */
function parseLocalDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Open start-times (minutes from midnight) for the single photo station on a
 * given date, for an appointment of `durationMin`. Because there is one station,
 * ANY existing booking that day blocks overlapping times regardless of service.
 * Hours come from STUDIO_HOURS per weekday, so a session can never start late
 * enough to run past closing. Excludes closed days and, for today, times past.
 */
export function getAvailableSlots(
  durationMin: number,
  date: string,
  now: Date = new Date()
): number[] {
  const hours = hoursFor(parseLocalDate(date).getDay());
  if (!hours) return [];

  const booked = all<Interval>(
    "SELECT start_min, end_min FROM bookings WHERE date = ?",
    date
  );

  const isToday = date === toLocalDate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots: number[] = [];
  const lastStart = hours.close - durationMin;
  for (let t = hours.open; t <= lastStart; t += SLOT_STEP) {
    const end = t + durationMin;
    if (isToday && t <= nowMin) continue;
    const clash = booked.some((b) => t < b.end_min && end > b.start_min);
    if (!clash) slots.push(t);
  }
  return slots;
}

/**
 * Whether the studio is open for the whole appointment. Checked server-side so
 * a hand-crafted POST cannot land an appointment at 3am or on a Sunday.
 */
export function isOpenFor(date: string, start: number, end: number): boolean {
  const hours = hoursFor(parseLocalDate(date).getDay());
  if (!hours) return false;
  return start >= hours.open && end <= hours.close;
}

/** Overlap with an existing booking. One station, so any overlap is a clash. */
export function hasConflict(date: string, start: number, end: number): boolean {
  const row = db
    .prepare(
      `SELECT 1 FROM bookings
       WHERE date = ? AND ? < end_min AND ? > start_min
       LIMIT 1`
    )
    .get(date, start, end);
  return !!row;
}

export function toLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}
