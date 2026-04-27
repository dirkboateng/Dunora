"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProject, type ProjectType } from "@/lib/actions/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "football_match", label: "Football match" },
  { value: "event", label: "Event" },
  { value: "portrait", label: "Portrait" },
  { value: "wedding", label: "Wedding" },
  { value: "club_night", label: "Club night" },
  { value: "other", label: "Other" },
];

interface Props {
  projectId: string;
  initialName: string;
  initialClientName: string;
  initialProjectType: ProjectType;
  initialShootDate: string;
  initialDescription: string;
}

export function ProjectEditForm({
  projectId,
  initialName,
  initialClientName,
  initialProjectType,
  initialShootDate,
  initialDescription,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [clientName, setClientName] = useState(initialClientName);
  const [projectType, setProjectType] = useState<ProjectType>(initialProjectType);
  const [shootDate, setShootDate] = useState(initialShootDate);
  const [description, setDescription] = useState(initialDescription);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!name.trim()) {
      setServerError("Project name is required");
      return;
    }
    setLoading(true);

    const result = await updateProject({
      project_id: projectId,
      name: name.trim(),
      client_name: clientName.trim() || null,
      project_type: projectType,
      shoot_date: shootDate || null,
      description: description.trim() || null,
    });

    if (!result.ok) {
      setServerError(result.error ?? "Could not update project");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/projects/${projectId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Project name"
        name="name"
        maxLength={200}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Client (optional)"
          name="clientName"
          maxLength={200}
          placeholder="e.g. Ajax FC"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          disabled={loading}
        />
        <Input
          label="Shoot date"
          name="shootDate"
          type="date"
          value={shootDate}
          onChange={(e) => setShootDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <Select
        label="Project type"
        name="projectType"
        value={projectType}
        onChange={(e) => setProjectType(e.target.value as ProjectType)}
        disabled={loading}
        required
      >
        {PROJECT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      {serverError && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
          {serverError}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
