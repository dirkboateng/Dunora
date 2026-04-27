import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

const phases = [
  {
    label: "Phase 1 — Now",
    title: "Core platform",
    items: [
      "Upload & project management",
      "Client-ready galleries",
      "Share links",
      "Watermarking",
    ],
    active: true,
  },
  {
    label: "Phase 2 — Soon",
    title: "Editing & presets",
    items: [
      "AI photo enhancement",
      "Lightroom-style presets",
      "Batch processing",
      "Before / after preview",
    ],
  },
  {
    label: "Phase 3 — Q3",
    title: "Smart recognition",
    items: [
      "Face recognition",
      "Jersey number detection",
      "Name on shirt",
      "Auto-delivery",
    ],
  },
  {
    label: "Phase 4 — Future",
    title: "Marketplace & automation",
    items: [
      "Team workflows",
      "API integrations",
      "Marketplace",
      "Advanced analytics",
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="Roadmap"
          title="Where we're going."
          sub="We're building fast. Here's what's shipping and what's coming."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 md:mt-16">
          {phases.map((phase) => (
            <div
              key={phase.label}
              className={cn(
                "rounded-2xl border p-6",
                phase.active
                  ? "bg-accent-wash/40 border-accent/25"
                  : "bg-surface border-line"
              )}
            >
              <div
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.1em] mb-3",
                  phase.active ? "text-accent-deep" : "text-accent"
                )}
              >
                {phase.label}
              </div>
              <div className="text-base font-semibold text-ink mb-4">
                {phase.title}
              </div>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-ink-2"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        phase.active ? "bg-accent" : "bg-muted-2"
                      )}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
