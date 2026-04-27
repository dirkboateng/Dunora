import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { getLocale } from "@/lib/i18n/locale";
import { getStrings } from "@/lib/i18n/dict";

export const metadata = {
  title: "Dunora — Coming soon",
  description: "Dunora is a private platform for branded photo galleries. Currently under construction.",
};

const CONTACT_EMAIL = "dirk688@hotmail.nl";

const PREVIEW_PHOTOS = [
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1602674809970-a2dde4d09c0d?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=400&q=70",
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
      <div className="bg-accent-wash border-b border-accent/20 text-accent-deep text-xs font-semibold tracking-wide text-center py-2 px-4 uppercase">
        🔧 {t.underConstructionBanner}
      </div>

      <header className="border-b border-line bg-surface/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-4">
            <LanguageSwitcher current={locale} />
            <Link href="/login" className="text-sm font-medium text-ink-2 hover:text-ink transition-colors">
              {t.signIn}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-accent-wash text-accent-deep text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {t.badge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-1px] text-ink mb-6 leading-[1.05]">
                {t.headline}
              </h1>
              <p className="text-base md:text-lg text-ink-2 leading-relaxed mb-8 max-w-xl lg:mx-0 mx-auto">
                {t.subhead}
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3">
                <a href={betaMailto} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors">
                  {t.ctaPrimary}
                </a>
                <Link href="/login" className="inline-flex items-center justify-center text-sm font-semibold text-ink-2 hover:text-ink px-5 py-3 rounded-xl hover:bg-surface-2 transition-colors">
                  {t.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="relative">
              <PreviewMock
                previewLabel={t.previewLabel}
                galleryTitle={t.previewGalleryTitle}
                galleryMeta={t.previewGalleryMeta}
              />
              <p className="text-xs text-muted text-center mt-4 max-w-md mx-auto leading-relaxed">
                {t.previewCaption}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20 border-t border-line bg-surface/40">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.5px] text-ink mb-4">
              {t.audienceTitle}
            </h2>
            <p className="text-base text-ink-2 leading-relaxed">
              {t.audienceLead}
            </p>
          </div>
        </section>

        <section className="px-6 py-12 border-t border-line">
          <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
            <Pillar title={t.pillars.branded.title} caption={t.pillars.branded.caption} />
            <Pillar title={t.pillars.fast.title} caption={t.pillars.fast.caption} />
            <Pillar title={t.pillars.private.title} caption={t.pillars.private.caption} />
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface/40">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <span>{`\u00A9 ${year} Dunora. ${t.footerRights}`}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="hover:text-ink-2 transition-colors">{t.footerLegal}</Link>
            <a href={contactMailto} className="hover:text-ink-2 transition-colors">{t.footerContact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-semibold text-ink mb-1">{title}</div>
      <div className="text-xs text-muted leading-snug">{caption}</div>
    </div>
  );
}

function PreviewMock({
  previewLabel,
  galleryTitle,
  galleryMeta,
}: {
  previewLabel: string;
  galleryTitle: string;
  galleryMeta: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-surface-2 border-b border-line px-4 py-2.5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 flex-1 bg-surface rounded-md px-3 py-1 text-[10px] text-muted font-mono truncate">
          dunora.app/g/your-gallery
        </div>
        <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">{previewLabel}</span>
      </div>
      <div className="p-6 bg-bg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent" />
            <div className="text-sm font-bold text-ink">Studio</div>
          </div>
          <div className="text-[10px] text-muted">Powered by Dunora</div>
        </div>
        <div className="text-xl font-bold text-ink mb-1">{galleryTitle}</div>
        <div className="text-xs text-muted mb-5">{galleryMeta}</div>
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
