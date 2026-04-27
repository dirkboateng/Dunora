import Link from "next/link";
import { HeroMockup } from "./HeroMockup";

const featureBadges = [
  "AI enhancement",
  "Client galleries",
  "Smart delivery",
  "Watermarks",
  "Presets",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft museum-glow background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(4,120,87,0.08), transparent 70%), radial-gradient(ellipse 50% 30% at 80% 20%, rgba(16,185,129,0.05), transparent 70%)",
        }}
      />

      <div className="container-page relative pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-accent-wash border border-accent/20 rounded-full px-3.5 py-1.5 text-xs font-semibold text-accent-deep mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Now in beta — limited access
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.02] text-ink">
              Your photo workflow,{" "}
              <span className="text-accent">automated.</span>
            </h1>

            <p className="text-base md:text-lg text-ink-2 leading-relaxed mt-5 max-w-[480px]">
              Dunora helps photographers upload, enhance, organize and deliver
              galleries faster — powered by AI. Built for sports, events and
              high-volume shoots.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-base font-semibold px-6 py-3.5 rounded-[14px] transition-all hover:-translate-y-0.5 hover:shadow-cta"
              >
                Claim your beta workspace
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center bg-surface border border-line-strong text-ink hover:bg-surface-2 text-base font-semibold px-6 py-3.5 rounded-[14px] transition-all hover:-translate-y-0.5"
              >
                See how it works
              </a>
            </div>

            <div className="flex items-center gap-3 mt-8 text-sm text-muted">
              <div className="flex">
                {["D", "M", "S", "K"].map((letter, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 -ml-2 first:ml-0 rounded-full border-2 border-bg flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{
                      background: `hsl(${i * 30 + 150}, 50%, 38%)`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <span>
                Built for photographers, sports clubs and event teams.
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-8">
              {featureBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-surface-2 border border-line rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-2"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: mockup */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
