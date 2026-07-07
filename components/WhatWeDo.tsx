import Reveal from "@/components/Reveal";
import { CameraIcon, VideoIcon, IdCardIcon, ArrowRightIcon } from "@/components/icons";

const ITEMS = [
  {
    icon: CameraIcon,
    title: "Photography",
    body: "From intimate portraits to grand celebrations: weddings, family portraits, and professional business photography, each session crafted to reflect your story.",
  },
  {
    icon: VideoIcon,
    title: "Videography",
    body: "Cinematic storytelling that brings your moments to life, capturing the emotion and atmosphere of your events with a natural, story-first approach.",
  },
  {
    icon: IdCardIcon,
    title: "Passport & Visa Photos",
    body: "Government-compliant Canadian and US visa & passport photos, printed, checked, and in your hands in about 15 minutes. Book a slot below.",
    href: "/book",
    cta: "Book a slot",
    highlight: true,
  },
];

export default function WhatWeDo() {
  return (
    <section id="about" className="section-pad mx-auto max-w-8xl scroll-mt-24">
      <Reveal className="text-center">
        <p className="eyebrow">What We Do</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          Capturing life&apos;s meaningful moments
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Luxury photography and videography in Victoria, plus fast, compliant government photos when you need them.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ITEMS.map((it, idx) => {
          const Icon = it.icon;
          return (
            <Reveal key={it.title} delay={idx * 90}>
              <div
                className={`card card-hover h-full p-8 ${
                  it.highlight ? "border-crimson/30 bg-crimson/[0.04]" : ""
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    it.highlight ? "bg-crimson text-paper" : "bg-cloud text-crimson"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{it.body}</p>
                {it.href && (
                  <a
                    href={it.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:gap-2.5 transition-all"
                  >
                    {it.cta}
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
