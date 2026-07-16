import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { all } from "@/lib/db";
import { minutesToLabel, toLocalDateLabel } from "@/lib/types";
import { toLocalDate } from "@/lib/availability";
import { ArrowRightIcon, CalendarIcon, ClockIcon, PhoneIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today's Schedule · Photo Tak Victoria",
  description: "Every appointment booked at the studio, newest day first.",
};

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

/** Upcoming bookings, grouped by day. This is the studio's morning view. */
function upcoming(): Map<string, Row[]> {
  const today = toLocalDate(new Date());
  const rows = all<Row>(
    `SELECT b.reference, s.name AS service_name, s.price_display,
            b.customer_name, b.email, b.phone, b.date, b.start_min, b.end_min
       FROM bookings b
       JOIN services s ON s.id = b.service_id
      WHERE b.date >= ?
      ORDER BY b.date, b.start_min`,
    today
  );

  const byDay = new Map<string, Row[]>();
  for (const r of rows) {
    const list = byDay.get(r.date) ?? [];
    list.push(r);
    byDay.set(r.date, list);
  }
  return byDay;
}

export default function SchedulePage() {
  const byDay = upcoming();
  const days = [...byDay.keys()];
  const total = days.reduce((n, d) => n + (byDay.get(d)?.length ?? 0), 0);

  return (
    <>
      <Navbar />
      <main className="section-pad mx-auto max-w-4xl">
        <p className="eyebrow">Studio View</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          What&apos;s coming up
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Every appointment booked online, oldest first. This is the page you open with
          your coffee: no inbox to dig through, no phone tag, just the day laid out.
        </p>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson/10 text-crimson">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-ink">Rather see this in Google Calendar?</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Bookings can feed straight into the calendar you already have open in
                Gmail. In Google Calendar, go to <span className="font-medium text-ink">Other
                calendars</span>, then <span className="font-medium text-ink">From URL</span>,
                and paste this address. New appointments appear on their own.
              </p>
              <code className="mt-3 block overflow-x-auto rounded-lg bg-cloud px-3 py-2 text-xs text-ink">
                https://phototak.onrender.com/calendar.ics
              </code>
              <a
                href="/calendar.ics"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson transition-all hover:gap-2.5"
              >
                Download the feed
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-crimson/10 text-crimson">
              <CalendarIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">
              Nothing booked yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Book an appointment and it shows up here the second it&apos;s made.
            </p>
            <a href="/book" className="btn-primary mt-6 inline-flex !px-5 !py-2 text-sm">
              Go to booking
            </a>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {days.map((day) => {
              const rows = byDay.get(day) ?? [];
              return (
                <section key={day}>
                  <div className="flex items-baseline justify-between border-b border-ink/10 pb-3">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      {toLocalDateLabel(day)}
                    </h2>
                    <span className="text-sm text-muted">
                      {rows.length} {rows.length === 1 ? "appointment" : "appointments"}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {rows.map((r) => (
                      <li
                        key={r.reference}
                        className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson/10 text-crimson">
                            <ClockIcon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-semibold text-ink">
                              {minutesToLabel(r.start_min)} – {minutesToLabel(r.end_min)}
                            </p>
                            <p className="text-sm text-muted">
                              {r.service_name} · {r.price_display}
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-medium text-ink">{r.customer_name}</p>
                          <p className="flex items-center gap-1.5 text-sm text-muted sm:justify-end">
                            <PhoneIcon className="h-3.5 w-3.5" />
                            <a href={`tel:${r.phone}`} className="hover:text-crimson">
                              {r.phone}
                            </a>
                          </p>
                          <p className="text-xs text-muted">
                            <a href={`mailto:${r.email}`} className="hover:text-crimson">
                              {r.email}
                            </a>
                            <span className="ml-2 font-semibold text-crimson">{r.reference}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
