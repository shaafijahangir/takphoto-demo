/**
 * Checks the calendar output the studio actually consumes.
 *
 * Run: npm run check:calendar
 *
 * Worth having as a script rather than a one-off: the timezone maths is the
 * kind of thing that breaks silently at a DST boundary and only shows up as
 * an appointment landing an hour out in someone's Google Calendar.
 */
import { icsFeed, googleCalendarUrl, type CalendarEvent } from "../lib/calendar";

const ev = (date: string, start: number, end: number): CalendarEvent => ({
  reference: "TAK-1234",
  service: { name: "Wedding Consultation", price_display: "No charge" },
  customer_name: "Alex Morgan; Smith, Jr",
  email: "alex@example.com",
  phone: "250-555-0199",
  date,
  start_min: start,
  end_min: end,
});

let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : "  ->  " + detail}`);
  if (!cond) fail++;
};

// Victoria is UTC-7 in July (PDT) and UTC-8 in January (PST). An appointment
// at 8:30 in the morning is 8:30 in the morning either way; only the UTC stamp
// in the Google link moves.
const summer = googleCalendarUrl(ev("2026-07-20", 510, 540));
ok("PDT: 8:30 local becomes 15:30Z", summer.includes("20260720T153000Z"), summer);

const winter = googleCalendarUrl(ev("2026-01-20", 510, 540));
ok("PST: 8:30 local becomes 16:30Z", winter.includes("20260120T163000Z"), winter);

ok("Google link carries the timezone", summer.includes("ctz=America%2FVancouver"));

const ics = icsFeed([ev("2026-07-20", 510, 540)], new Date("2026-07-15T12:00:00Z"));

ok("CRLF line endings", ics.includes("\r\n") && !/[^\r]\n/.test(ics));
ok("has VTIMEZONE", ics.includes("BEGIN:VTIMEZONE") && ics.includes("TZID:America/Vancouver"));
ok("DTSTART is wall time + TZID", ics.includes("DTSTART;TZID=America/Vancouver:20260720T083000"));
ok("DTEND is wall time + TZID", ics.includes("DTEND;TZID=America/Vancouver:20260720T090000"));
ok("escapes ; and , per RFC 5545", ics.includes(String.raw`Alex Morgan\; Smith\, Jr`));
ok("stable UID per booking", ics.includes("UID:TAK-1234@phototak.onrender.com"));
ok("wrapped in VCALENDAR", ics.startsWith("BEGIN:VCALENDAR") && ics.trimEnd().endsWith("END:VCALENDAR"));
ok(
  "no line exceeds 75 octets",
  ics.split("\r\n").every((l) => Buffer.byteLength(l) <= 75),
  ics.split("\r\n").find((l) => Buffer.byteLength(l) > 75) ?? ""
);
ok("an empty calendar is still valid", icsFeed([]).includes("END:VCALENDAR"));

console.log(fail ? `\n${fail} failed\n` : "\nCalendar output valid\n");
process.exit(fail ? 1 : 0);
