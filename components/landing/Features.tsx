import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: "↑",
    title: "Fast uploads",
    desc: "Upload entire shoots and organize them into projects in seconds. Resumable on flaky connections.",
  },
  {
    icon: "✦",
    title: "AI photo enhancement",
    desc: "Apply smart corrections and presets across your gallery with a single click. Batch process thousands.",
  },
  {
    icon: "▢",
    title: "Client-ready galleries",
    desc: "Share clean download pages without messy transfer links. Branded, secure, fast.",
  },
  {
    icon: "○",
    title: "Watermark control",
    desc: "Protect previews with branded watermarks automatically. Originals only when you choose.",
  },
  {
    icon: "◇",
    title: "Smart sorting",
    desc: "Prepare for face, jersey number and name-based delivery. The future of photo automation.",
  },
  {
    icon: "▤",
    title: "Built for volume",
    desc: "Designed for events, matches and large batches. Handle 10,000+ photos per project comfortably.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="Features"
          title={
            <>
              Everything after the shoot,
              <br />
              in one place.
            </>
          }
          sub="Stop stitching together WeTransfer, Lightroom, Dropbox and email. Dunora handles delivery end-to-end."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-12 md:mt-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-surface border border-line rounded-2xl p-7 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-wash text-accent flex items-center justify-center text-lg font-semibold mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-ink mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
