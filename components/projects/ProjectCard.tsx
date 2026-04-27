import Link from "next/link";
import { FolderIcon } from "@/components/dashboard/Icon";

export interface ProjectListItem {
  id: string;
  name: string;
  slug: string;
  client_name: string | null;
  project_type: string;
  shoot_date: string | null;
  status: string;
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

function formatDate(d: string | null): string {
  if (!d) return "Date TBD";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Date TBD";
  }
}

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group block bg-surface border border-line rounded-2xl p-5 transition-all duration-200 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-wash text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
          <FolderIcon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate">
            {project.name}
          </div>
          <div className="text-xs text-muted">
            {TYPE_LABELS[project.project_type] ?? "Project"}
            {project.client_name && (
              <>
                <span className="mx-1.5">·</span>
                {project.client_name}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{formatDate(project.shoot_date)}</span>
        <span
          className={
            "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider " +
            (project.status === "active"
              ? "bg-accent-wash text-accent-deep"
              : "bg-surface-2 text-muted")
          }
        >
          {project.status}
        </span>
      </div>
    </Link>
  );
}
