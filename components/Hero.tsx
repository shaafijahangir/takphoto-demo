"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, ShieldIcon, ClockIcon } from "@/components/icons";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80&auto=format&fit=crop",
    eyebrow: "Timeless Weddings",
    title: "Wedding Photography in Victoria",
    sub: "Capturing your most precious moments with artistry, warmth, and timeless elegance across Vancouver Island.",
  },
  {
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80&auto=format&fit=crop",
    eyebrow: "Elegant Portraits",
    title: "Modelling & Portrait Sessions",
    sub: "Stunning, professional portraits that highlight your unique features and style.",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&auto=format&fit=crop",
    eyebrow: "Business Ready",
    title: "Corporate Headshots & Visa Photos",
    sub: "Polished headshots and government-compliant passport & visa prints — done right, done fast.",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-ink text-paper">
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{ opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.img}
            alt={s.title}
            className={`h-full w-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-8xl flex-col justify-center px-5 sm:px-8 lg:px-20">
        <div key={i} className="max-w-2xl animate-fade-up">
          <p className="eyebrow text-crimsonsoft">{SLIDES[i].eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {SLIDES[i].title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-paper/80">{SLIDES[i].sub}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#book" className="btn-primary">
              Book Passport / Visa Photo
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#work" className="btn-outline-light">
              Explore Our Work
            </a>
          </div>

          {/* differentiator badges */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/75">
            <span className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-sand" /> Ready in ~15 minutes
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-sand" /> Government-spec guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* slide dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-7 bg-crimson" : "w-2 bg-paper/50 hover:bg-paper/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
