import { SectionHeading } from "./SectionHeading";

const useCases = [
  { icon: "⚽", title: "Football photographers" },
  { icon: "🎉", title: "Event photographers" },
  { icon: "🏫", title: "Schools & academies" },
  { icon: "🏆", title: "Clubs & organizations" },
  { icon: "📸", title: "Content agencies" },
];

export function UseCases() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="Built for"
          title="Who uses Dunora?"
          sub="From solo photographers to multi-team operations. Dunora scales with your workflow."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-12 md:mt-16">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-surface border border-line rounded-2xl p-6 text-center transition-all duration-200 hover:border-accent/30 hover:bg-accent-wash/40 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{useCase.icon}</div>
              <div className="text-sm font-semibold text-ink-2">
                {useCase.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
