import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = { title: "Uploads" };

interface ProjectRow {
  id: string;
  name: string;
  client_name: string | null;
  created_at: string;
  status: string;
}

export default async function UploadsPage() {
  const ctx = await getDashboardContext();

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("projects")
    .select("id, name, client_name, created_at, status")
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: false })
    .limit(20);

  const projects = (rows ?? []) as ProjectRow[];

  const counts = new Map<string, number>();
  if (projects.length > 0) {
    const ids = projects.map((p) => p.id);
    const { data: photoData } = await supabase
      .from("photos")
      .select("project_id")
      .in("project_id", ids)
      .is("deleted_at", null);
    for (const row of (photoData ?? []) as { project_id: string }[]) {
      counts.set(row.project_id, (counts.get(row.project_id) ?? 0) + 1);
    }
  }

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Uploads"
      description="Pick a project to upload photos to. Or create a new project from here."
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-2">
          {projects.length === 0
            ? "No projects yet. Create one to start uploading."
            : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        </p>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-xl mb-3">
            ↑
          </div>
          <h3 className="text-base font-semibold text-ink mb-1">Start with a project</h3>
          <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed mb-4">
            Photos in Dunora always live inside a project. Create one for your shoot, then upload your photos.
          </p>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const count = counts.get(p.id) ?? 0;
            return (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="group bg-surface border border-line rounded-2xl p-5 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-ink truncate mb-0.5">{p.name}</h3>
                    {p.client_name && (
                      <p className="text-xs text-muted truncate">{p.client_name}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded shrink-0 capitalize">
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{count} {count === 1 ? "photo" : "photos"}</span>
                  <span className="text-accent group-hover:translate-x-0.5 transition-transform">
                    Open →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
