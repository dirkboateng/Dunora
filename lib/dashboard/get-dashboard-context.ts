import { createClient } from "@/lib/supabase/server";

export interface DashboardContext {
  userId: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  role: string;
  storageUsed: number;
  storageQuota: number;
}

/**
 * Lightweight server-only fetcher for dashboard subpages.
 * Self-heals workspace if missing. Throws if not authenticated.
 *
 * Use this in subpages (projects, galleries, settings) instead of
 * the heavier getDashboardData() which also fetches stats.
 */
export async function getDashboardContext(): Promise<DashboardContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Try existing membership first
  const membershipRes = await supabase
    .from("workspace_members")
    .select("role, workspace_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let workspaceId: string | null = null;
  let role = "owner";

  const membership = membershipRes.data as
    | { role: string; workspace_id: string }
    | null;

  if (membership) {
    workspaceId = membership.workspace_id;
    role = membership.role;
  } else {
    // Self-heal
    const rpc = await supabase.rpc("ensure_workspace");
    const rows = rpc.data as
      | {
          workspace_id: string;
          member_role: string;
        }[]
      | null;
    const row = rows?.[0];
    if (!row) {
      throw new Error(
        "Failed to provision workspace — make sure migration 003 is applied"
      );
    }
    workspaceId = row.workspace_id;
    role = row.member_role;
  }

  // Fetch workspace details
  const wRes = await supabase
    .from("workspaces")
    .select("name, storage_used_bytes, storage_quota_bytes")
    .eq("id", workspaceId)
    .single();
  const w = wRes.data as
    | {
        name: string;
        storage_used_bytes: number;
        storage_quota_bytes: number;
      }
    | null;

  return {
    userId: user.id,
    email: user.email ?? "",
    workspaceId,
    workspaceName: w?.name ?? "Dunora",
    role,
    storageUsed: w?.storage_used_bytes ?? 0,
    storageQuota: w?.storage_quota_bytes ?? 10737418240,
  };
}
