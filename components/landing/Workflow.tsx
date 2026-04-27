import { SectionHeading } from "./SectionHeading";

const steps = [
  { n: "01", title: "Create a project", desc: "Name your shoot, add client info, set your defaults." },
  { n: "02", title: "Upload photos", desc: "Drag and drop your entire shoot. Resumable, parallel." },
  { n: "03", title: "Apply preset or AI", desc: "One-click enhancement or choose from curated presets." },
  { n: "04", title: "Add watermark", desc: "Brand previews automatically with your logo." },
  { n: "05", title: "Publish gallery", desc: "Build a clean, client-facing gallery in seconds." },
  { n: "06", title: "Share with client", desc: "One link. No login. Fast downloads. Done." },
];

export function Workflow() {
  return (
    <section id="workflow" className="bg-surface-2/40 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="How it works"
          title={
            <>
              From upload to delivery,
              <br />
              in minutes.
            </>
          }
        />

        <div className="relative mt-12 md:mt-20">
          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-7 right-7 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4">
            {steps.map((step) => (
              <div key={step.n} className="text-center px-2">
                <div className="relative w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center bg-accent-wash border border-accent/20 text-accent font-bold text-sm">
                  {step.n}
                </div>
                <div className="text-sm font-semibold text-ink mb-2">
                  {step.title}
                </div>
                <div className="text-xs text-ink-2 leading-relaxed">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
