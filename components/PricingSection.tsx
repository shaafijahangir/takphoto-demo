import Reveal from "@/components/Reveal";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";

type Tier = {
  name: string;
  price: string;
  unit?: string;
  duration: string;
  includes: string[];
  href: string;
  cta: string;
  featured?: boolean;
};

// Prices reflect what the studio has confirmed by email; the rest are
// quote-based until the studio hands over exact package pricing.
const STUDIO: Tier[] = [
  {
    name: "Corporate Headshots",
    price: "$50",
    unit: "per digital file",
    duration: "~20 min session",
    includes: [
      "Professional lighting & retouch",
      "High-res digital file, ready to use",
      "Extra files $50 each",
    ],
    href: "/#contact",
    cta: "Enquire",
  },
  {
    name: "Portrait & Modelling",
    price: "From $120",
    unit: "per session",
    duration: "45–60 min session",
    includes: [
      "Studio or on-location",
      "Selection of edited images",
      "Add digital files as needed",
    ],
    href: "/#contact",
    cta: "Enquire",
  },
  {
    name: "Baby, Family & Events",
    price: "Custom quote",
    duration: "Varies by shoot",
    includes: [
      "Tailored to group size & location",
      "Weddings, families, celebrations",
      "Digital gallery delivered",
    ],
    href: "/#contact",
    cta: "Get a quote",
  },
];

const GOV: Tier[] = [
  {
    name: "Canada Visa / Passport Photo",
    price: "$30",
    unit: "for 2 prints",
    duration: "~15 min, walk out with prints",
    includes: [
      "35 × 45 mm, IRCC-compliant",
      "Checked against current gov spec",
      "Free reshoot if ever rejected",
    ],
    href: "/book",
    cta: "Book online",
    featured: true,
  },
  {
    name: "US Visa / Passport Photo",
    price: "$30",
    unit: "for 2 prints",
    duration: "~15 min, walk out with prints",
    includes: [
      "2 × 2 in, US Dept. of State spec",
      "Digital file for online forms on request",
      "Free reshoot if ever rejected",
    ],
    href: "/book",
    cta: "Book online",
    featured: true,
  },
];

function TierCard({ t }: { t: Tier }) {
  return (
    <div
      className={`card card-hover flex h-full flex-col p-7 ${
        t.featured ? "ring-1 ring-crimson/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">{t.name}</h3>
        {t.featured && (
          <span className="shrink-0 rounded-full bg-crimson px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper">
            Book online
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-ink">{t.price}</span>
        {t.unit && <span className="text-sm text-muted">{t.unit}</span>}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-crimson">
        <ClockIcon className="h-3.5 w-3.5" />
        {t.duration}
      </p>

      <ul className="mt-5 space-y-2.5 text-sm text-muted">
        {t.includes.map((i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson/60" />
            {i}
          </li>
        ))}
      </ul>

      <a
        href={t.href}
        className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson transition-all hover:gap-2.5"
      >
        {t.cta}
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="section-pad mx-auto max-w-8xl">
        <Reveal className="text-center">
          <p className="eyebrow">Services & Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Here&apos;s what everything costs and how long it takes, so you know before you
            walk in. Passport and visa photos are a fixed price and you can book them
            online. For studio sessions, send us a quick note and we&apos;ll take care of the
            details.
          </p>
        </Reveal>

        {/* Government photos: fixed price, bookable */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold text-ink">Passport & Visa Photos</h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {GOV.map((t, i) => (
              <Reveal key={t.name} delay={i * 70}>
                <TierCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Studio sessions */}
        <div className="mt-14">
          <h3 className="font-display text-xl font-semibold text-ink">Studio Sessions</h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIO.map((t, i) => (
              <Reveal key={t.name} delay={i * 70}>
                <TierCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Hours strip */}
        <Reveal>
          <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-6 text-center text-sm text-muted sm:flex sm:items-center sm:justify-center sm:gap-8 sm:text-left">
            <p>
              <span className="font-semibold text-ink">Studio hours:</span>{" "}
              Mon–Fri 8:30am–5pm · Sat 10am–4pm · Sun closed
            </p>
            <p className="mt-2 sm:mt-0">
              <span className="font-semibold text-ink">Walk-in or book:</span>{" "}
              623 Broughton St, Victoria · (778) 433-8257
            </p>
          </div>
        </Reveal>

        <p className="mt-6 text-center text-xs text-muted">
          All prices in CAD. Your final total is confirmed when you book. Not sure what you
          need? Give us a call and we&apos;ll help you figure it out.
        </p>
      </div>
    </section>
  );
}
