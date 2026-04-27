import Link from "next/link";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProjectCreateForm } from "@/components/projects/ProjectCreateForm";

export const metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  const ctx = await getDashboardContext();

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="New project"
      description="Start a project for your next shoot or event."
    >
      <div className="max-w-[600px]">
        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
          <ProjectCreateForm />
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/projects"
            className="text-sm text-muted hover:text-ink-2 transition-colors"
          >
            ← Back to projects
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
