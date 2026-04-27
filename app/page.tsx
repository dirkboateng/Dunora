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
         {t.underConstructionBanner}
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
        <section className="px-6 py-16 md:
