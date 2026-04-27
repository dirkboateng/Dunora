"use client";

import Link from "next/link";
import { useState } from "react";
import { GalleryIcon } from "@/components/dashboard/Icon";

export interface GalleryListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  visibility: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
}

const VISIBILITY_LABELS: Record<string, string> = {
  private: "Private",
  password: "Password",
  public: "Public",
};

export function GalleryCard({ gallery }: { gallery: GalleryListItem }) {
  const [copied, setCopied] = useState(false);

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/g/${gallery.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div className="group relative bg-surface border border-line rounded-2xl p-5 transition-all duration-200 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-card">
      <Link href={`/dashboard/galleries/${gallery.id}`} className="block">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-wash text-accent flex items-center justify-center shrink-0">
            <GalleryIcon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink truncate">
              {gallery.title}
            </div>
            <div className="text-xs text-muted truncate">
              {gallery.description ?? "No description"}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between text-xs">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface-2 text-ink-2">
          {VISIBILITY_LABELS[gallery.visibility] ?? gallery.visibility}
        </span>
        {gallery.visibility === "private" ? (
          <span className="text-muted text-[11px] font-medium">
            Set visibility to share
          </span>
        ) : (
          <button
            type="button"
            onClick={copyLink}
            className="text-accent-deep hover:text-accent font-medium transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        )}
      </div>
    </div>
  );
}
