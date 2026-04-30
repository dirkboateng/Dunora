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
      <div className="bg-accent-deep text-white text-[11px] font-semibold tracking-[0.15em] text-center py-2 px-4 uppercase">
        {t.underConstruction}
      </div>

      <header className="border-b border-line/60 bg-surface/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
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
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-accent/8 blur-3xl" />
            <div className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full bg-emerald-200/20 blur-3xl" />
            <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-amber-200/15 blur-3xl" />
          </div>

          <div className="max-w-[860px] mx-auto px-6 pt-24 md:pt-36 pb-24 md:pb-32 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-wash text-accent-deep text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-9 border border-accent/15">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {t.badge}
            </div>
            <h1 className="text-[44px] md:text-[64px] lg:text-[80px] font-bold tracking-[-2px] text-ink leading-[0.98] mb-8">
              {t.headline}
            </h1>
            <p className="text-lg md:text-xl text-ink-2 leading-[1.55] mb-11 max-w-2xl mx-auto">
              {t.subhead}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={betaMailto} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-7 py-4 rounded-full transition-all shadow-sm hover:shadow-md">{t.ctaPrimary}</a>
              <Link href="/login" className="inline-flex items-center justify-center text-sm font-semibold text-ink-2 hover:text-ink px-7 py-4 rounded-full transition-colors">{t.ctaSecondary}</Link>
            </div>
            <p className="mt-20 text-[11px] text-muted uppercase tracking-[0.2em]">{`\u2193 ${t.scrollHint}`}</p>
          </div>
        </section>

        <section className="border-t border-line/60 bg-surface/40">
          <div className="max-w-[860px] mx-auto px-6 py-28 md:py-36 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-deep mb-5">{t.forWhomEyebrow}</div>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-bold tracking-[-1.2px] text-ink leading-[1.05] mb-7">{t.forWhomTitle}</h2>
            <p className="text-lg text-ink-2 leading-[1.7] max-w-2xl mx-auto">{t.forWhomLead}</p>
          </div>
        </section>

        <section className="border-t border-line/60">
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="grid md:grid-cols-3 gap-px bg-line/40 rounded-3xl overflow-hidden border border-line/40">
              {t.features.map((f, i) => (
                <div key={i} className="bg-surface p-10 md:p-12 hover:bg-surface-2/40 transition-colors">
                  <div className="text-[11px] font-mono text-accent-deep mb-7 tracking-wider">{`0${i + 1}`}</div>
                  <h3 className="text-xl font-bold text-ink mb-4 tracking-[-0.4px]">{f.title}</h3>
                  <p className="text-sm text-ink-2 leading-[1.7]">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line/60 bg-accent-deep relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-emerald-300 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full bg-emerald-400 blur-3xl" />
          </div>
          <div className="max-w-[860px] mx-auto px-6 py-28 md:py-36 relative text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-soft/80 mb-5">{t.closingEyebrow}</div>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-bold tracking-[-1.2px] text-white leading-[1.05] mb-7">{t.closingTitle}</h2>
            <p className="text-lg text-white/80 leading-[1.7] mb-11 max-w-2xl mx-auto">{t.closingBody}</p>
            <a href={betaMailto} className="inline-flex items-center justify-center bg-white hover:bg-white/95 text-accent-deep text-sm font-semibold px-7 py-4 rounded-full transition-all shadow-lg">{t.closingCta}</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/60 bg-surface/40">
        <div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
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
