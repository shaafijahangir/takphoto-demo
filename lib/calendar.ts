import { minutesToLabel, type Service } from "./types";

/**
 * Calendar interop without OAuth.
 *
 * The studio lives in Gmail, so bookings should land in the Google Calendar
 * they already have open. Two ways in, both real, neither needing a Google
 * API key, a consent screen, or app verification:
 *
 *   1. icsFeed()  -> served at /calendar.ics. Google Calendar subscribes to a
 *      public URL ("Other calendars → From URL") and refreshes it on its own.
 *      Every booking shows up in their normal calendar view.
 *   2. googleCalendarUrl() -> a plain calendar.google.com link that opens a
 *      prefilled event. Used on the confirmation screen and in the alert email.
 *
 * Two-way sync (moving an event in Google and having it write back) does need
 * OAuth and the Calendar API. That is a real build, not a line of config, and
 * we do not claim it anywhere until it exists.
 */

const TZ = "America/Vancouver";
const LOCATION = "623 Broughton St, Victoria, BC V8W 3J2";

export interface CalendarEvent {
  reference: string;
  service: Pick<Service, "name" | "price_display">;
  customer_name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  start_min: number;
  end_min: number;
}

/** Offset of `at` in `tz`, in milliseconds (negative west of UTC). */
function tzOffset(at: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p: Record<string, number> = {};
  for (const part of dtf.formatToParts(at)) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour === 24 ? 0 : p.hour,
    p.minute,
    p.second
  );
  return asUtc - at.getTime();
}

/**
 * Wall-clock time at the studio to a real instant. Iterated twice so a booking
 * that lands on a DST changeover resolves to the correct offset rather than
 * the one an hour either side.
 */
function zonedToUtc(date: string, minutes: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  const h = Math.floor(minutes / 60);
  const mi = minutes % 60;
  const naive = Date.UTC(y, m - 1, d, h, mi);
  let utc = naive;
  for (let i = 0; i < 2; i++) utc = naive - tzOffset(new Date(utc), TZ);
  return new Date(utc);
}

/** "20260720T153000Z" */
function toUtcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** "20260720T083000" (local wall time, paired with TZID). */
function toLocalStamp(date: string, minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mi = String(minutes % 60).padStart(2, "0");
  return `${date.replace(/-/g, "")}T${h}${mi}00`;
}

/** Escape per RFC 5545: backslash, semicolon, comma, newline. */
function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold long lines to 75 octets, per RFC 5545. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const out: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    out.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest) out.push(" " + rest);
  return out.join("\r\n");
}

// Static because the DST rules for Canada have not moved since 2007. Emitting
// this means no timezone maths in the feed itself: the wall time plus the rule
// is unambiguous to every calendar client.
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZ}`,
  "X-LIC-LOCATION:America/Vancouver",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:-0800",
  "TZOFFSETTO:-0700",
  "TZNAME:PDT",
  "DTSTART:19700308T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:-0700",
  "TZOFFSETTO:-0800",
  "TZNAME:PST",
  "DTSTART:19701101T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function describe(e: CalendarEvent): string {
  return [
    `${e.service.name} (${e.service.price_display})`,
    `Customer: ${e.customer_name}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email}`,
    `Reference: ${e.reference}`,
  ].join("\n");
}

/** A full iCalendar document. Google Calendar can subscribe to this by URL. */
export function icsFeed(events: CalendarEvent[], now: Date = new Date()): string {
  const stamp = toUtcStamp(now);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Photo Tak//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Photo Tak Bookings",
    `X-WR-TIMEZONE:${TZ}`,
    // Ask subscribers to refresh hourly. Google treats this as a hint.
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
    ...VTIMEZONE,
  ];

  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.reference}@phototak.onrender.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=${TZ}:${toLocalStamp(e.date, e.start_min)}`,
      `DTEND;TZID=${TZ}:${toLocalStamp(e.date, e.end_min)}`,
      fold(`SUMMARY:${esc(`${e.service.name} - ${e.customer_name}`)}`),
      fold(`DESCRIPTION:${esc(describe(e))}`),
      fold(`LOCATION:${esc(LOCATION)}`),
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** A prefilled "Add to Google Calendar" link. No API, no auth, just a URL. */
export function googleCalendarUrl(e: CalendarEvent): string {
  const start = toUtcStamp(zonedToUtc(e.date, e.start_min));
  const end = toUtcStamp(zonedToUtc(e.date, e.end_min));
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.service.name} - ${e.customer_name}`,
    dates: `${start}/${end}`,
    details: describe(e),
    location: LOCATION,
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** "Mon 20 Jul, 8:30 AM" for humans, from the same source of truth. */
export function eventLabel(e: CalendarEvent): string {
  return `${e.date} ${minutesToLabel(e.start_min)}`;
}
