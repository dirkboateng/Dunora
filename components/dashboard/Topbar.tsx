import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  workspaceName: string;
  email: string;
  role?: string;
}

export function Topbar({ workspaceName, email, role }: TopbarProps) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-line">
      <div className="h-16 px-5 md:px-8 flex items-center justify-between gap-4">
        {/* Mobile: hamburger + logo. Desktop: workspace pill (links to settings). */}
        <div className="lg:hidden flex items-center gap-2">
          <MobileNav />
          <Link href="/dashboard">
            <Logo size={28} />
          </Link>
        </div>

        <Link
          href="/dashboard/settings"
          className="hidden lg:flex items-center gap-2 min-w-0 group rounded-lg px-1.5 py-1 -mx-1.5 hover:bg-surface-2 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-accent-wash text-accent flex items-center justify-center text-xs font-bold">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink truncate">{workspaceName}</div>
            {role && (
              <div className="text-[11px] text-muted capitalize">{role}</div>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/settings"
            className="hidden sm:flex items-center gap-2.5 group rounded-lg px-2 py-1 -mx-2 hover:bg-surface-2 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-semibold">
              {initials}
            </div>
            <span className="text-sm text-ink-2 truncate max-w-[180px] group-hover:text-ink transition-colors">
              {email}
            </span>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
