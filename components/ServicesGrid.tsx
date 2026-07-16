import Reveal from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";

// Every card books. `href` carries the service slug so /book opens on the
// right one instead of dropping the customer at the top of the wizard.
const SERVICES = [
  {
    title: "Wedding Photography",
    body: "Beautiful, timeless wedding photography throughout Victoria and Vancouver Island.",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=wedding-consultation",
    cta: "Book a consult",
  },
  {
    title: "Modelling & Portrait",
    body: "Elegant portraits that highlight your unique features and style.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=portrait-modelling",
    cta: "Book a session",
  },
  {
    title: "Baby & Family",
    body: "Natural family portraits that capture the love and connection you share.",
    img: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=baby-family-session",
    cta: "Book a session",
  },
  {
    title: "Corporate Headshots",
    body: "Professional, modern headshots that showcase confidence and authenticity.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=corporate-headshot",
    cta: "Book a sitting",
  },
  {
    title: "Real Estate",
    body: "Premium real estate photography that helps listings sell faster.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=real-estate-consultation",
    cta: "Book a consult",
  },
  {
    title: "Passport & Visa Photos",
    body: "Government-compliant Canadian & US photos, printed and verified in ~15 minutes.",
    img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=700&q=80&auto=format&fit=crop",
    href: "/book?service=canada-visa-photo",
    cta: "Book a slot",
    featured: true,
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="section-pad mx-auto max-w-8xl scroll-mt-24">
      <Reveal className="text-center">
        <p className="eyebrow">Our Services</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          Everything you need, in one studio
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Every service here can be booked online. Pick a time that suits you and
          we&apos;ll see you at Broughton St.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, idx) => (
          <Reveal key={s.title} delay={idx * 70}>
            <a
              href={s.href}
              className={`card card-hover group block h-full overflow-hidden ${
                s.featured ? "ring-1 ring-crimson/30" : ""
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={`${s.title}, Photo Tak Victoria BC`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {s.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-crimson px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper">
                    Book online
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson transition-all group-hover:gap-2.5">
                  {s.cta}
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
