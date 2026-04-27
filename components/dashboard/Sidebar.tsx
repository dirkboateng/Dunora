"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  HomeIcon,
  FolderIcon,
  UploadIcon,
  GalleryIcon,
  PresetIcon,
  WatermarkIcon,
  SettingsIcon,
} from "./Icon";
import { cn } from "@/lib/utils";

interface SidebarProps {
  storageUsed?: number;
  storageQuota?: number;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof HomeIcon;
  comingSoon?: boolean;
}

const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  { label: "Uploads", href: "/dashboard/uploads", icon: UploadIcon, comingSoon: true },
  { label: "Galleries", href: "/dashboard/galleries", icon: GalleryIcon },
];

const secondaryNav: NavItem[] = [
  { label: "Presets", href: "/dashboard/presets", icon: PresetIcon, comingSoon: true },
  { label: "Watermarks", href: "/dashboard/watermarks", icon: WatermarkIcon, comingSoon: true },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

function isActive(itemHref: string, pathname?: string) {
  if (!pathname) return false;
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(itemHref);
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 GB";
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / 1024 ** 2;
  return `${mb.toFixed(1)} MB`;
}

export function Sidebar({ storageUsed = 0, storageQuota = 10737418240 }: SidebarProps) {
  const pathname = usePathname();
  const usedPct = Math.min((storageUsed / storageQuota) * 100, 100);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 border-r border-line bg-surface">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-line">
        <Link href="/dashboard" className="inline-flex">
          <Logo size={28} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavGroup label="Workspace" items={primaryNav} pathname={pathname} />
        <NavGroup label="Library" items={secondaryNav} pathname={pathname} className="mt-6" />
      </nav>

      {/* Storage usage */}
      <div className="px-5 py-4 border-t border-line">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            Storage
          </span>
          <span className="text-[11px] font-mono text-ink-2">
            {formatBytes(storageUsed)} / {formatBytes(storageQuota)}
          </span>
        </div>
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full transition-all"
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="text-[11px] text-muted mt-2">
          {usedPct < 1 ? "Less than 1% used" : `${usedPct.toFixed(0)}% used`}
        </div>
      </div>
    </aside>
  );
}

interface NavGroupProps {
  label: string;
  items: NavItem[];
  pathname?: string;
  className?: string;
}

function NavGroup({ label, items, pathname, className }: NavGroupProps) {
  return (
    <div className={className}>
      <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, pathname);
          const disabled = item.comingSoon;

          const inner = (
            <span
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent-wash text-accent-deep"
                  : disabled
                    ? "text-muted-2 cursor-not-allowed"
                    : "text-ink-2 hover:text-ink hover:bg-surface-2"
              )}
            >
              <Icon size={16} className={active ? "text-accent" : ""} />
              <span className="flex-1">{item.label}</span>
              {disabled && (
                <span className="text-[9px] font-semibold uppercase tracking-wider bg-surface-2 text-muted px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
            </span>
          );

          return (
            <li key={item.href}>
              {disabled ? (
                <div aria-disabled>{inner}</div>
              ) : (
                <Link href={item.href}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
