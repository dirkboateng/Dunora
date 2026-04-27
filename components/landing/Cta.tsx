import Link from "next/link";

export function Cta() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(4,120,87,0.10), transparent 70%)",
        }}
      />

      <div className="container-page relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-[0.1em] text-accent mb-4">
            Get started
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.05] text-ink">
            Stop sending messy
            <br />
            transfer links.
          </h2>
          <p className="text-base md:text-lg text-ink-2 leading-relaxed mt-5 max-w-lg mx-auto">
            Upload once. Deliver smarter. Join photographers and clubs already
            using Dunora to save hours on every shoot.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-base font-semibold px-6 py-3.5 rounded-[14px] transition-all hover:-translate-y-0.5 hover:shadow-cta"
            >
              Start your first gallery
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center bg-surface border border-line-strong text-ink hover:bg-surface-2 text-base font-semibold px-6 py-3.5 rounded-[14px] transition-all hover:-translate-y-0.5"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
