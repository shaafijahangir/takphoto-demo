import Reveal from "@/components/Reveal";
import BookingWizard from "@/components/BookingWizard";
import { ShieldIcon, ClockIcon, IdCardIcon, SparkleIcon } from "@/components/icons";

const POINTS = [
  {
    icon: ClockIcon,
    title: "Book any service online",
    body: "Passport photos, headshots, portraits, families, weddings, listings. Pick a time that works, no phone tag, no waiting on a reply.",
  },
  {
    icon: ShieldIcon,
    title: "Government photos guaranteed",
    body: "Every passport and visa photo is checked against the current spec before you leave. If it's ever rejected, we reshoot and reprint free.",
  },
  {
    icon: IdCardIcon,
    title: "Real hours, real availability",
    body: "You only ever see times the studio is genuinely open and free. Mon to Fri 8:30am to 5pm, Sat 10am to 4pm.",
  },
  {
    icon: SparkleIcon,
    title: "Weddings & listings: consult first",
    body: "For a wedding or a property, book a free 30-minute consult. We'll talk through the day and quote it properly instead of guessing.",
  },
];

export default function BookingSection() {
  return (
    <section id="book" className="scroll-mt-24 bg-cloud/60">
      <div className="section-pad mx-auto grid max-w-8xl gap-12 lg:grid-cols-[minmax(17rem,20rem)_minmax(0,1fr)] lg:items-start">
        {/* Left: value column */}
        <Reveal className="lg:sticky lg:top-28">
          <p className="eyebrow">Book Online</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Pick a time. We&apos;ll take it from there.
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            Everything the studio does can be booked right here, from a 15-minute visa photo
            to a wedding consultation. Choose a service, grab a slot, and you&apos;re done.
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
        <Reveal delay={120} className="min-w-0">
          <BookingWizard />
        </Reveal>
      </div>
    </section>
  );
}
