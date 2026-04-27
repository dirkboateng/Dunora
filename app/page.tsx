import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { getLocale } from "@/lib/i18n/locale";
import { getStrings } from "@/lib/i18n/dict";

export const metadata = {
  title: "Dunora — Coming soon",
  description: "Dunora is een privé platform voor branded foto-galerijen. Momenteel in aanbouw.",
};

const CONTACT_EMAIL = "dirk688@hotmail.nl";

const HERO_PHOTO =
  "https://images.pexels.com/photos/3886235/pexels-photo-3886235.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop";

const PREVIEW_PHOTOS = [
  "https://images.pexels.com/photos/3886260/pexels-photo-3886260.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
  "https://images.pexels.com/photos/12585886/pexels-photo-12585886.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
  "https://images.pexels.com/photos/30726628/pexels-photo-30726628.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
  "https://images.pexels.com/photos/9519496/pexels-photo-9519496.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
  "https://images.pexels.com/photos/21365074/pexels-photo-21365074.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
  "https://images.pexels.com/photos/3886241/pexels-photo-3886241.jpeg?auto=compress&cs=tinysrgb&w=600&h=750&fit=crop",
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard");

  const locale = await getLocale();
  const t = getStrings(locale);

  const betaMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Dunora beta access")}`;
  const contactMailto = `mailto:${CONTACT_EMAIL}`;
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="bg-accent text-white text-[11px] font-semibold tracking-[0.15em] text-center py-2.5 px-4 uppercase">
        {t.underConstructionBanner}
      </div>

      <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-[1320px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-5">
            <LanguageSwitcher current={locale} />
            <Link
              href="/login"
              className="text-sm font-medium text-ink-2 hover:text-ink transition-colors"
            >
              {t.signIn}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_PHOTO}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/65 to-ink/30" />
          <div className="relative max-w-[1320px] mx-auto px-6 py-28 md:py-36 lg:py-44">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
                {t.badge}
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-1.5px] text-white mb-7 leading-[1.02]">
                {t.headline}
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-xl">
                {t.subhead}
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                
                  href={betaMailto}
                  className="inline-flex items-center justify-center bg-white hover:bg-white/95 text-ink text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-lg"
                >
                  {t.ctaPrimary}
                </a>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-sm font-semibold text-white/90 hover:text-white px-6 py-3.5 rounded-full transition-colors border border-white/20 hover:border-white/40"
                >
                  {t.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE / MANIFESTO */}
        <section className="border-t border-line bg-surface/40">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <div className="text-accent text-3xl mb-6 font-serif">&ldquo;</div>
            <p className="font-serif text-2xl md:text-3xl text-ink leading-snug tracking-[-0.5px] mb-6">
              {t.manifesto}
            </p>
            <p className="text-sm text-muted uppercase tracking-[0.2em] font-semibold">
              {t.manifestoSignature}
            </p>
          </div>
        </section>

        {/* PREVIEW */}
        <section className="border-t border-line">
          <div className="max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="text-xs text-accent-deep font-semibold uppercase tracking-[0.2em] mb-4">
                  {t.previewLabel}
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-ink tracking-[-0.5px] leading-tight mb-5">
                  {t.previewTitle}
                </h2>
                <p className="text-base text-ink-2 leading-relaxed">
                  {t.previewCaption}
                </p>
              </div>
              <div className="lg:col-span-7">
                <PreviewMock
                  galleryTitle={t.previewGalleryTitle}
                  galleryMeta={t.previewGalleryMeta}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="border-t border-line bg-surface/40">
          <div className="max-w-[1320px] mx-auto px-6 py-20 md:py-28">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl text-ink tracking-[-0.5px] leading-tight mb-4">
                {t.audienceTitle}
              </h2>
              <p className="text-base text-ink-2 leading-relaxed max-w-2xl mx-auto">
                {t.audienceLead}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Pillar number="01" title={t.pillars.branded.title} caption={t.pillars.branded.caption} />
              <Pillar number="02" title={t.pillars.fast.title} caption={t.pillars.fast.caption} />
              <Pillar number="03" title={t.pillars.private.title} caption={t.pillars.private.caption} />
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="border-t border-line">
          <div className="max-w-[1320px] mx-auto px-6 py-20 md:py-24">
            <div className="bg-ink text-white rounded-3xl px-8 md:px-14 py-14 md:py-16 text-center">
              <h2 className="font-serif text-3xl md:text-4xl tracking-[-0.5px] mb-4">
                {t.ctaStripTitle}
              </h2>
              <p className="text-base text-white/70 leading-relaxed mb-8 max-w-xl mx-auto">
                {t.ctaStripBody}
              </p>
              
                href={betaMailto}
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-colors"
              >
                {t.ctaPrimary}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface/40">
        <div className="max-w-[1320px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <span>{`\u00A9 ${year} Dunora. ${t.footerRights}`}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legal" className="hover:text-ink-2 transition-colors">
              {t.footerLegal}
            </Link>
            <a href={contactMailto} className="hover:text-ink-2 transition-colors">
              {t.footerContact}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ number, title, caption }: { number: string; title: string; caption: string }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-7">
      <div className="text-xs font-mono text-accent-deep mb-4 tracking-wider">{number}</div>
      <div className="font-serif text-xl text-ink mb-2 tracking-[-0.3px]">{title}</div>
      <div className="text-sm text-ink-2 leading-relaxed">{caption}</div>
    </div>
  );
}

function PreviewMock({
  galleryTitle,
  galleryMeta,
}: {
  galleryTitle: string;
  galleryMeta: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-surface-2 border-b border-line px-4 py-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 flex-1 bg-surface rounded-md px-3 py-1 text-[11px] text-muted font-mono truncate">
          dunora.app/g/your-gallery
        </div>
      </div>
      <div className="p-7 bg-bg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent" />
            <div className="text-sm font-bold text-ink tracking-tight">Studio</div>
          </div>
          <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">
            Powered by Dunora
          </div>
        </div>
        <div className="font-serif text-2xl text-ink mb-1 tracking-[-0.3px]">{galleryTitle}</div>
        <div className="text-xs text-muted mb-6">{galleryMeta}</div>
        <div className="grid grid-cols-3 gap-2">
          {PREVIEW_PHOTOS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="aspect-[4/5] w-full object-cover rounded-lg bg-surface-2"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
