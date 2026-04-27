/**
 * Self-contained dashboard mockup for the hero section.
 * Pure CSS — no images, no JS. Renders in ~1 KB of DOM.
 *
 * Visual story: a project mid-processing, gallery ready to publish,
 * share link in clipboard.
 */
export function HeroMockup() {
  // Photo cell gradients — abstract, museum-friendly, brand-aligned
  const photoGradients = [
    "from-accent-deep to-accent",
    "from-accent to-accent-bright",
    "from-accent-bright to-emerald-300",
    "from-slate-700 to-slate-500",
    "from-slate-500 to-slate-300",
    "bg-surface-3",
    "from-accent-deep via-accent to-emerald-300",
    "from-slate-600 to-slate-400",
  ];

  return (
    <div className="relative">
      {/* Floating "AI Enhanced" badge */}
      <div className="absolute -top-4 -right-2 md:-right-6 z-10 bg-surface border border-line rounded-2xl px-3.5 py-2.5 shadow-card flex items-center gap-2.5 animate-fade-in-up">
        <div className="w-7 h-7 rounded-lg bg-accent-wash flex items-center justify-center text-accent">
          ✨
        </div>
        <div>
          <div className="text-[11px] font-semibold text-ink leading-tight">
            AI enhanced
          </div>
          <div className="text-[10px] text-muted leading-tight">
            246 photos processed
          </div>
        </div>
      </div>

      {/* Floating "Published" badge */}
      <div
        className="absolute -bottom-4 -left-2 md:-left-6 z-10 bg-surface border border-line rounded-2xl px-3.5 py-2.5 shadow-card flex items-center gap-2.5 animate-fade-in-up"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="w-7 h-7 rounded-lg bg-accent-wash flex items-center justify-center text-accent">
          ↑
        </div>
        <div>
          <div className="text-[11px] font-semibold text-ink leading-tight">
            Gallery published
          </div>
          <div className="text-[10px] text-muted leading-tight">
            Link ready to share
          </div>
        </div>
      </div>

      {/* Main mockup card */}
      <div className="bg-surface border border-line rounded-3xl p-5 shadow-card">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70" />
          <span className="ml-2 text-[11px] font-semibold text-ink-2">
            Quick 1888 vs Orion — U17
          </span>
        </div>

        {/* Project header */}
        <div className="bg-accent-wash border border-accent/15 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">
              Quick 1888 vs Orion
            </div>
            <div className="text-[11px] text-muted mt-0.5">
              Football match · 22 April 2026
            </div>
          </div>
          <span className="bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Processing
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="text-muted">Processing photos</span>
            <span className="text-accent font-semibold">246 / 420</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full"
              style={{ width: "58%" }}
            />
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {photoGradients.map((gradient, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg ${
                gradient.startsWith("bg-")
                  ? `${gradient} border border-line`
                  : `bg-gradient-to-br ${gradient}`
              }`}
            />
          ))}
        </div>

        {/* Share card */}
        <div className="bg-surface-2 border border-line rounded-xl px-3.5 py-2.5 flex items-center justify-between">
          <span className="text-[11px] font-mono text-accent truncate">
            dunora.app/g/quick1888-orion
          </span>
          <button
            className="bg-accent text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg ml-2 shrink-0"
            type="button"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
