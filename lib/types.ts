export interface Service {
  id: number;
  slug: string;
  name: string;
  /** e.g. "Canada" | "United States" — the issuing authority. */
  country: string;
  /** Printed photo size, human readable. e.g. "35 × 45 mm". */
  size_label: string;
  duration_min: number;
  price_cents: number;
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

/** Studio operating hours (minutes from midnight) for the single photo station. */
export const STUDIO_OPEN = 10 * 60; // 10:00
export const STUDIO_CLOSE = 18 * 60; // 18:00
/** 0 = Sunday … 6 = Saturday. Studio is closed on these weekdays. */
export const CLOSED_WEEKDAYS = new Set<number>([0]); // closed Sundays

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
