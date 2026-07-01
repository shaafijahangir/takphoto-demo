import Reveal from "@/components/Reveal";
import { SparkleIcon, CameraIcon, ShieldIcon } from "@/components/icons";

const ITEMS = [
  {
    icon: CameraIcon,
    title: "Guided Posing",
    body: "We make you feel comfortable and confident, guiding you naturally through each pose for authentic, beautiful results.",
  },
  {
    icon: SparkleIcon,
    title: "Premium Editing",
    body: "Every image is professionally edited with our signature warm, timeless style that you'll love for years to come.",
  },
  {
    icon: ShieldIcon,
    title: "Calm Experience",
    body: "From booking to delivery we create a stress-free, enjoyable experience tailored to your needs and timeline.",
  },
];

export default function WhyChoose() {
  return (
    <section id="why" className="scroll-mt-24 bg-charcoal text-paper">
      <div className="section-pad mx-auto max-w-8xl">
        <Reveal className="text-center">
          <p className="eyebrow text-crimsonsoft">Why Photo Tak</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">A studio that puts you at ease</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((it, idx) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.title} delay={idx * 90}>
                <div className="h-full rounded-2xl border border-white/10 bg-coal p-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand/15 text-sand">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">{it.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">{it.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
