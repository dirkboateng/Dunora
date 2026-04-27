"use client";

import { useState, type FormEvent } from "react";
import { updateGallery, type GalleryVisibility } from "@/lib/actions/galleries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Props {
  galleryId: string;
  title: string;
  description: string;
  visibility: GalleryVisibility;
  password: string;
}

export function GallerySettingsForm({
  galleryId,
  title: initialTitle,
  description: initialDescription,
  visibility: initialVisibility,
  password: initialPassword,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState<GalleryVisibility>(initialVisibility);
  const [password, setPassword] = useState(initialPassword);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg(null);
    setLoading(true);

    const result = await updateGallery({
      gallery_id: galleryId,
      title,
      description: description || null,
      visibility,
      password: visibility === "password" ? password : null,
    });
    setLoading(false);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2400);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Could not update gallery");
    }
  }

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 md:p-7">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-ink">Gallery settings</h2>
        <p className="text-sm text-muted mt-0.5">
          Title, description, visibility and password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
        maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            className="w-full px-3 py-2 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-none"
            placeholder="A short note that appears on the gallery page."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <Select
          label="Visibility"
          name="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as GalleryVisibility)}
          disabled={loading}
        >
          <option value="private">Private — only me</option>
          <option value="password">Password protected</option>
          <option value="public">Public — anyone with the link</option>
        </Select>

        {visibility === "password" && (
          <Input
            label="Password"
            name="password"
          maxLength={200}
            type="text"
            placeholder="Choose a memorable password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        )}

        {status === "error" && errorMsg && (
          <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
            {errorMsg}
          </div>
        )}
        {status === "ok" && (
          <div className="bg-accent-wash border border-accent/20 text-accent-deep text-sm rounded-xl px-4 py-3">
            Gallery saved.
          </div>
        )}

        <div>
          <Button type="submit" loading={loading}>
            {loading ? "Saving…" : "Save gallery"}
          </Button>
        </div>
      </form>
    </div>
  );
}
