export type ServiceCategory = "gov" | "studio";

export interface Service {
  id: number;
  slug: string;
  name: string;
  /** "gov" = fixed-price government photo, "studio" = session or consultation. */
  category: ServiceCategory;
  /** e.g. "Canada" | "United States"; the issuing authority. Empty for studio work. */
  country: string;
  /** Printed photo size, human readable. e.g. "35 × 45 mm". Empty for studio work. */
  size_label: string;
  duration_min: number;
  price_cents: number;
  /** What the customer sees: "$30", "From $120", "Quote", "No charge". */
  price_display: string;
  /** Qualifier under the price: "for 2 prints", "per digital file". */
  price_note: string;
  description: string;
  /** Newline-separated spec bullets shown on the service card. */
  specs: string;
}

export interface Booking {
  id: number;
  reference: string;
  service_id: number;
  customer_name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  start_min: number;
  end_min: number;
  created_at: string;
}

/** Open/close in minutes from midnight for one weekday. */
export interface DayHours {
  open: number;
  close: number;
}

/**
 * Real posted hours for the Broughton St studio: Mon-Fri 8:30am-5pm,
 * Sat 10am-4pm, Sun closed. Availability is generated from this, so the
 * booking form can never offer a time the studio is shut.
 * 0 = Sunday … 6 = Saturday.
 */
export const STUDIO_HOURS: Record<number, DayHours | null> = {
  0: null,
  1: { open: 8 * 60 + 30, close: 17 * 60 },
  2: { open: 8 * 60 + 30, close: 17 * 60 },
  3: { open: 8 * 60 + 30, close: 17 * 60 },
  4: { open: 8 * 60 + 30, close: 17 * 60 },
  5: { open: 8 * 60 + 30, close: 17 * 60 },
  6: { open: 10 * 60, close: 16 * 60 },
};

export function hoursFor(weekday: number): DayHours | null {
  return STUDIO_HOURS[weekday] ?? null;
}

export function isClosedOn(weekday: number): boolean {
  return hoursFor(weekday) === null;
}

/** "Today", "Tomorrow", or "Thursday, 17 July" from a YYYY-MM-DD string. */
export function toLocalDateLabel(date: string, now: Date = new Date()): string {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target.getTime() - midnight.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return target.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** "9:30 AM" from minutes-from-midnight. */
export function minutesToLabel(min: number): string {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function priceLabel(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
