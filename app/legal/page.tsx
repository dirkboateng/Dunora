import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Legal & privacy",
  description:
    "How Dunora handles your data, our terms of service, and security practices.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="container-page h-[72px] flex items-center justify-between">
          <Link href="/" className="inline-flex">
            <Logo size={32} />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink-2 hover:text-ink transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 container-page py-16 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-wash border border-accent/20 rounded-full px-3 py-1 text-xs font-semibold text-accent-deep mb-6">
            Beta phase
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-ink mb-3">
            Legal &amp; privacy
          </h1>
          <p className="text-ink-2 leading-relaxed mb-12">
            Dunora is currently in private beta. Below is how we handle your
            data and what you can expect. Formal Terms of Service, a Privacy
            Policy, and a Data Processing Agreement (DPA) ship with the public
            launch. Until then, the principles below govern our relationship.
          </p>

          <Section title="What we are">
            <p>
              Dunora (operated by{" "}
              <span className="font-medium text-ink">Dunora B.V.</span>, the
              Netherlands) is a SaaS platform for photographers, sports clubs,
              and event teams to organize and deliver photos to their clients.
            </p>
          </Section>

          <Section title="Where your data lives">
            <p>
              All databases and files are hosted on{" "}
              <span className="font-medium text-ink">
                Supabase, Frankfurt (eu-central-1)
              </span>
              . Photos, projects, and account information never leave the EU.
              Web traffic is served via Vercel&apos;s global edge with EU
              compute regions for our app.
            </p>
          </Section>

          <Section title="What we collect">
            <ul className="space-y-2">
              <li>
                Account information you provide: name, email, account type,
                workspace name, brand color.
              </li>
              <li>
                Content you create: projects, galleries, and (when uploads
                ship) photos.
              </li>
              <li>
                Standard server logs: IP address, browser, request timestamps,
                kept 30 days for security.
              </li>
              <li>
                No tracking pixels, no third-party analytics, no advertising
                cookies during beta.
              </li>
            </ul>
          </Section>

          <Section title="Who can see your content">
            <ul className="space-y-2">
              <li>
                <span className="font-medium text-ink">Private galleries:</span>{" "}
                only you and members you invite (post-launch).
              </li>
              <li>
                <span className="font-medium text-ink">
                  Password galleries:
                </span>{" "}
                anyone with the link AND the password you set.
              </li>
              <li>
                <span className="font-medium text-ink">Public galleries:</span>{" "}
                anyone with the link. No password required.
              </li>
              <li>
                Database row-level security ensures other users on Dunora can
                never see your projects, galleries, or photos through the API.
              </li>
            </ul>
          </Section>

          <Section title="What you can do">
            <ul className="space-y-2">
              <li>
                Export your data: email{" "}
                <a
                  href="mailto:support@dunora.app"
                  className="text-accent-deep font-medium hover:text-accent"
                >
                  support@dunora.app
                </a>{" "}
                — we&apos;ll provide a JSON dump within 14 days.
              </li>
              <li>
                Delete your account: email the same address. We delete all
                associated data within 30 days, except backups (90 days).
              </li>
              <li>
                Change your password and account settings any time inside the
                app.
              </li>
              <li>
                Request a Data Processing Agreement before paid plans launch:
                we&apos;ll send a draft on request.
              </li>
            </ul>
          </Section>

          <Section title="Beta-specific terms">
            <ul className="space-y-2">
              <li>
                The product is provided &quot;as-is&quot; during beta — we ship
                fast and bugs may occur. We aim for &lt;4-hour response on
                support during business hours.
              </li>
              <li>
                Beta is free. Beta members get founding-member pricing when
                paid plans launch (50% off Pro for 12 months).
              </li>
              <li>
                We may make breaking changes during beta with at least 7 days
                notice via email. We will not delete your data without
                explicit warning.
              </li>
              <li>
                You retain full ownership of all photos and content you
                upload. We do not use your content for marketing without your
                explicit written permission.
              </li>
            </ul>
          </Section>

          <Section title="Security">
            <ul className="space-y-2">
              <li>
                Passwords are stored using industry-standard hashing (Supabase
                Auth — bcrypt-based).
              </li>
              <li>
                Connections to our app and storage use TLS 1.3.
              </li>
              <li>
                Service-role keys never touch the browser; all mutations route
                through server actions.
              </li>
              <li>
                Storage buckets enforce per-workspace RLS at the path level.
              </li>
              <li>
                If you discover a security issue, please email{" "}
                <a
                  href="mailto:security@dunora.app"
                  className="text-accent-deep font-medium hover:text-accent"
                >
                  security@dunora.app
                </a>
                . We aim to respond within 24 hours and credit responsible
                disclosures publicly.
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Questions about anything here:{" "}
              <a
                href="mailto:support@dunora.app"
                className="text-accent-deep font-medium hover:text-accent"
              >
                support@dunora.app
              </a>
              . We read every email.
            </p>
          </Section>

          <p className="text-xs text-muted mt-12 pt-8 border-t border-line">
            Last updated: April 2026. This page replaces separate Terms /
            Privacy / Cookie / Security pages until the public launch, when
            formal documents will be published.
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-ink mb-3">{title}</h2>
      <div className="text-sm text-ink-2 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
