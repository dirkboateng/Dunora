"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { slugifyWithSuffix } from "@/lib/slug";

export type ProjectType =
  | "football_match"
  | "event"
  | "portrait"
  | "wedding"
  | "club_night"
  | "other";

export interface CreateProjectInput {
  name: string;
  client_name?: string | null;
  project_type: ProjectType;
  shoot_date?: string | null;
  description?: string | null;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  data?: { id: string; slug: string };
}

export async function createProject(
  input: CreateProjectInput
): Promise<ActionResult> {
  const trimmedName = input.name?.trim() ?? "";
  if (!trimmedName) {
    return { ok: false, error: "Project name is required" };
  }
  if (trimmedName.length > 200) {
    return { ok: false, error: "Project name is too long (max 200 chars)" };
  }
  if ((input.client_name?.trim().length ?? 0) > 200) {
    return { ok: false, error: "Client name is too long (max 200 chars)" };
  }
  if ((input.description?.trim().length ?? 0) > 5000) {
    return { ok: false, error: "Description is too long (max 5000 chars)" };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const slug = slugifyWithSuffix(trimmedName);

  const insertRes = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      name: trimmedName,
      slug,
      client_name: input.client_name?.trim() || null,
      type: input.project_type, // legacy column for existing schema
      project_type: input.project_type, // app-facing column
      shoot_date: input.shoot_date || null,
      description: input.description?.trim() || null,
      status: "draft",
    })
    .select("id, slug")
    .single();

  if (insertRes.error) {
    return { ok: false, error: insertRes.error.message };
  }

  const row = insertRes.data as { id: string; slug: string };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  return { ok: true, data: { id: row.id, slug: row.slug } };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  if (!projectId) return { ok: false, error: "Project ID is required" };

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  // Soft-delete via deleted_at. RLS already prevents cross-workspace mutations,
  // but the explicit workspace filter is defense-in-depth and gives a clear
  // "not found" if someone tampers with the URL.
  const updateRes = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("workspace_id", workspaceId);

  if (updateRes.error) {
    return { ok: false, error: updateRes.error.message };
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export interface UpdateProjectInput {
  project_id: string;
  name?: string;
  client_name?: string | null;
  project_type?: ProjectType;
  shoot_date?: string | null;
  description?: string | null;
}

export async function updateProject(
  input: UpdateProjectInput
): Promise<ActionResult> {
  if (!input.project_id) return { ok: false, error: "Project ID is required" };

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) {
    const trimmed = input.name.trim();
    if (!trimmed) return { ok: false, error: "Project name is required" };
    if (trimmed.length > 200) return { ok: false, error: "Project name is too long (max 200 chars)" };
    updates.name = trimmed;
  }
  if (input.client_name !== undefined) {
    const trimmed = input.client_name?.trim();
    if (trimmed && trimmed.length > 200) {
      return { ok: false, error: "Client name is too long (max 200 chars)" };
    }
    updates.client_name = trimmed || null;
  }
  if (input.project_type !== undefined) {
    updates.type = input.project_type;
    updates.project_type = input.project_type;
  }
  if (input.shoot_date !== undefined) {
    updates.shoot_date = input.shoot_date || null;
  }
  if (input.description !== undefined) {
    const trimmed = input.description?.trim();
    if (trimmed && trimmed.length > 5000) {
      return { ok: false, error: "Description is too long (max 5000 chars)" };
    }
    updates.description = trimmed || null;
  }

  const { error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", input.project_id)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${input.project_id}`);
  return { ok: true };
}

export async function createProjectAndRedirect(input: CreateProjectInput) {
  const result = await createProject(input);
  if (!result.ok || !result.data) {
    return result;
  }
  redirect(`/dashboard/projects/${result.data.id}`);
}
