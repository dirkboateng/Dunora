import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Link href="/" className="inline-flex">
          <Logo size={32} />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="max-w-[440px] w-full text-center">
          <div className="text-[80px] font-bold tracking-[-3px] text-accent leading-none mb-2">
            404
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
            Page not found
          </h1>
          <p className="text-sm text-ink-2 leading-relaxed mb-8">
            This page doesn&apos;t exist or has been moved. Check the link, or
            head back to where you came from.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary">Back home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
