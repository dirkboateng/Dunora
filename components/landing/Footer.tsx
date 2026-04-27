import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Beta access", href: "/register" },
      { label: "Contact", href: "mailto:hello@dunora.app" },
      { label: "Support", href: "mailto:support@dunora.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy & terms", href: "/legal" },
      { label: "Security", href: "/legal#security" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-12">
          <div>
            <Logo size={32} />
            <p className="text-sm text-ink-2 leading-relaxed mt-4 max-w-xs">
              AI-powered photo delivery for modern photographers. Upload once.
              Deliver smarter.
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-muted mb-4">
                {group.title}
              </div>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-2 hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line mt-12 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-xs text-muted">
            © {new Date().getFullYear()} Dunora · AI-powered photo delivery.
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 bg-accent-wash text-accent-deep px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Built in the EU · Hosted in Frankfurt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
