import { createClient } from "@/lib/supabase/server";

/**
 * Server-only helper. Returns the current user's primary workspace_id.
 * Self-heals: if no membership exists, calls ensure_workspace RPC.
 * Throws if not authenticated.
 */
export async function getCurrentWorkspaceId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const membershipRes = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const membership = membershipRes.data as { workspace_id: string } | null;
  if (membership) return membership.workspace_id;

  // Self-heal
  const rpcRes = await supabase.rpc("ensure_workspace");
  if (rpcRes.error) {
    throw new Error(`Failed to provision workspace: ${rpcRes.error.message}`);
  }
  const rows = rpcRes.data as { workspace_id: string }[] | null;
  const row = rows?.[0];
  if (!row) throw new Error("ensure_workspace returned no rows");
  return row.workspace_id;
}

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}
