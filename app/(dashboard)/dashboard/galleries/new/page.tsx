import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GalleryCreateForm } from "@/components/galleries/GalleryCreateForm";

export const metadata = {
  title: "New gallery",
};

interface ProjectOption {
  id: string;
  name: string;
}

export default async function NewGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: preselectProjectId } = await searchParams;
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  // Available projects to optionally link the gallery to
  const projectsRes = await supabase
    .from("projects")
    .select("id, name")
    .eq("workspace_id", ctx.workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  const projects = (projectsRes.data ?? []) as ProjectOption[];

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="New gallery"
      description="Create a shareable gallery — link it to a project or build it standalone."
    >
      <div className="max-w-[600px]">
        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
          <GalleryCreateForm
            projects={projects}
            preselectProjectId={preselectProjectId ?? null}
          />
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/galleries"
            className="text-sm text-muted hover:text-ink-2 transition-colors"
          >
            ← Back to galleries
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
