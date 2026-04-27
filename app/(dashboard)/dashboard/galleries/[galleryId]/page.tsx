import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { GalleryDetailHeader } from "@/components/galleries/GalleryDetailHeader";
import { GallerySettingsForm } from "@/components/galleries/GallerySettingsForm";
import { PhotoIcon } from "@/components/dashboard/Icon";

export const metadata = {
  title: "Gallery",
};

interface GalleryRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  visibility: string;
  password: string | null;
  view_count: number;
  download_count: number;
  published_at: string | null;
  created_at: string;
  project_id: string | null;
}

interface ProjectRow {
  id: string;
  name: string;
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ galleryId: string }>;
}) {
  const { galleryId } = await params;
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const galleryRes = await supabase
    .from("galleries")
    .select(
      "id, title, slug, description, visibility, password, view_count, download_count, published_at, created_at, project_id"
    )
    .eq("id", galleryId)
    .eq("workspace_id", ctx.workspaceId)
    .maybeSingle();

  const gallery = galleryRes.data as GalleryRow | null;
  if (!gallery) notFound();

  // Linked project (optional). Scoped to current workspace as
  // defense-in-depth — RLS already prevents cross-workspace reads, but
  // the explicit filter gives faster query plans and clearer intent.
  let linkedProject: ProjectRow | null = null;
  if (gallery.project_id) {
    const pr = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", gallery.project_id)
      .eq("workspace_id", ctx.workspaceId)
      .is("deleted_at", null)
      .maybeSingle();
    linkedProject = pr.data as ProjectRow | null;
  }

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
    >
      <div className="mb-4">
        <Link
          href="/dashboard/galleries"
          className="text-sm text-muted hover:text-ink-2 transition-colors"
        >
          ← All galleries
        </Link>
      </div>

      <GalleryDetailHeader
        title={gallery.title}
        slug={gallery.slug}
        visibility={gallery.visibility}
        viewCount={gallery.view_count}
        galleryId={gallery.id}
      />

      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        <div className="lg:col-span-2 space-y-5">
          {gallery.description && (
            <div className="bg-surface border border-line rounded-2xl p-6">
              <h2 className="text-base font-semibold text-ink mb-2">
                Description
              </h2>
              <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line">
                {gallery.description}
              </p>
            </div>
          )}

          <EmptyState
            icon={<PhotoIcon size={22} />}
            title="No photos in this gallery yet"
            description="Once photo upload ships in Step 10, you'll be able to add photos to this gallery here."
          />

          <GallerySettingsForm
            galleryId={gallery.id}
            title={gallery.title}
            description={gallery.description ?? ""}
            visibility={gallery.visibility as "private" | "password" | "public"}
            password={gallery.password ?? ""}
          />
        </div>

        <aside className="space-y-3">
          <SidePill
            label="Visibility"
            value={
              gallery.visibility === "private"
                ? "Private"
                : gallery.visibility === "password"
                  ? "Password-protected"
                  : "Public"
            }
          />
          <SidePill
            label="Linked project"
            value={linkedProject?.name ?? "Standalone"}
            href={
              linkedProject
                ? `/dashboard/projects/${linkedProject.id}`
                : undefined
            }
          />
          <SidePill label="Views" value={String(gallery.view_count)} />
          <SidePill
            label="Downloads"
            value={String(gallery.download_count)}
          />
          <SidePill
            label="Created"
            value={new Date(gallery.created_at).toLocaleDateString("en-GB", {
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

function SidePill({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-surface border border-line rounded-xl px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-ink">{value}</div>
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:bg-surface-2 rounded-xl transition-colors">
      {inner}
    </Link>
  ) : (
    inner
  );
}
