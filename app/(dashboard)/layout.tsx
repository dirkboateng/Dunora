import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";

/**
 * Dashboard shell — sidebar + content area.
 * Fetches workspace context once at the layout level so the sidebar can show
 * live storage usage. Children render their own Topbar (per-page).
 *
 * Defense-in-depth: middleware redirects unauthenticated users, and this
 * server-rendered layout double-checks. Two locks, one door.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch workspace info for the sidebar storage bar.
  // If this throws (no workspace, RPC missing) we fall back to defaults.
  let storageUsed = 0;
  let storageQuota = 10737418240;
  try {
    const ctx = await getDashboardContext();
    storageUsed = ctx.storageUsed;
    storageQuota = ctx.storageQuota;
  } catch {
    // Fallback to defaults — rare; happens before migrations are applied
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar storageUsed={storageUsed} storageQuota={storageQuota} />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
