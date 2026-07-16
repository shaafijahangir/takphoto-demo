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
    <section id="book" className="scroll-mt-24">
      {/* Band 1, paper: what this is and why it's worth using. */}
      <div className="bg-paper px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:px-20">
        <div className="mx-auto max-w-8xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Book Online</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
              Pick a time. We&apos;ll take it from there.
            </h2>
            <p className="mt-4 text-muted">
              Everything the studio does can be booked right here, from a 15-minute visa
              photo to a wedding consultation. Choose a service, grab a slot, and
              you&apos;re done.
            </p>
          </Reveal>

          {/* The four reasons, across the top rather than down the side */}
          <div className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 70}>
                  <div className="text-center sm:text-left">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-crimson/10 text-crimson">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-semibold text-ink">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* Band 2, cloud: the booking itself. The tint is what makes the white
          wizard card lift off the page instead of dissolving into it. */}
      <div className="border-t border-ink/5 bg-cloud/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-20">
        <Reveal delay={120} className="mx-auto min-w-0 max-w-4xl">
          <BookingWizard />
        </Reveal>
      </div>
    </section>
  );
}
