"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { createWatermark, updateWatermark, deleteWatermark } from "@/lib/actions/photo";

export interface Watermark {
  id: string;
  name: string;
  storage_path: string;
  file_name: string;
  url: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  opacity: number;
  scale: number;
  is_default: boolean;
}

interface Props {
  watermarks: Watermark[];
  previewImageUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function WatermarksManager({
  watermarks,
  previewImageUrl,
  supabaseUrl,
  supabaseAnonKey,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Watermark | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const ext = file.name.split(".").pop() || "png";
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      const path = `wm-${ts}-${rand}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("watermarks")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        setUploading(false);
        return;
      }

      const baseName = file.name.replace(/\.[^.]+$/, "").slice(0, 80) || "Watermark";
      const result = await createWatermark({
        name: baseName,
        storage_path: path,
        file_name: file.name,
      });

      if (!result.ok) {
        setError(result.error ?? "Failed to save watermark");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-ink-2">
          {watermarks.length === 0
            ? "Upload a PNG or SVG with transparent background to use as a watermark."
            : `${watermarks.length} ${watermarks.length === 1 ? "watermark" : "watermarks"}`}
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "+ Upload watermark"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {watermarks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watermarks.map((w) => (
            <WatermarkCard
              key={w.id}
              watermark={w}
              previewImageUrl={previewImageUrl}
              onEdit={() => setEditing(w)}
            />
          ))}
        </div>
      )}

      {editing && (
        <WatermarkDialog
          watermark={editing}
          previewImageUrl={previewImageUrl}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function WatermarkCard({
  watermark,
  previewImageUrl,
  onEdit,
}: {
  watermark: Watermark;
  previewImageUrl: string;
  onEdit: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => e.key === "Enter" && onEdit()}
      className="bg-surface border border-line rounded-2xl overflow-hidden cursor-pointer hover:border-accent/40 hover:shadow-md transition-all"
    >
      <div className="aspect-[4/3] bg-surface-2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewImageUrl} alt="" className="w-full h-full object-cover" />
        <WatermarkOverlay watermark={watermark} />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-ink truncate">{watermark.name}</h3>
            {watermark.is_default && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-wash text-accent-deep px-1.5 py-0.5 rounded">
                Default
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted">
            {watermark.position} · {Math.round(watermark.opacity * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export function WatermarkOverlay({ watermark }: { watermark: Watermark }) {
  const positionStyle: Record<string, React.CSSProperties> = {
    "top-left": { top: "5%", left: "5%" },
    "top-right": { top: "5%", right: "5%" },
    "bottom-left": { bottom: "5%", left: "5%" },
    "bottom-right": { bottom: "5%", right: "5%" },
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...positionStyle[watermark.position],
        width: `${watermark.scale * 100}%`,
        opacity: watermark.opacity,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={watermark.url} alt="Watermark" className="w-full h-auto" />
    </div>
  );
}
function WatermarkDialog({
  watermark,
  previewImageUrl,
  onClose,
}: {
  watermark: Watermark;
  previewImageUrl: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(watermark.name);
  const [position, setPosition] = useState(watermark.position);
  const [opacity, setOpacity] = useState(watermark.opacity);
  const [scale, setScale] = useState(watermark.scale);
  const [isDefault, setIsDefault] = useState(watermark.is_default);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveWatermark: Watermark = { ...watermark, name, position, opacity, scale, is_default: isDefault };

  async function handleSave() {
    setBusy(true);
    setError(null);
    const result = await updateWatermark(watermark.id, {
      name,
      position,
      opacity,
      scale,
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
    if (!confirm(`Delete watermark "${watermark.name}"?`)) return;
    setBusy(true);
    const result = await deleteWatermark(watermark.id);
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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-line">
          <h2 className="text-base font-bold text-ink">Edit watermark</h2>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="bg-surface-2 rounded-xl overflow-hidden aspect-[4/3] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImageUrl} alt="" className="w-full h-full object-cover" />
            <WatermarkOverlay watermark={liveWatermark} />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Position</label>
            <div className="grid grid-cols-3 gap-2 max-w-xs">
              {(["top-left", "top-right", "center", "bottom-left", "bottom-right"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPosition(pos)}
                  className={
                    "aspect-square border rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center capitalize " +
                    (position === pos
                      ? "bg-accent-wash border-accent text-accent-deep"
                      : "bg-surface border-line text-ink-2 hover:border-line-strong")
                  }
                >
                  {pos.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-ink-2">Opacity</label>
              <span className="text-xs font-mono text-ink-2">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-ink-2">Size</label>
              <span className="text-xs font-mono text-ink-2">{Math.round(scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
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
              <div className="text-xs text-muted">Auto-apply this watermark to all new galleries.</div>
            </div>
          </label>
        </div>

        <div className="p-5 border-t border-line flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="text-xs font-semibold text-error hover:text-error/80 px-3 py-2 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
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
              disabled={busy}
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
