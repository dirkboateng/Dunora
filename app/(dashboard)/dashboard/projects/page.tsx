import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PlusIcon } from "@/components/dashboard/Icon";
import { Button } from "@/components/ui/Button";
import { ProjectsListSearch } from "@/components/projects/ProjectsListSearch";
import type { ProjectListItem } from "@/components/projects/ProjectCard";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const projectsRes = await supabase
    .from("projects")
    .select(
      "id, name, slug, client_name, project_type, shoot_date, status, created_at"
    )
    .eq("workspace_id", ctx.workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  const projects = (projectsRes.data ?? []) as ProjectListItem[];

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Projects"
      description="Shoots, events, and client work — everything you're delivering."
      actions={
        <Link href="/dashboard/projects/new">
          <Button size="md">
            <PlusIcon size={16} className="mr-1.5" />
            New project
          </Button>
        </Link>
      }
    >
      <ProjectsListSearch projects={projects} />
    </DashboardShell>
  );
}
