import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "Is Dunora only for photographers?",
    a: "No. Sports clubs, event organizers, schools, dance academies and agencies all use Dunora to manage and deliver photo galleries at scale.",
  },
  {
    q: "Can I use my own presets?",
    a: "Yes. In Phase 2 you can import Lightroom presets (.XMP) or create custom ones directly inside Dunora. Your grade, your workflow.",
  },
  {
    q: "Does Dunora replace WeTransfer?",
    a: "It replaces WeTransfer and so much more. Instead of messy download links, you get branded galleries with client access, watermarks, analytics and smart delivery.",
  },
  {
    q: "Can clients download their photos?",
    a: "You decide. Enable full gallery downloads, single photo downloads, or disable downloads entirely. Watermarks on previews, originals on download — your call.",
  },
  {
    q: "Is AI recognition available now?",
    a: "Smart delivery with face and jersey number recognition is in beta development. You can join the waitlist. Core photo management is available today.",
  },
  {
    q: "Can I use this for football clubs?",
    a: "Absolutely. Dunora is built specifically for high-volume sports photography — matches, tournaments, academies. Smart jersey number recognition is on the roadmap.",
  },
];

export function Faq() {
  return (
    <section className="bg-surface-2/40 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading label="FAQ" title="Got questions?" />

        <div className="grid md:grid-cols-2 gap-4 mt-12 md:mt-16">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-surface border border-line rounded-2xl p-6 transition-colors hover:border-accent/25 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 list-none">
                <h3 className="text-[15px] font-semibold text-ink">{faq.q}</h3>
                <span
                  aria-hidden
                  className="shrink-0 w-7 h-7 rounded-full bg-surface-2 group-hover:bg-accent-wash text-ink-2 group-hover:text-accent flex items-center justify-center text-sm transition-all group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-sm text-ink-2 leading-relaxed mt-4 pr-10">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
