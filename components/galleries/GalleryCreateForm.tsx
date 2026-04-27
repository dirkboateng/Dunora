"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createGallery,
  type GalleryVisibility,
} from "@/lib/actions/galleries";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ProjectOption {
  id: string;
  name: string;
}

export function GalleryCreateForm({
  projects,
  preselectProjectId = null,
}: {
  projects: ProjectOption[];
  preselectProjectId?: string | null;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<GalleryVisibility>("private");
  const [password, setPassword] = useState("");
  const [projectId, setProjectId] = useState(preselectProjectId ?? "");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!title.trim()) {
      setServerError("Gallery title is required");
      return;
    }
    if (visibility === "password" && !password.trim()) {
      setServerError("Set a password or change visibility");
      return;
    }
    setLoading(true);

    const result = await createGallery({
      title: title.trim(),
      description: description.trim() || null,
      visibility,
      password: visibility === "password" ? password.trim() : null,
      project_id: projectId || null,
    });

    if (!result.ok || !result.data) {
      setServerError(result.error ?? "Could not create gallery");
      setLoading(false);
      return;
    }

    router.push("/dashboard/galleries");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Gallery title"
        name="title"
        autoFocus
        maxLength={200}
        placeholder="e.g. Ajax — Feyenoord highlights"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Description (optional)
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
        helper={
          visibility === "private"
            ? "Only you can view this gallery while it's private."
            : visibility === "password"
              ? "Anyone with the link AND password can view."
              : "Anyone with the link can view."
        }
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
          helper="Share this with your client separately from the link."
          disabled={loading}
          required
        />
      )}

      {projects.length > 0 && (
        <Select
          label="Link to project (optional)"
          name="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={loading}
        >
          <option value="">No project — standalone gallery</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      )}

      {serverError && (
        <div
          role="alert"
          className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3"
        >
          {serverError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" loading={loading}>
          {loading ? "Creating gallery…" : "Create gallery"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/galleries")}
          disabled={loading}
          className="text-sm font-medium text-muted hover:text-ink-2 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
