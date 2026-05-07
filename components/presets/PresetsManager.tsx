"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPreset, updatePreset, deletePreset } from "@/lib/actions/presets";

export interface Preset {
  id: string;
  name: string;
  description: string;
  default_visibility: "private" | "public" | "password";
  default_brand_color: string | null;
  default_watermark_id: string | null;
  is_default: boolean;
}

interface Props {
  presets: Preset[];
}

export function PresetsManager({ presets }: Props) {
  const [editing, setEditing] = useState<Preset | "new" | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink-2">
          {presets.length === 0
            ? "No presets yet. Create one to use as a default for new galleries."
            : `${presets.length} ${presets.length === 1 ? "preset" : "presets"}`}
        </p>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New preset
        </button>
      </div>

      {presets.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p} onEdit={() => setEditing(p)} />
          ))}
        </div>
      )}

      {editing && (
        <PresetDialog
          preset={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function PresetCard({ preset, onEdit }: { preset: Preset; onEdit: () => void }) {
  const visLabel: Record<string, string> = {
    private: "Private",
    public: "Public",
    password: "Password",
  };
  return (
    <div className="bg-surface border border-line rounded-2xl p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-ink truncate">{preset.name}</h3>
            {preset.is_default && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-wash text-accent-deep px-1.5 py-0.5 rounded">
                Default
              </span>
            )}
          </div>
          {preset.description && (
            <p className="text-xs text-muted line-clamp-2">{preset.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-ink-2 hover:text-ink px-2 py-1 rounded hover:bg-surface-2 transition-colors flex-shrink-0"
        >
          Edit
        </button>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted">
        <span>{visLabel[preset.default_visibility] ?? preset.default_visibility}</span>
        {preset.default_brand_color && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-line"
              style={{ backgroundColor: preset.default_brand_color }}
            />
            <span className="font-mono">{preset.default_brand_color}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function PresetDialog({ preset, onClose }: { preset: Preset | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !preset;

  const [name, setName] = useState(preset?.name ?? "");
  const [description, setDescription] = useState(preset?.description ?? "");
  const [visibility, setVisibility] = useState<"private" | "public" | "password">(
    preset?.default_visibility ?? "private"
  );
  const [brandColor, setBrandColor] = useState(preset?.default_brand_color ?? "");
  const [isDefault, setIsDefault] = useState(preset?.is_default ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true);
    setError(null);
    const result = isNew
      ? await createPreset({
          name,
          description,
          default_visibility: visibility,
          default_brand_color: brandColor.trim() || null,
          is_default: isDefault,
        })
      : await updatePreset(preset!.id, {
          name,
          description,
          default_visibility: visibility,
          default_brand_color: brandColor.trim() || null,
          is_default: isDefault,
        });
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Failed to save");
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleDelete() {
    if (!preset) return;
    if (!confirm(`Delete preset "${preset.name}"?`)) return;
    setBusy(true);
    setError(null);
    const result = await deletePreset(preset.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Failed to delete");
      return;
    }
    router.refresh();
    onClose();
  }
return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-line rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-line">
          <h2 className="text-lg font-bold text-ink">
            {isNew ? "New preset" : "Edit preset"}
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Wedding deliveries"
              className="w-full px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">
              Default visibility
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["private", "public", "password"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={
                    "px-3 py-2 text-xs font-semibold rounded-lg border transition-colors capitalize " +
                    (visibility === v
                      ? "bg-accent-wash border-accent text-accent-deep"
                      : "bg-surface border-line text-ink-2 hover:border-line-strong")
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">
              Default brand color (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor || "#047857"}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-12 h-10 rounded-lg border border-line cursor-pointer"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                placeholder="#047857"
                className="flex-1 px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink font-mono outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
              {brandColor && (
                <button
                  type="button"
                  onClick={() => setBrandColor("")}
                  className="text-xs text-muted hover:text-ink-2 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-line text-accent focus:ring-accent/30"
            />
            <div>
              <div className="text-sm font-medium text-ink">Use as default</div>
              <div className="text-xs text-muted leading-relaxed">
                This preset will be pre-selected when creating new galleries.
              </div>
            </div>
          </label>
        </div>

        <div className="p-6 border-t border-line flex items-center justify-between gap-3">
          {!isNew ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="text-xs font-semibold text-error hover:text-error/80 px-3 py-2 transition-colors disabled:opacity-50"
            >
              Delete preset
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="text-sm font-medium text-ink-2 hover:text-ink px-4 py-2 rounded-lg hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy || !name.trim()}
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? "Saving..." : isNew ? "Create preset" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
