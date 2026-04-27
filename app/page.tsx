import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Dunora — Coming soon",
  description: "Dunora is a private platform for photographers building polished client galleries.",
};

const CONTACT_EMAIL = "dirk688@hotmail.nl";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard");

  const betaMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Dunora beta access")}`;
  const contactMailto = `mailto:${CONTACT_EMAIL}`;
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-line bg-surface/60 backdrop-blur">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={28} />
          <Link href="/login" className="text-sm font-medium text-ink-2 hover:text-ink transition-colors">Sign in</Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent-wash text-accent-deep text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            In private beta
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-1px] text-ink mb-6 leading-[1.05]">A quieter way to deliver photos.</h1>
          <p className="text-lg md:text-xl text-ink-2 leading-relaxed mb-10 max-w-lg mx-auto">Dunora is being built for photographers who want polished, branded galleries without the noise of bloated tools. We are opening this up carefully and slowly, by invitation, for now.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a href={betaMailto} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors">Request beta access</a>
            <Link href="/login" className="inline-flex items-center justify-center text-sm font-semibold text-ink-2 hover:text-ink px-5 py-3 rounded-xl hover:bg-surface-2 transition-colors">Already invited? Sign in</Link>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-10 border-t border-line">
            <Pillar title="Branded" caption="Your studio, your style." />
            <Pillar title="Fast" caption="Drag-drop uploads. No fuss." />
            <Pillar title="Private" caption="Password-gated by default." />
          </div>
        </div>
      </main>
      <footer className="border-t border-line">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div>{`\u00A9 ${year} Dunora. All rights reserved.`}</div>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="hover:text-ink-2 transition-colors">Legal</Link>
            <a href={contactMailto} className="hover:text-ink-2 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ title, caption }: { title: string; caption: string }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink mb-1">{title}</div>
      <div className="text-xs text-muted leading-snug">{caption}</div>
    </div>
  );
}
