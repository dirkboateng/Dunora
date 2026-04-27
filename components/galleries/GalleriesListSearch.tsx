"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import Link from "next/link";
import { GalleryCard, type GalleryListItem } from "./GalleryCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { GalleryIcon, PlusIcon } from "@/components/dashboard/Icon";
import { Button } from "@/components/ui/Button";

const VISIBILITY_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All visibility" },
  { value: "private", label: "Private" },
  { value: "password", label: "Password" },
  { value: "public", label: "Public" },
];

export function GalleriesListSearch({
  galleries,
}: {
  galleries: GalleryListItem[];
}) {
  const [query, setQuery] = useState("");
  const [visFilter, setVisFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return galleries.filter((g) => {
      if (visFilter !== "all" && g.visibility !== visFilter) return false;
      if (!q) return true;
      const haystack = [g.title, g.description ?? ""].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [galleries, query, visFilter]);

  if (galleries.length === 0) {
    return (
      <EmptyState
        icon={<GalleryIcon size={24} />}
        title="No galleries yet"
        description="Create a gallery once your photos are ready. Share with one link, branded with your studio."
        action={
          <Link href="/dashboard/galleries/new">
            <Button size="md">
              <PlusIcon size={16} className="mr-1.5" />
              Create gallery
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search galleries by title or description…"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            className="w-full pl-10 pr-3 py-2.5 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
          />
        </div>
        <select
          value={visFilter}
          onChange={(e) => setVisFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface border border-line rounded-xl text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all min-w-[160px]"
        >
          {VISIBILITY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-5 py-10 text-center">
          <p className="text-sm font-medium text-ink mb-1">
            No galleries match your filter
          </p>
          <p className="text-xs text-muted">
            Try a different search term or clear the filter.
          </p>
        </div>
      ) : (
        <>
          <div className="text-xs text-muted mb-3">
            Showing {filtered.length} of {galleries.length} galleries
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((g) => (
              <GalleryCard key={g.id} gallery={g} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
