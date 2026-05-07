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
