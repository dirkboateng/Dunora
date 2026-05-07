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

interface LandingPhotoRow {
  slot: number;
  storage_path: string;
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard");

  const locale = await getLocale();
  const t = getStrings(locale);
  const betaMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Dunora beta access")}`;
  const contactMailto = `mailto:${CONTACT_EMAIL}`;
  const year = new Date().getFullYear();

  const { data: photoRows } = await supabase
    .from("landing_photos")
    .select("slot, storage_path")
    .order("slot", { ascending: true });

  const rows = (photoRows ?? []) as LandingPhotoRow[];
  const photoUrls: (string | null)[] = [null, null, null, null, null, null];
  for (const row of rows) {
    if (row.slot >= 1 && row.slot <= 6) {
      const { data: pub } = supabase.storage.from("landing").getPublicUrl(row.storage_path);
      photoUrls[row.slot - 1] = pub.publicUrl;
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="bg-accent-deep text-white text-[11px] font-semibold tracking-[0.15em] text-center py-2 px-4 uppercase">
        {t.underConstruction}
      </div>

      <header className="border-b border-line/60 bg-surface/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-5">
            <LanguageSwitcher current={locale} />
            <Link href="/login" className="text-sm font-medium text-ink-2 hover:text-ink transition-colors">{t.signIn}</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute top-32 -right-40 w-[480px] h-[480px] rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-amber-200/20 blur-3xl" />
          </div>

          <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-accent-wash text-accent-deep text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-7 border border-accent/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {t.badge}
                </div>
                <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold tracking-[-1.5px] text-ink leading-[1] mb-7">{t.headline}</h1>
                <p className="text-base md:text-lg text-ink-2 leading-[1.6] mb-9 max-w-xl lg:mx-0 mx-auto">{t.subhead}</p>
                <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3">
                  <a href={betaMailto} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md">{t.ctaPrimary}</a>
                  <Link href="/login" className="inline-flex items-center justify-center text-sm font-semibold text-ink-2 hover:text-ink px-6 py-3.5 rounded-full transition-colors">{t.ctaSecondary}</Link>
                </div>
                <p className="mt-12 text-[11px] text-muted uppercase tracking-[0.2em] hidden lg:block">{`\u2193 ${t.scrollHint}`}</p>
              </div>

              <div className="lg:col-span-6">
                <PreviewMock previewLabel={t.previewLabel} galleryName={t.previewGallery} meta={t.previewMeta} poweredBy={t.previewBy} photoUrls={photoUrls} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line/60 bg-surface/40">
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-deep mb-4">{t.forWhomEyebrow}</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-[-1px] text-ink leading-[1.05] mb-6">{t.forWhomTitle}</h2>
              <p className="text-base md:text-lg text-ink-2 leading-[1.7]">{t.forWhomLead}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-line/60">
          <div className="max-w-[1100px] mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-px bg-line/40 rounded-3xl overflow-hidden border border-line/40">
              {t.features.map((f, i) => (
                <div key={i} className="bg-surface p-8 md:p-10 hover:bg-surface-2/40 transition-colors">
                  <div className="text-[11px] font-mono text-muted mb-6">{`0${i + 1}`}</div>
                  <h3 className="text-lg font-bold text-ink mb-3 tracking-[-0.3px]">{f.title}</h3>
                  <p className="text-sm text-ink-2 leading-[1.65]">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line/60 bg-accent-deep relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-emerald-300 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full bg-emerald-400 blur-3xl" />
          </div>
          <div className="max-w-[900px] mx-auto px-6 py-24 md:py-32 relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-soft/80 mb-4">{t.closingEyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-1px] text-white leading-[1.05] mb-6 max-w-2xl">{t.closingTitle}</h2>
            <p className="text-base md:text-lg text-white/80 leading-[1.7] mb-10 max-w-2xl">{t.closingBody}</p>
            <a href={betaMailto} className="inline-flex items-center justify-center bg-white hover:bg-white/95 text-accent-deep text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-lg">{t.closingCta}</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/60 bg-surface/40">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <span>{`\u00A9 ${year} Dunora. ${t.footerRights}`}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legal" className="hover:text-ink-2 transition-colors">{t.footerLegal}</Link>
            <a href={contactMailto} className="hover:text-ink-2 transition-colors">{t.footerContact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewMock({ previewLabel, galleryName, meta, poweredBy, photoUrls }: { previewLabel: string; galleryName: string; meta: string; poweredBy: string; photoUrls: (string | null)[] }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-4 bg-gradient-to-br from-emerald-200/40 via-transparent to-amber-200/30 rounded-3xl blur-2xl -z-10" />
      <div className="bg-surface border border-line/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-surface-2 border-b border-line px-4 py-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          <div className="ml-3 flex-1 bg-surface rounded-md px-3 py-1.5 text-[11px] text-muted font-mono truncate">dunora.app/g/match-day</div>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.15em]">{previewLabel}</span>
        </div>
        <div className="px-7 py-7 bg-bg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-accent" />
              <div className="text-sm font-bold text-ink tracking-tight">Studio</div>
            </div>
            <div className="text-[10px] text-muted font-medium">{poweredBy}</div>
          </div>
          <div className="text-2xl font-bold text-ink mb-1 tracking-[-0.5px]">{galleryName}</div>
          <div className="text-xs text-muted mb-6">{meta}</div>
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const url = photoUrls[i];
              return url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="aspect-[4/5] w-full object-cover rounded-lg bg-surface-2"
                  loading="lazy"
                />
              ) : (
                <div
                  key={i}
                  className="aspect-[4/5] w-full rounded-lg bg-gradient-to-br from-accent-wash via-surface-2 to-emerald-100 flex items-center justify-center text-[10px] text-muted font-mono"
                >
                  Slot {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
