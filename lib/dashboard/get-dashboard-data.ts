import { createClient } from "@/lib/supabase/server";

/**
 * Server-only dashboard data fetcher.
 *
 * Responsibilities:
 *   1. Read profile, workspace membership, workspace details.
 *   2. Self-heal: if user has no workspace (rare — trigger missed them or
 *      they signed up before migration ran), call ensure_workspace() RPC
 *      which creates one idempotently.
 *   3. Fetch lightweight counts for the dashboard widgets.
 *
 * All queries respect RLS — the function does not use the service-role key.
 * ensure_workspace() runs as SECURITY DEFINER but only acts on auth.uid(),
 * so it can't be abused to create workspaces for other users.
 */

export interface Profile {
  full_name: string | null;
  account_type: string | null;
  onboarding_completed_at: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  storage_used_bytes: number;
  storage_quota_bytes: number;
  role: string;
}

export interface DashboardStats {
  projectCount: number;
  photoCount: number;
  galleryCount: number;
}

export interface RecentProject {
  id: string;
  name: string;
  client_name: string | null;
  project_type: string;
  shoot_date: string | null;
  status: string;
}

export interface RecentGallery {
  id: string;
  title: string;
  slug: string;
  visibility: string;
  view_count: number;
}

export interface DashboardData {
  email: string;
  profile: Profile | null;
  workspace: Workspace | null;
  stats: DashboardStats;
  recentProjects: RecentProject[];
  recentGalleries: RecentGallery[];
  selfHealed: boolean;
}

// ensure_workspace RPC return type
interface EnsureWorkspaceRow {
  workspace_id: string;
  workspace_name: string;
  workspace_slug: string;
  storage_used_bytes: number;
  storage_quota_bytes: number;
  member_role: string;
}

export async function getDashboardData(): Promise<DashboardData & { userId: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // 1. Profile
  const profileRes = await supabase
    .from("profiles")
    .select("full_name, account_type, onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileRes.data as Profile | null;

  // 2. Workspace via membership (fast path)
  let workspace: Workspace | null = null;
  let selfHealed = false;

  const membershipRes = await supabase
    .from("workspace_members")
    .select("role, workspace_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const membership = membershipRes.data as
    | { role: string; workspace_id: string }
    | null;

  if (membership) {
    const wRes = await supabase
      .from("workspaces")
      .select("id, name, slug, storage_used_bytes, storage_quota_bytes")
      .eq("id", membership.workspace_id)
      .maybeSingle();
    const w = wRes.data as
      | {
          id: string;
          name: string;
          slug: string;
          storage_used_bytes: number;
          storage_quota_bytes: number;
        }
      | null;
    if (w) {
      workspace = { ...w, role: membership.role };
    }
  }

  // 3. Self-heal: no workspace? Bootstrap via RPC.
  if (!workspace) {
    const rpcRes = await supabase.rpc("ensure_workspace");
    if (rpcRes.error) {
      // Migration 003 not applied yet, or RPC failed. Don't crash the page.
      console.error("[ensure_workspace] failed:", rpcRes.error.message);
    } else {
      const rows = rpcRes.data as EnsureWorkspaceRow[] | null;
      const row = rows?.[0];
      if (row) {
        workspace = {
          id: row.workspace_id,
          name: row.workspace_name,
          slug: row.workspace_slug,
          storage_used_bytes: row.storage_used_bytes,
          storage_quota_bytes: row.storage_quota_bytes,
          role: row.member_role,
        };
        selfHealed = true;
      }
    }
  }

  // 4. Stats — only if we have a workspace
  let stats: DashboardStats = {
    projectCount: 0,
    photoCount: 0,
    galleryCount: 0,
  };
  let recentProjects: RecentProject[] = [];
  let recentGalleries: RecentGallery[] = [];

  if (workspace) {
    const [projectsRes, photosRes, galleriesRes, recentRes, recentGalRes] =
      await Promise.all([
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspace.id)
          .is("deleted_at", null),
        supabase
          .from("photos")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspace.id)
          .is("deleted_at", null),
        supabase
          .from("galleries")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspace.id),
        supabase
          .from("projects")
          .select("id, name, client_name, project_type, shoot_date, status")
          .eq("workspace_id", workspace.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("galleries")
          .select("id, title, slug, visibility, view_count")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

    stats = {
      projectCount: projectsRes.count ?? 0,
      photoCount: photosRes.count ?? 0,
      galleryCount: galleriesRes.count ?? 0,
    };
    recentProjects = (recentRes.data ?? []) as RecentProject[];
    recentGalleries = (recentGalRes.data ?? []) as RecentGallery[];
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    profile,
    workspace,
    stats,
    recentProjects,
    recentGalleries,
    selfHealed,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 GB";
  const tb = bytes / 1024 ** 4;
  if (tb >= 1) return `${tb.toFixed(2)} TB`;
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / 1024 ** 2;
  return `${mb.toFixed(1)} MB`;
}
