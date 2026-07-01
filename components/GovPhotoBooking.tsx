import Reveal from "@/components/Reveal";
import BookingWizard from "@/components/BookingWizard";
import { ShieldIcon, ClockIcon, IdCardIcon, SparkleIcon } from "@/components/icons";

const POINTS = [
  {
    icon: ShieldIcon,
    title: "Guaranteed compliant",
    body: "Every photo is checked against the current government spec before you leave. If it's ever rejected, we reshoot and reprint free.",
  },
  {
    icon: ClockIcon,
    title: "In and out in ~15 minutes",
    body: "Book a slot, walk in, walk out with prints. No waiting room, no guesswork — one appointment, done.",
  },
  {
    icon: IdCardIcon,
    title: "Canada & US sizes",
    body: "35 × 45 mm for Canadian applications, 2 × 2 in for US visa, green card, and passport. Correct dimensions, every time.",
  },
  {
    icon: SparkleIcon,
    title: "Digital copy included",
    body: "Need to upload to an online form? Ask for the digital file and we'll email a spec-correct copy alongside your prints.",
  },
];

export default function GovPhotoBooking() {
  return (
    <section id="book" className="scroll-mt-24 bg-cloud/60">
      <div className="section-pad mx-auto grid max-w-8xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Left: value column */}
        <Reveal className="lg:sticky lg:top-28">
          <p className="eyebrow">Passport & Visa Photos</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Government photos, done right — and done fast
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            Skip the drugstore reprints. Book a 15-minute slot at our Victoria studio and leave with
            prints that meet the exact Canadian or US requirements.
          </p>

          <div className="mt-8 space-y-5">
            {POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson/10 text-crimson">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Right: the booking wizard */}
        <Reveal delay={120}>
          <BookingWizard />
        </Reveal>
      </div>
    </section>
  );
}
