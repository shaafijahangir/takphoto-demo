import Reveal from "@/components/Reveal";
import { StarIcon } from "@/components/icons";

const REVIEWS = [
  {
    quote: "Photo Tak captured our wedding day with such warmth and artistry. Every photo tells our story beautifully.",
    name: "Sarah & Michael",
    role: "Wedding Clients",
  },
  {
    quote: "Needed a US visa photo last minute — booked online, walked in, and had perfect prints in fifteen minutes. Accepted with zero issues.",
    name: "Priya N.",
    role: "US Visa Photo",
  },
  {
    quote: "Professional, efficient, and the results exceeded expectations. Perfect for our team's LinkedIn profiles.",
    name: "David Park",
    role: "Corporate Headshots",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad mx-auto max-w-8xl">
      <Reveal className="text-center">
        <p className="eyebrow">Kind Words</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">What Our Clients Say</h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r, idx) => (
          <Reveal key={r.name} delay={idx * 90}>
            <figure className="card h-full p-7">
              <div className="flex gap-0.5 text-sand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-ink/80">&ldquo;{r.quote}&rdquo;</blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-muted">{r.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
