import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProjectEditForm } from "@/components/projects/ProjectEditForm";
import type { ProjectType } from "@/lib/actions/projects";

export const metadata = {
  title: "Edit project",
};

interface ProjectRow {
  id: string;
  name: string;
  client_name: string | null;
  project_type: string | null;
  shoot_date: string | null;
  description: string | null;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const projectRes = await supabase
    .from("projects")
    .select("id, name, client_name, project_type, shoot_date, description")
    .eq("id", projectId)
    .eq("workspace_id", ctx.workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  const project = projectRes.data as ProjectRow | null;
  if (!project) notFound();

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Edit project"
      description={project.name}
    >
      <div className="max-w-[600px]">
        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
          <ProjectEditForm
            projectId={project.id}
            initialName={project.name}
            initialClientName={project.client_name ?? ""}
            initialProjectType={
              (project.project_type as ProjectType) ?? "event"
            }
            initialShootDate={project.shoot_date ?? ""}
            initialDescription={project.description ?? ""}
          />
        </div>
        <div className="mt-4 text-center">
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="text-sm text-muted hover:text-ink-2 transition-colors"
          >
            ← Back to project
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
