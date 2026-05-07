"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { setLandingPhoto, deleteLandingPhoto } from "@/lib/actions/site";

interface Photo {
  slot: number;
  storage_path: string;
  file_name: string;
  url: string;
}

interface Props {
  photos: Record<number, Photo | undefined>;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function LandingPhotoSlots({
  photos,
  supabaseUrl,
  supabaseAnonKey,
}: Props) {
  const router = useRouter();
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slots: number[] = [1, 2, 3, 4, 5, 6];

  async function uploadToSlot(slot: number, file: File) {
    setBusySlot(slot);
    setError(null);
    try {
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const ext = file.name.split(".").pop() || "jpg";
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      const path = `slot-${slot}/${ts}-${rand}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("landing")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setBusySlot(null);
        return;
      }

      const result = await setLandingPhoto({
        slot,
        storage_path: path,
        file_name: file.name,
      });

      if (!result.ok) {
        setError(result.error ?? "Failed to save photo");
        setBusySlot(null);
        return;
      }

      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Upload failed: ${msg}`);
    } finally {
      setBusySlot(null);
    }
  }

  async function removeSlot(slot: number) {
    if (!confirm(`Remove photo from slot ${slot}?`)) return;
    setBusySlot(slot);
    setError(null);
    const result = await deleteLandingPhoto(slot);
    if (!result.ok) {
      setError(result.error ?? "Failed to delete");
    }
    router.refresh();
    setBusySlot(null);
  }

  return (
    <div>
      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <PhotoSlot
            key={slot}
            slot={slot}
            photo={photos[slot]}
            busy={busySlot === slot}
            onUpload={(file) => uploadToSlot(slot, file)}
            onRemove={() => removeSlot(slot)}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoSlot({
  slot,
  photo,
  busy,
  onUpload,
  onRemove,
}: {
  slot: number;
  photo: Photo | undefined;
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePick() {
    if (busy) return;
    inputRef.current?.click();
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div className="text-[11px] font-mono text-muted mb-2 tracking-wider uppercase">
        Slot {slot}
      </div>

      {photo ? (
        <div className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-line bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.file_name}
            className="w-full h-full object-cover"
          />
          {busy && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
              Working...
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePick}
                disabled={busy}
                className="text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                disabled={busy}
                className="text-xs font-semibold text-white bg-error/80 hover:bg-error px-3 py-1.5 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          disabled={busy}
          className="aspect-[4/5] w-full rounded-xl border-2 border-dashed border-line hover:border-accent/40 hover:bg-surface-2/40 bg-surface flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          {busy ? (
            <span className="text-sm text-ink-2 font-medium">Uploading...</span>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-accent-wash text-accent inline-flex items-center justify-center text-xl">
                +
              </div>
              <span className="text-xs text-ink-2 font-medium">Upload photo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
