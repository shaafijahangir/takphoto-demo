"use client";

import { useEffect, useMemo, useState } from "react";
import {
  minutesToLabel,
  isClosedOn,
  type Service,
} from "@/lib/types";
import {
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@/components/icons";

type Slot = { min: number; label: string };
type StepKey = "service" | "datetime" | "details" | "confirm";

const STEP_DEFS: { key: StepKey; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "datetime", label: "Date & Time" },
  { key: "details", label: "Your Details" },
  { key: "confirm", label: "Confirm" },
];

function nextDays(n: number): { value: string; label: string; closed: boolean }[] {
  const out = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label =
      i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    out.push({ value, label, closed: isClosedOn(d.getDay()) });
  }
  return out;
}

/**
 * Per-service wording for the wizard. Same flow underneath: booking a wedding
 * consult and booking a visa photo are different errands, and generic copy
 * ("Pick a date & time") is what makes a booking form feel stock. Text only,
 * no behaviour changes here.
 */
interface Copy {
  datetimeHeading: string;
  datetimeHint: string;
  detailsHeading: string;
  detailsHint: string;
  confirmHeading: string;
  confirmCta: string;
  doneHeading: string;
  doneBody: string;
}

const DEFAULT_COPY: Copy = {
  datetimeHeading: "Pick a date & time",
  datetimeHint: "Choose a day and we'll show you what's still open.",
  detailsHeading: "Your details",
  detailsHint: "We'll send your confirmation here and hold your slot.",
  confirmHeading: "Confirm your appointment",
  confirmCta: "Confirm Booking",
  doneHeading: "Appointment Confirmed",
  doneBody: "See you at 623 Broughton St, Victoria. Your slot is held and the studio has been notified.",
};

const COPY: Record<string, Partial<Copy>> = {
  "canada-visa-photo": {
    datetimeHeading: "When can you pop in?",
    datetimeHint: "You're in and out in about 15 minutes, prints in hand.",
    confirmHeading: "Confirm your photo appointment",
    doneHeading: "Your photo slot is booked",
    doneBody: "See you at 623 Broughton St. Bring your glasses off and we'll do the rest. Prints are checked against the IRCC spec before you leave.",
  },
  "us-visa-photo": {
    datetimeHeading: "When can you pop in?",
    datetimeHint: "About 15 minutes for your 2 × 2 in prints, checked and done.",
    confirmHeading: "Confirm your photo appointment",
    doneHeading: "Your photo slot is booked",
    doneBody: "See you at 623 Broughton St. Ask on the day if you need the digital file for an online form.",
  },
  "corporate-headshot": {
    datetimeHeading: "When can you sit for us?",
    datetimeHint: "Twenty minutes under the lights is all it takes.",
    detailsHint: "We'll confirm here and send your retouched file to the same address.",
    confirmHeading: "Confirm your sitting",
    confirmCta: "Book my sitting",
    doneHeading: "Your sitting is booked",
    doneBody: "See you at 623 Broughton St. Bring a couple of options to wear and we'll help you pick on the day.",
  },
  "portrait-modelling": {
    datetimeHeading: "When should we shoot?",
    datetimeHint: "An hour in the studio, or tell us where you'd rather be.",
    detailsHint: "We'll confirm here and follow up about looks and location.",
    confirmHeading: "Confirm your session",
    confirmCta: "Book my session",
    doneHeading: "Your session is booked",
    doneBody: "See you at 623 Broughton St. We'll reach out beforehand to talk through looks, wardrobe, and whether you'd rather shoot on location.",
  },
  "baby-family-session": {
    datetimeHeading: "When suits everyone?",
    datetimeHint: "About an hour. Pick the time of day your little ones are happiest.",
    detailsHint: "We'll confirm here and check in about your group before the day.",
    confirmHeading: "Confirm your family session",
    confirmCta: "Book our session",
    doneHeading: "Your family session is booked",
    doneBody: "See you at 623 Broughton St. We'll be in touch about who's coming and where you'd like to shoot, then we'll quote it properly. No rush on the day.",
  },
  "wedding-consultation": {
    datetimeHeading: "When can we talk it through?",
    datetimeHint: "Half an hour, no charge, no obligation. Coffee is on us.",
    detailsHint: "We'll confirm here. Feel free to bring your partner along.",
    confirmHeading: "Confirm your consultation",
    confirmCta: "Book our consult",
    doneHeading: "Your consultation is booked",
    doneBody: "See you at 623 Broughton St. Bring your date, your venue, and anything you've saved. We'll show you full galleries and quote your day properly afterwards.",
  },
  "real-estate-consultation": {
    datetimeHeading: "When can we go over the listing?",
    datetimeHint: "Half an hour to scope the property and your turnaround.",
    detailsHint: "We'll confirm here and follow up with the property details.",
    confirmHeading: "Confirm your consultation",
    confirmCta: "Book my consult",
    doneHeading: "Your consultation is booked",
    doneBody: "See you at 623 Broughton St. Bring the address and your timeline and we'll quote stills, twilight, and floor plans from there.",
  },
};

function copyFor(s: Service | null | undefined): Copy {
  if (!s) return DEFAULT_COPY;
  return { ...DEFAULT_COPY, ...(COPY[s.slug] ?? {}) };
}

const GROUPS: { key: Service["category"]; title: string; blurb: string }[] = [
  {
    key: "gov",
    title: "Passport & Visa Photos",
    blurb: "Fixed price, printed and verified while you wait.",
  },
  {
    key: "studio",
    title: "Studio Sessions & Consultations",
    blurb: "Sittings, sessions, and no-charge consults for weddings and listings.",
  },
];

/**
 * Booking wizard for every service the studio offers, against a single
 * station: service → date & time → details → confirm. Availability comes from
 * /api/availability (all bookings share one timeline, so no double-booking).
 * `?service=<slug>` preselects and jumps straight to picking a time.
 */
export default function BookingWizard() {
  const steps = STEP_DEFS;
  const lastIndex = steps.length - 1;

  const [step, setStep] = useState(0);
  const current = steps[step]?.key;

  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);

  const days = useMemo(() => nextDays(14), []);
  const copy = copyFor(service);

  // Load services, then honour ?service=<slug> from a card on the homepage by
  // preselecting it and opening on the date step. Read off window.location so
  // this page stays statically renderable (useSearchParams would bail it out).
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        const list: Service[] = d.services ?? [];
        setServices(list);
        const slug = new URLSearchParams(window.location.search).get("service");
        const preset = slug ? list.find((s) => s.slug === slug) : undefined;
        if (preset) {
          setService(preset);
          setStep(1);
        }
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (!service || !date) return;
    setLoadingSlots(true);
    setSlot(null);
    fetch(`/api/availability?serviceId=${service.id}&date=${date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [service, date]);

  async function submit() {
    if (!service || !slot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date,
          startMin: slot.min,
          name,
          email,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not complete booking. Please pick another time.");
      } else {
        setConfirmed(data.booking);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setConfirmed(null);
    setStep(0);
    setService(null);
    setDate("");
    setSlot(null);
    setName("");
    setEmail("");
    setPhone("");
    setError("");
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canNext =
    (current === "service" && !!service) ||
    (current === "datetime" && !!slot) ||
    (current === "details" && name.trim().length > 1 && emailOk && phone.trim().length >= 7);

  if (confirmed) return <Confirmation booking={confirmed} onAgain={reset} />;

  return (
    <div>
      <Stepper steps={steps} step={step} />

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-card sm:p-8" data-testid="wizard">
        <div key={current} className="step-enter">
          {/* STEP: SERVICE */}
          {current === "service" && (
            <div data-step="service">
              <h3 className="font-display text-xl font-semibold text-ink">What can we shoot for you?</h3>
              <p className="mt-1 text-sm text-muted">
                Everything we do is bookable here, at our Broughton St studio.
              </p>

              {loadError && (
                <p className="mt-5 rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson">
                  Could not load our services just now. Please refresh, or call the studio
                  at (778) 433-8257.
                </p>
              )}

              {GROUPS.map((g) => {
                const inGroup = services.filter((s) => s.category === g.key);
                if (inGroup.length === 0) return null;
                return (
                  <div key={g.key} className="mt-6">
                    <h4 className="font-semibold text-ink">{g.title}</h4>
                    <p className="mt-0.5 text-xs text-muted">{g.blurb}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {inGroup.map((s) => {
                        const on = service?.id === s.id;
                        const specs = s.specs.split("\n").filter(Boolean);
                        return (
                          <button
                            key={s.id}
                            data-testid="service-option"
                            data-slug={s.slug}
                            onClick={() => { setService(s); setSlot(null); }}
                            className={`flex flex-col rounded-xl border p-5 text-left transition ${
                              on ? "border-crimson bg-crimson/[0.05]" : "border-ink/12 hover:border-crimson/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="block font-semibold text-ink">{s.name}</span>
                                {s.size_label && <span className="text-sm text-muted">{s.size_label}</span>}
                              </div>
                              <div className="shrink-0 text-right">
                                <span className="block font-display text-lg font-bold text-crimson">
                                  {s.price_display}
                                </span>
                                {s.price_note && (
                                  <span className="block text-[10px] text-muted">{s.price_note}</span>
                                )}
                              </div>
                            </div>
                            <ul className="mt-3 space-y-1.5">
                              {specs.map((sp) => (
                                <li key={sp} className="flex items-start gap-2 text-xs text-muted">
                                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" />
                                  {sp}
                                </li>
                              ))}
                            </ul>
                            <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink/60">
                              <ClockIcon className="h-3.5 w-3.5" /> {s.duration_min} min appointment
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP: DATE & TIME */}
          {current === "datetime" && (
            <div data-step="datetime">
              <h3 className="font-display text-xl font-semibold text-ink">{copy.datetimeHeading}</h3>
              <p className="mt-1 text-sm text-muted">{copy.datetimeHint}</p>
              <div className="scroll-crimson mt-4 flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => (
                  <button
                    key={d.value}
                    data-testid="date-option"
                    disabled={d.closed}
                    onClick={() => setDate(d.value)}
                    className={`shrink-0 rounded-xl border px-4 py-3 text-center text-sm transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      date === d.value ? "border-crimson bg-crimson/10 text-ink" : "border-ink/12 text-ink/70 hover:border-crimson/50"
                    }`}
                  >
                    {d.label}
                    {d.closed && <span className="mt-0.5 block text-[10px] text-muted">Closed</span>}
                  </button>
                ))}
              </div>

              {!date && <p className="mt-6 text-sm text-muted">Select a date to see open times.</p>}
              {date && (
                <div className="mt-6" data-testid="slots">
                  {loadingSlots ? (
                    <p className="text-sm text-muted">Loading times…</p>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted">No open times for this day. Try another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {slots.map((s) => (
                        <button
                          key={s.min}
                          data-testid="slot-option"
                          data-min={s.min}
                          onClick={() => setSlot(s)}
                          className={`rounded-lg border px-2 py-2 text-sm transition ${
                            slot?.min === s.min ? "border-crimson bg-crimson text-paper" : "border-ink/15 text-ink/80 hover:border-crimson"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP: DETAILS */}
          {current === "details" && (
            <div data-step="details">
              <h3 className="font-display text-xl font-semibold text-ink">{copy.detailsHeading}</h3>
              <p className="mt-1 text-sm text-muted">{copy.detailsHint}</p>
              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="text-sm text-ink/70">Full name</span>
                  <input
                    data-testid="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-crimson"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/70">Email</span>
                  <input
                    data-testid="input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-crimson"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/70">Phone number</span>
                  <input
                    data-testid="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 250-555-0199"
                    className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-crimson"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP: CONFIRM */}
          {current === "confirm" && service && slot && (
            <div data-step="confirm">
              <h3 className="font-display text-xl font-semibold text-ink">{copy.confirmHeading}</h3>
              <dl className="mt-5 divide-y divide-ink/10 text-sm">
                <Row k="Service" v={serviceLine(service)} />
                <Row k="Price" v={priceLine(service)} />
                <Row k="Date" v={date} />
                <Row k="Time" v={`${minutesToLabel(slot.min)} – ${minutesToLabel(slot.min + service.duration_min)}`} />
                <Row k="Name" v={name} />
                <Row k="Email" v={email} />
                <Row k="Phone" v={phone} />
              </dl>
              {error && (
                <p className="mt-4 rounded-lg bg-crimson/10 px-4 py-3 text-sm text-crimson" data-testid="booking-error">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Running summary */}
        {service && current !== "confirm" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-crimson/20 bg-crimson/[0.04] px-4 py-3 text-sm">
            <span className="text-ink/70">
              <span className="font-semibold text-crimson">{service.name}</span>
              {slot && <span className="text-ink/50"> · {date} {slot.label}</span>}
            </span>
            <span className="font-semibold text-crimson">{service.duration_min} min · {service.price_display}</span>
          </div>
        )}

        {/* NAV */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-outline !px-5 !py-2 text-sm disabled:opacity-30"
          >
            Back
          </button>
          {step < lastIndex ? (
            <button
              data-testid="next-btn"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-primary !px-6 !py-2 text-sm"
            >
              Continue
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              data-testid="confirm-btn"
              onClick={submit}
              disabled={submitting}
              className="btn-primary !px-6 !py-2 text-sm"
            >
              {submitting ? "Booking…" : copy.confirmCta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ steps, step }: { steps: { key: StepKey; label: string }[]; step: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map(({ key, label }, i) => (
        <div
          key={key}
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
            i === step ? "bg-crimson text-paper" : i < step ? "bg-crimson/15 text-crimson" : "bg-ink/[0.06] text-ink/40"
          }`}
        >
          <span className="font-semibold">{i + 1}</span> {label}
        </div>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-3">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium text-ink">{v}</dd>
    </div>
  );
}

/** "Canada Visa Photo · 35 × 45 mm", or just the name for studio work. */
function serviceLine(s: Service): string {
  return s.size_label ? `${s.name} · ${s.size_label}` : s.name;
}

/** "$30 for 2 prints", "No charge · 30 minute consult". */
function priceLine(s: Service): string {
  return s.price_note ? `${s.price_display} · ${s.price_note}` : s.price_display;
}

function Confirmation({ booking, onAgain }: { booking: any; onAgain: () => void }) {
  const s: Service = booking.service;
  const copy = copyFor(s);
  return (
    <div className="animate-scale-in rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-card" data-testid="confirmation">
      <div
        className="animate-pop-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-crimson/12 text-crimson"
        style={{ animationDelay: "0.15s" }}
      >
        <CheckCircleIcon className="h-10 w-10" />
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold text-ink">{copy.doneHeading}</h2>
      <p className="mt-2 text-muted">
        Your booking reference is{" "}
        <span className="font-semibold text-crimson" data-testid="booking-ref">{booking.reference}</span>.
      </p>
      <div className="mx-auto mt-6 max-w-sm rounded-xl border border-ink/10 bg-paper p-5 text-left text-sm">
        <Row k="Service" v={serviceLine(s)} />
        <Row k="Price" v={priceLine(s)} />
        <Row k="Date" v={booking.date} />
        <Row k="Time" v={`${minutesToLabel(booking.start)} – ${minutesToLabel(booking.end)}`} />
      </div>
      <p className="mx-auto mt-6 max-w-md text-sm text-muted">
        {copy.doneBody} Quote your reference if you need to move it: (778) 433-8257.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a href="/" className="btn-outline !px-5 !py-2 text-sm">Back to home</a>
        <button onClick={onAgain} className="btn-primary !px-5 !py-2 text-sm" data-testid="book-another">
          Book another
        </button>
      </div>
    </div>
  );
}
