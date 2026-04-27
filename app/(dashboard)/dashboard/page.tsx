import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardData, formatBytes } from "@/lib/dashboard/get-dashboard-data";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  FolderIcon,
  UploadIcon,
  GalleryIcon,
  StorageIcon,
  PhotoIcon,
  SparkleIcon,
  PlusIcon,
} from "@/components/dashboard/Icon";

export const metadata = {
  title: "Dashboard",
};

/**
 * Step 8 — real dashboard.
 *
 * Server Component end-to-end. All data fetching is server-side and respects
 * RLS. If a user has no workspace (signup trigger missed them), the
 * getDashboardData() helper self-heals via the ensure_workspace RPC.
 *
 * If the user hasn't completed onboarding yet, redirect them to /onboarding.
 */
export default async function DashboardPage() {
  const data = await getDashboardData();
  const { profile, workspace, email, stats, selfHealed, recentProjects, recentGalleries } = data;

  // Funnel new users through the onboarding wizard.
  // Existing users (onboarding_completed_at is set) stay here.
  if (profile && !profile.onboarding_completed_at) {
    redirect("/onboarding");
  }

  // Friendly first name for the welcome
  const firstName =
    profile?.full_name?.split(" ")[0] ?? email.split("@")[0] ?? "there";

  // Time-of-day greeting (server time — close enough for a greeting)
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Storage progress
  const storagePct = workspace
    ? Math.min(
        (workspace.storage_used_bytes / workspace.storage_quota_bytes) * 100,
        100
      )
    : 0;

  return (
    <>
      <Topbar
        workspaceName={workspace?.name ?? "Dunora"}
        email={email}
        role={workspace?.role}
      />

      <main className="flex-1 px-5 md:px-8 py-8 max-w-[1280px] w-full">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.6px] text-ink">
            {greeting}, {firstName}
          </h1>
          <p className="text-ink-2 mt-1.5">
            Ready to deliver your next gallery?
          </p>
        </div>

        {/* Self-heal notice (only shown the first time the RPC ran) */}
        {selfHealed && (
          <div className="mb-6 bg-accent-wash border border-accent/20 rounded-xl px-4 py-3 flex items-start gap-3">
            <SparkleIcon size={18} className="text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-accent-deep">
                Welcome to Dunora
              </div>
              <div className="text-[13px] text-ink-2 leading-relaxed mt-0.5">
                We&apos;ve set up your workspace. You&apos;re ready to upload
                your first shoot.
              </div>
            </div>
          </div>
        )}

        {/* Workspace missing (RPC also failed — exceptional path) */}
        {!workspace && (
          <div className="mb-8">
            <EmptyState
              icon={<FolderIcon size={24} />}
              title="No workspace yet"
              description="We couldn't set up your workspace automatically. Please refresh the page, or contact support if this persists."
            />
          </div>
        )}

        {/* Stats grid */}
        {workspace && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
            <StatCard
              icon={<FolderIcon size={18} />}
              label="Active projects"
              value={stats.projectCount}
              helper={stats.projectCount === 0 ? "No projects yet" : undefined}
            />
            <StatCard
              icon={<PhotoIcon size={18} />}
              label="Photos uploaded"
              value={stats.photoCount.toLocaleString()}
              helper={stats.photoCount === 0 ? "No uploads yet" : undefined}
            />
            <StatCard
              icon={<GalleryIcon size={18} />}
              label="Galleries"
              value={stats.galleryCount}
              helper={stats.galleryCount === 0 ? "Nothing published" : undefined}
            />
            <StatCard
              icon={<StorageIcon size={18} />}
              label="Storage used"
              value={formatBytes(workspace.storage_used_bytes)}
              helper={`of ${formatBytes(workspace.storage_quota_bytes)} (${storagePct.toFixed(0)}%)`}
            />
          </div>
        )}

        {/* Quick actions */}
        {workspace && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">Quick actions</h2>
              <span className="text-xs text-muted">
                Get started in seconds
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              <QuickActionCard
                icon={<PlusIcon size={20} />}
                title="Create project"
                description="Set up a new shoot, add client info and defaults."
                href="/dashboard/projects/new"
                primary
              />
              <QuickActionCard
                icon={<UploadIcon size={20} />}
                title="Upload photos"
                description="Coming next — resumable uploads up to 200 MB per file."
                href="/dashboard/uploads"
                disabled
              />
              <QuickActionCard
                icon={<GalleryIcon size={20} />}
                title="Create gallery"
                description="Build a client-ready gallery with one share link."
                href="/dashboard/galleries/new"
              />
            </div>
          </section>
        )}

        {/* Two-column lower section */}
        {workspace && (
          <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
            {/* Recent projects */}
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-ink">
                  Recent projects
                </h2>
                {recentProjects.length > 0 && (
                  <Link
                    href="/dashboard/projects"
                    className="text-xs font-medium text-accent-deep hover:text-accent transition-colors"
                  >
                    View all →
                  </Link>
                )}
              </div>
              {recentProjects.length === 0 ? (
                <EmptyState
                  icon={<FolderIcon size={22} />}
                  title="No projects yet"
                  description="Create your first project and start organizing shoots, uploads and galleries."
                />
              ) : (
                <div className="bg-surface border border-line rounded-2xl divide-y divide-line">
                  {recentProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/dashboard/projects/${p.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink truncate">
                          {p.name}
                        </div>
                        <div className="text-xs text-muted truncate">
                          {p.client_name ?? "No client"}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-wash text-accent-deep px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Recent galleries */}
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-base font-semibold text-ink">
                  Recent galleries
                </h2>
                {recentGalleries.length > 0 && (
                  <Link
                    href="/dashboard/galleries"
                    className="text-xs font-medium text-accent-deep hover:text-accent transition-colors"
                  >
                    View all →
                  </Link>
                )}
              </div>
              {recentGalleries.length === 0 ? (
                <EmptyState
                  icon={<GalleryIcon size={22} />}
                  title="No galleries yet"
                  description="Create a gallery to share photos with clients via a branded link."
                />
              ) : (
                <div className="bg-surface border border-line rounded-2xl divide-y divide-line">
                  {recentGalleries.map((g) => (
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
                          {g.view_count} {g.view_count === 1 ? "view" : "views"} · /g/{g.slug}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-surface-2 text-ink-2 px-2 py-0.5 rounded-full">
                        {g.visibility}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
