import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import {
  FolderIcon,
  PhotoIcon,
  UploadIcon,
  GalleryIcon,
  SettingsIcon,
} from "@/components/dashboard/Icon";

export const metadata = {
  title: "Project",
};

interface Project {
  id: string;
  name: string;
  client_name: string | null;
  project_type: string;
  shoot_date: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  football_match: "Football match",
  event: "Event",
  portrait: "Portrait",
  wedding: "Wedding",
  club_night: "Club night",
  other: "Project",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const [projectRes, galleriesRes] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, name, client_name, project_type, shoot_date, status, description, created_at"
      )
      .eq("id", projectId)
      .eq("workspace_id", ctx.workspaceId)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("galleries")
      .select("id, title, slug, visibility, view_count")
      .eq("project_id", projectId)
      .eq("workspace_id", ctx.workspaceId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const project = projectRes.data as Project | null;
  if (!project) notFound();

  const galleries = (galleriesRes.data ?? []) as {
    id: string;
    title: string;
    slug: string;
    visibility: string;
    view_count: number;
  }[];

  const shootDate = project.shoot_date
    ? new Date(project.shoot_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date TBD";

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title={project.name}
      description={`${TYPE_LABELS[project.project_type] ?? "Project"}${
        project.client_name ? " · " + project.client_name : ""
      } · ${shootDate}`}
    >
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/projects"
          className="text-sm text-muted hover:text-ink-2 transition-colors"
        >
          ← All projects
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/projects/${project.id}/upload`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <UploadIcon size={14} />
            Upload photos
          </Link>
          <Link
            href={`/dashboard/projects/${project.id}/edit`}
            className="text-sm font-medium text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
          >
            Edit
          </Link>
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-line">
        <Tab icon={<FolderIcon size={14} />} label="Overview" active />
        <Tab icon={<PhotoIcon size={14} />} label="Photos" />
        <Tab icon={<UploadIcon size={14} />} label="Upload" />
        <Tab icon={<GalleryIcon size={14} />} label="Gallery" />
        <Tab icon={<SettingsIcon size={14} />} label="Settings" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface border border-line rounded-2xl p-6">
            <h2 className="text-base font-semibold text-ink mb-4">Description</h2>
            {project.description ? (
              <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            ) : (
              <p className="text-sm text-muted italic">
                No description added yet.
              </p>
            )}
          </div>

          <EmptyState
            icon={<UploadIcon size={22} />}
            title="No photos uploaded yet"
            description="Use the Upload photos button above to add your first batch."
          />

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-semibold text-ink">
                Galleries for this project
              </h2>
              <Link
                href={`/dashboard/galleries/new?project=${project.id}`}
                className="text-sm font-medium text-accent-deep hover:text-accent transition-colors"
              >
                + Create gallery
              </Link>
            </div>
            {galleries.length === 0 ? (
              <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-5 py-6 text-center">
                <p className="text-sm text-ink-2">
                  No galleries yet for this project. Create one to share with
                  your client.
                </p>
              </div>
            ) : (
              <div className="bg-surface border border-line rounded-2xl divide-y divide-line">
                {galleries.map((g) => (
                  <Link
                    key={g.id}
                    href={`/dashboard/galleries/${g.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">
                        {g.title}
                      </div>
                      <div className="text-xs text-muted truncate">
                        /g/{g.slug}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-surface-2 text-ink-2 px-2 py-0.5 rounded-full">
                      {g.visibility}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-3">
          <SidePill label="Status" value={project.status} />
          <SidePill
            label="Type"
            value={TYPE_LABELS[project.project_type] ?? project.project_type}
          />
          <SidePill label="Client" value={project.client_name ?? "—"} />
          <SidePill label="Shoot date" value={shootDate} />
          <SidePill
            label="Created"
            value={new Date(project.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </aside>
      </div>
    </DashboardShell>
  );
}

function Tab({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors " +
        (active
          ? "border-accent text-accent-deep"
          : "border-transparent text-muted cursor-not-allowed")
      }
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function SidePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-line rounded-xl px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-ink capitalize">{value}</div>
    </div>
  );
}
