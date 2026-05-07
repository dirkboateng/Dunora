"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  type Adjustments,
  DEFAULT_ADJUSTMENTS,
  mergeAdjustments,
  toCssFilter,
  SLIDERS,
  isDefaultAdjustments,
} from "@/lib/photo/adjustments";
import { AdjustmentSlider } from "./AdjustmentSlider";
import { createPreset, updatePreset, deletePreset } from "@/lib/actions/photo";

export interface PresetData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  adjustments: Adjustments;
}

interface Props {
  preset: PresetData | null;
  previewImageUrl: string;
  onClose: () => void;
}

const PREVIEW_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

export function PresetEditor({ preset, previewImageUrl, onClose }: Props) {
  const router = useRouter();
  const isNew = !preset;

  const [name, setName] = useState(preset?.name ?? "Untitled preset");
  const [description, setDescription] = useState(preset?.description ?? "");
  const [tagsText, setTagsText] = useState((preset?.tags ?? []).join(", "));
  const [adjustments, setAdjustments] = useState<Adjustments>(
    mergeAdjustments(preset?.adjustments)
  );
  const [activeGroup, setActiveGroup] = useState<"light" | "color" | "effects">("light");
  const [showBefore, setShowBefore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const filterCss = useMemo(() => toCssFilter(adjustments), [adjustments]);
  const visibleSliders = useMemo(
    () => SLIDERS.filter((s) => s.group === activeGroup),
    [activeGroup]
  );

  const update = useCallback((key: keyof Adjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  }, []);

  function resetAll() {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    flashSnack("All adjustments reset");
  }

  function flashSnack(msg: string) {
    setSnack(msg);
    setTimeout(() => setSnack(null), 2000);
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      name: name.trim() || "Untitled preset",
      description,
      tags,
      adjustments,
      is_favorite: preset?.is_favorite ?? false,
    };
    const result = isNew
      ? await createPreset(payload)
      : await updatePreset(preset!.id, payload);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Failed to save");
      return;
    }
    flashSnack("Preset saved");
    router.refresh();
    setTimeout(onClose, 600);
  }

  async function handleDelete() {
    if (!preset) return;
    if (!confirm(`Delete preset "${preset.name}"? This cannot be undone.`)) return;
    setBusy(true);
    const result = await deletePreset(preset.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Failed to delete");
      return;
    }
    flashSnack("Preset deleted");
    router.refresh();
    setTimeout(onClose, 400);
  }

  function exportJson() {
    const blob = new Blob(
      [JSON.stringify({ name, description, tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean), adjustments }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^\w-]+/g, "-").toLowerCase() || "preset"}.dunora.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flashSnack("Preset exported");
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.name) setName(String(parsed.name));
        if (parsed.description) setDescription(String(parsed.description));
        if (Array.isArray(parsed.tags)) setTagsText(parsed.tags.join(", "));
        if (parsed.adjustments) setAdjustments(mergeAdjustments(parsed.adjustments));
        flashSnack("Preset imported");
      } catch {
        setError("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  const imageUrl = previewImageUrl || PREVIEW_IMAGE_FALLBACK;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-line shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="text-base font-bold text-ink bg-transparent outline-none focus:bg-surface-2 rounded px-2 py-1 min-w-0 flex-1 max-w-md"
              placeholder="Preset name..."
            />
            {!isDefaultAdjustments(adjustments) && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-wash text-accent-deep px-1.5 py-0.5 rounded">
                Modified
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={exportJson}
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded hover:bg-surface-2 transition-colors"
              title="Export as JSON"
            >
              Export
            </button>
            <label className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded hover:bg-surface-2 transition-colors cursor-pointer">
              Import
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="text-ink-2 hover:text-ink p-2 rounded hover:bg-surface-2 transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 grid md:grid-cols-[1fr_360px] min-h-0">
          <div className="bg-bg flex items-center justify-center p-4 md:p-8 relative overflow-hidden border-b md:border-b-0 md:border-r border-line">
            <button
              type="button"
              onMouseDown={() => setShowBefore(true)}
              onMouseUp={() => setShowBefore(false)}
              onMouseLeave={() => setShowBefore(false)}
              onTouchStart={() => setShowBefore(true)}
              onTouchEnd={() => setShowBefore(false)}
              className="absolute top-4 left-4 z-10 text-[10px] font-bold uppercase tracking-wider bg-surface/90 backdrop-blur text-ink-2 hover:text-ink px-3 py-2 rounded-lg border border-line shadow-sm transition-colors"
            >
              {showBefore ? "Before" : "Hold to compare"}
            </button>
            <div className="relative max-h-full max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[60vh] md:max-h-full object-contain rounded-lg shadow-xl"
                style={{ filter: showBefore ? "none" : filterCss }}
                crossOrigin="anonymous"
              />
              {adjustments.vignette !== 0 && !showBefore && (
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 ${Math.abs(adjustments.vignette) * 1.5}px ${Math.abs(adjustments.vignette) / 2}px rgba(0,0,0,${Math.max(0, adjustments.vignette / 100)})`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col min-h-0">
            <div className="flex border-b border-line shrink-0">
              {(["light", "color", "effects"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGroup(g)}
                  className={
                    "flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-colors capitalize " +
                    (activeGroup === g
                      ? "text-accent border-b-2 border-accent bg-accent-wash/40"
                      : "text-muted hover:text-ink-2")
                  }
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {visibleSliders.map((s) => (
                <AdjustmentSlider
                  key={s.key}
                  label={s.label}
                  value={adjustments[s.key]}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  bipolar={s.min < 0 && s.max > 0}
                  onChange={(v) => update(s.key, v)}
                />
              ))}
            </div>
            <div className="border-t border-line p-4 shrink-0 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-muted mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  placeholder="Optional"
                  className="w-full px-2 py-1.5 bg-surface-2 border border-line rounded-lg text-xs text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="warm, sport, evening"
                  className="w-full px-2 py-1.5 bg-surface-2 border border-line rounded-lg text-xs text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-line shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              disabled={isDefaultAdjustments(adjustments)}
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded hover:bg-surface-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset all
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="text-xs font-semibold text-error hover:text-error/80 px-3 py-1.5 rounded hover:bg-error/10 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="text-sm font-medium text-ink-2 hover:text-ink px-4 py-2 rounded-lg hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy || !name.trim()}
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {busy ? "Saving..." : isNew ? "Save preset" : "Save changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-error text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg z-10">
            {error}
          </div>
        )}
        {snack && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-ink text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg z-10">
            {snack}
          </div>
        )}
      </div>
    </div>
  );
}
