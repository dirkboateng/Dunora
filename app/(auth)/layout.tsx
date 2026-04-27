import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Soft top accent — subtle photo-museum feel */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(4,120,87,0.06), transparent 70%)",
        }}
      />

      <header className="relative z-10 px-6 py-6 md:px-10 md:py-8">
        <Link href="/" className="inline-flex">
          <Logo size={36} />
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>

      <footer className="relative z-10 px-6 py-6 text-center text-sm text-muted">
        <span>© {new Date().getFullYear()} Dunora · </span>
        <Link href="/privacy" className="hover:text-ink-2">Privacy</Link>
        <span> · </span>
        <Link href="/terms" className="hover:text-ink-2">Terms</Link>
      </footer>
    </div>
  );
}
