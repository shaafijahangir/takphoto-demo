import path from "node:path";
import fs from "node:fs";
import { minutesToLabel, priceLabel, type Service } from "./types";
import { googleCalendarUrl } from "./calendar";

/**
 * Where booking alerts go. This is a DEMO, so alerts default to The Base Blocks,
 * not the studio's real inbox: nobody should be spammed by a stranger clicking
 * through a sales demo. On handover, set NOTIFY_TO to takphoto.inc@gmail.com so
 * whoever is on shift sees new appointments come in.
 */
const NOTIFY_TO = process.env.NOTIFY_TO || "shaafi.jahangir@thebaseblocks.com";
const NOTIFY_FROM = process.env.NOTIFY_FROM || "Photo Tak Bookings <bookings@takphoto.ca>";
const SITE_URL = process.env.SITE_URL || "https://phototak.onrender.com";
const LOG_PATH = path.join(process.cwd(), "data", "notifications.log");

export interface BookingNotice {
  reference: string;
  service: Service;
  date: string;
  start_min: number;
  end_min: number;
  customer_name: string;
  email: string;
  phone: string;
}

function subjectFor(n: BookingNotice): string {
  return `New booking ${n.reference} · ${n.service.name} · ${n.date} ${minutesToLabel(n.start_min)}`;
}

function bodyFor(n: BookingNotice): string {
  const service = n.service.size_label
    ? `${n.service.name} (${n.service.size_label})`
    : n.service.name;
  return [
    `New ${n.service.name} appointment booked.`,
    ``,
    `Reference:  ${n.reference}`,
    `Service:    ${service}`,
    `Price:      ${n.service.price_display || priceLabel(n.service.price_cents)}`,
    `Date:       ${n.date}`,
    `Time:       ${minutesToLabel(n.start_min)} – ${minutesToLabel(n.end_min)}`,
    ``,
    `Customer:   ${n.customer_name}`,
    `Email:      ${n.email}`,
    `Phone:      ${n.phone}`,
    ``,
    `Add to Google Calendar:`,
    googleCalendarUrl(n),
    ``,
    `Your full schedule: ${SITE_URL}/schedule`,
    ``,
    `Sent automatically by the Photo Tak booking system.`,
  ].join("\n");
}

/**
 * Fire a booking notification. Sends a real email through Resend when
 * RESEND_API_KEY is present; otherwise logs to the console and appends to
 * data/notifications.log so the demo runs with zero secrets. Never throws; a
 * failed notification must not fail the customer's booking.
 */
export async function notifyBooking(n: BookingNotice): Promise<void> {
  const subject = subjectFor(n);
  const body = bodyFor(n);

  try {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: [NOTIFY_TO],
          reply_to: n.email,
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        console.error("[notify] Resend send failed:", res.status, await res.text());
      } else {
        console.log(`[notify] Emailed ${NOTIFY_TO}: ${subject}`);
      }
      return;
    }

    // No provider configured; demo/dev fallback.
    console.log(`\n[notify] (no RESEND_API_KEY) would email ${NOTIFY_TO}:\n${subject}\n${body}\n`);
    const line = `=== ${new Date().toISOString()} → ${NOTIFY_TO} ===\n${subject}\n${body}\n\n`;
    fs.appendFile(LOG_PATH, line, () => {});
  } catch (e) {
    console.error("[notify] unexpected error:", e);
  }
}
