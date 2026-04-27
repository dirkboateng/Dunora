"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/workspace";
import type { AccountType } from "@/types/database";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const VALID_ACCOUNT_TYPES: AccountType[] = [
  "photographer",
  "club",
  "agency",
  "event",
  "other",
];

export async function updateProfile(input: {
  full_name: string;
  account_type?: AccountType | null;
}): Promise<ActionResult> {
  const trimmedName = input.full_name?.trim() ?? "";
  if (!trimmedName) {
    return { ok: false, error: "Name is required" };
  }
  if (trimmedName.length > 200) {
    return { ok: false, error: "Name is too long (max 200 chars)" };
  }
  // Validate account_type against the allowed enum (matches schema check)
  if (
    input.account_type !== undefined &&
    input.account_type !== null &&
    !VALID_ACCOUNT_TYPES.includes(input.account_type)
  ) {
    return { ok: false, error: "Invalid account type" };
  }

  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const updates: Record<string, unknown> = {
    full_name: trimmedName,
  };
  if (input.account_type !== undefined) {
    updates.account_type = input.account_type;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateWorkspace(input: {
  workspace_id: string;
  name: string;
  brand_color?: string | null;
}): Promise<ActionResult> {
  const trimmedName = input.name?.trim() ?? "";
  if (!trimmedName) {
    return { ok: false, error: "Workspace name is required" };
  }
  if (trimmedName.length > 200) {
    return { ok: false, error: "Workspace name is too long (max 200 chars)" };
  }
  // Validate brand_color is a 6 or 3 char hex
  if (input.brand_color && !/^#[0-9A-Fa-f]{6}$/.test(input.brand_color)) {
    return { ok: false, error: "Brand color must be a 6-character hex like #047857" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("workspaces")
    .update({
      name: trimmedName,
      brand_color: input.brand_color || null,
    })
    .eq("id", input.workspace_id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
