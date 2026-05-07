"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type Adjustments, mergeAdjustments, toCssFilter } from "@/lib/photo/adjustments";
import { duplicatePreset, toggleFavorite } from "@/lib/actions/photo";
import { PresetEditor, type PresetData } from "./PresetEditor";

export interface LibraryPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  adjustments: Partial<Adjustments>;
}

interface Props {
  presets: LibraryPreset[];
  previewImageUrl: string;
}

type Filter = "all" | "favorites";

export function PresetsLibrary({ presets, previewImageUrl }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<PresetData | "new" | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return presets.filter((p) => {
      if (filter === "favorites" && !p.is_favorite) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [presets, filter, search]);

  async function onToggleFav(p: LibraryPreset) {
    setBusyId(p.id);
    await toggleFavorite(p.id, !p.is_favorite);
    router.refresh();
    setBusyId(null);
  }

  async function onDuplicate(p: LibraryPreset) {
    setBusyId(p.id);
    await duplicatePreset(p.id);
    router.refresh();
    setBusyId(null);
  }

  function openEdit(p: LibraryPreset) {
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      tags: p.tags,
      is_favorite: p.is_favorite,
      adjustments: mergeAdjustments(p.adjustments),
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search presets, tags..."
            className="w-full pl-9 pr-3 py-2 bg-surface border border-line rounded-lg text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
          />
        </div>

        <div className="inline-flex items-center bg-surface-2 rounded-full p-0.5 border border-line shrink-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-colors " +
              (filter === "all"
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink-2")
            }
          >
            All ({presets.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("favorites")}
            className={
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-colors " +
              (filter === "favorites"
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink-2")
            }
          >
            Favorites
          </button>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          + New preset
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-ink mb-1">
            {presets.length === 0 ? "No presets yet" : "No matches"}
          </h3>
          <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
            {presets.length === 0
              ? "Create your first preset to start applying consistent looks across your shoots."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              previewImageUrl={previewImageUrl}
              busy={busyId === p.id}
              onClick={() => openEdit(p)}
              onToggleFav={() => onToggleFav(p)}
              onDuplicate={() => onDuplicate(p)}
            />
          ))}
        </div>
      )}

      {editing && (
        <PresetEditor
          preset={editing === "new" ? null : editing}
          previewImageUrl={previewImageUrl}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
function PresetCard({
  preset,
  previewImageUrl,
  busy,
  onClick,
  onToggleFav,
  onDuplicate,
}: {
  preset: LibraryPreset;
  previewImageUrl: string;
  busy: boolean;
  onClick: () => void;
  onToggleFav: () => void;
  onDuplicate: () => void;
}) {
  const adj = mergeAdjustments(preset.adjustments);
  const filter = toCssFilter(adj);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative bg-surface border border-line rounded-2xl overflow-hidden cursor-pointer hover:border-accent/40 hover:shadow-md transition-all"
    >
      <div className="aspect-[4/3] bg-surface-2 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImageUrl}
          alt={preset.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          style={{ filter }}
          loading="lazy"
        />
        {preset.is_favorite && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-amber-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-ink truncate flex-1 min-w-0">{preset.name}</h3>
        </div>
        {preset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {preset.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-medium bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          disabled={busy}
          className="w-7 h-7 rounded-full bg-surface/90 backdrop-blur hover:bg-surface text-ink-2 hover:text-amber-500 flex items-center justify-center shadow-sm transition-colors"
          title={preset.is_favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={preset.is_favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          disabled={busy}
          className="w-7 h-7 rounded-full bg-surface/90 backdrop-blur hover:bg-surface text-ink-2 hover:text-ink flex items-center justify-center shadow-sm transition-colors"
          title="Duplicate"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
