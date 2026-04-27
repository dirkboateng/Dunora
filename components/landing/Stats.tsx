const stats = [
  { num: "10,000+", label: "Photos processed in beta" },
  { num: "< 2s", label: "Average upload speed" },
  { num: "5 min", label: "From upload to gallery" },
  { num: "∞", label: "Photos per project" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-surface-2/50">
      <div className="container-page py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-accent-deep">
                {stat.num}
              </div>
              <div className="text-xs md:text-sm text-muted mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
