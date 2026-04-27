"use client";

import { useState, useEffect } from "react";
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

interface NavItem {
  label: string;
  href: string;
  icon: typeof HomeIcon;
  comingSoon?: boolean;
}

const items: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  { label: "Uploads", href: "/dashboard/uploads", icon: UploadIcon, comingSoon: true },
  { label: "Galleries", href: "/dashboard/galleries", icon: GalleryIcon },
  { label: "Presets", href: "/dashboard/presets", icon: PresetIcon, comingSoon: true },
  { label: "Watermarks", href: "/dashboard/watermarks", icon: WatermarkIcon, comingSoon: true },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden animate-fade-in-up"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <aside className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-surface border-r border-line lg:hidden flex flex-col shadow-toast">
            <div className="flex items-center justify-between px-5 py-5 border-b border-line">
              <Logo size={28} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
                aria-label="Close navigation"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, pathname);
                  const disabled = item.comingSoon;

                  const inner = (
                    <span
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-accent-wash text-accent-deep"
                          : disabled
                            ? "text-muted-2 cursor-not-allowed"
                            : "text-ink-2 hover:text-ink hover:bg-surface-2"
                      )}
                    >
                      <Icon size={18} className={active ? "text-accent" : ""} />
                      <span className="flex-1">{item.label}</span>
                      {disabled && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-surface-2 text-muted px-1.5 py-0.5 rounded">
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
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
