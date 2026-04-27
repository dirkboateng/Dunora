import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { UploadDropzone } from "@/components/upload/UploadDropzone";

export const metadata = {
  title: "Upload photos",
};

interface ProjectRow {
  id: string;
  name: string;
}

interface WorkspaceRow {
  id: string;
  storage_used_bytes: number;
  storage_quota_bytes: number;
}

export default async function UploadPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const [projectRes, wsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .eq("workspace_id", ctx.workspaceId)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("workspaces")
      .select("id, storage_used_bytes, storage_quota_bytes")
      .eq("id", ctx.workspaceId)
      .maybeSingle(),
  ]);

  const project = projectRes.data as ProjectRow | null;
  const workspace = wsRes.data as WorkspaceRow | null;
  if (!project || !workspace) notFound();

  const availableBytes = Math.max(
    0,
    workspace.storage_quota_bytes - workspace.storage_used_bytes,
  );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
    >
      <div className="mb-4">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="text-sm text-muted hover:text-ink-2 transition-colors"
        >
          ← Back to project
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink mb-2">
        Upload photos
      </h1>
      <p className="text-sm text-ink-2 mb-8">
        Adding to project:{" "}
        <span className="font-medium text-ink">{project.name}</span>
      </p>

      <UploadDropzone
        workspaceId={workspace.id}
        projectId={project.id}
        projectName={project.name}
        supabaseUrl={supabaseUrl}
        availableBytes={availableBytes}
      />
    </DashboardShell>
  );
}
