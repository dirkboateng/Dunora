"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/Button";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (!result.ok) {
        setError(result.error ?? "Could not delete project");
        return;
      }
      router.push("/dashboard/projects");
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
        type="button"
      >
        Delete project
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="text-xs text-ink-2">
        This will hide the project from your workspace.
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={pending}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          loading={pending}
          type="button"
        >
          {pending ? "Deleting…" : "Delete"}
        </Button>
      </div>
      {error && (
        <div className="text-xs text-error mt-1">{error}</div>
      )}
    </div>
  );
}
