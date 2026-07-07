import Reveal from "@/components/Reveal";

const TILES = [
  { label: "Wedding", img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80&auto=format&fit=crop", span: "lg:row-span-2" },
  { label: "Modelling", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop", span: "" },
  { label: "Baby & Family", img: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80&auto=format&fit=crop", span: "" },
  { label: "Corporate Headshots", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop", span: "" },
  { label: "Real Estate", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop", span: "" },
];

export default function FeaturedWork() {
  return (
    <section id="work" className="bg-cloud/60 scroll-mt-24">
      <div className="section-pad mx-auto max-w-8xl">
        <Reveal className="text-center">
          <p className="eyebrow">Portfolio</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">Featured Work</h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-3">
          {TILES.map((t, idx) => (
            <Reveal key={t.label} delay={idx * 70} className={`group ${t.span}`}>
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.img}
                  alt={`${t.label} photography, Photo Tak Victoria BC`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                  {t.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
