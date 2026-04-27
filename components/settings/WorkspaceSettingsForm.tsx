"use client";

import { useState, type FormEvent } from "react";
import { updateWorkspace } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PRESET_COLORS = [
  "#047857",
  "#0F172A",
  "#7C3AED",
  "#0284C7",
  "#DC2626",
  "#D97706",
];

export function WorkspaceSettingsForm({
  workspaceId,
  name: initialName,
  brandColor: initialColor,
}: {
  workspaceId: string;
  name: string;
  brandColor: string;
}) {
  const [name, setName] = useState(initialName);
  const [brandColor, setBrandColor] = useState(initialColor);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg(null);
    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("Workspace name is required");
      return;
    }
    setLoading(true);
    const result = await updateWorkspace({
      workspace_id: workspaceId,
      name: name.trim(),
      brand_color: brandColor,
    });
    setLoading(false);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2400);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Could not update workspace");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Workspace name"
        name="workspaceName"
          maxLength={200}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Brand color</label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setBrandColor(c)}
              className={
                "w-9 h-9 rounded-lg transition-all " +
                (brandColor === c
                  ? "ring-2 ring-offset-2 ring-ink scale-110"
                  : "hover:scale-105")
              }
              style={{ background: c }}
              aria-label={c}
            />
          ))}
          <div className="w-32">
            <Input
              name="customColor"
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <span className="text-xs text-muted">
          Used as the accent on your shared galleries.
        </span>
      </div>

      {status === "error" && errorMsg && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}
      {status === "ok" && (
        <div className="bg-accent-wash border border-accent/20 text-accent-deep text-sm rounded-xl px-4 py-3">
          Workspace saved.
        </div>
      )}

      <div>
        <Button type="submit" loading={loading}>
          {loading ? "Saving…" : "Save workspace"}
        </Button>
      </div>
    </form>
  );
}
