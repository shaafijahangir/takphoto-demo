import Reveal from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1600&q=80&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="section-pad relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow text-crimsonsoft">Ready When You Are</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Need a passport, visa, or portrait session?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/75">
            Book a 15-minute government photo slot online, or reach out to plan a full session.
            We&apos;ll take care of the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/book" className="btn-primary">
              Book Passport / Visa Photo
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#contact" className="btn-outline-light">
              Contact the Studio
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
