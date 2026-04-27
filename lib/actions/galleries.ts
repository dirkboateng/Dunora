"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { slugifyWithSuffix } from "@/lib/slug";

export type GalleryVisibility = "private" | "password" | "public";

export interface CreateGalleryInput {
  title: string;
  description?: string | null;
  visibility: GalleryVisibility;
  password?: string | null;
  project_id: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  data?: { id: string; slug: string };
}

export async function createGallery(
  input: CreateGalleryInput
): Promise<ActionResult> {
  const trimmedTitle = input.title?.trim() ?? "";
  if (!trimmedTitle) {
    return { ok: false, error: "Gallery title is required" };
  }
  if (trimmedTitle.length > 200) {
    return { ok: false, error: "Gallery title is too long (max 200 chars)" };
  }
  if (!input.project_id) {
    return {
      ok: false,
      error: "Pick a project for this gallery so we know which photos to include.",
    };
  }
  if ((input.description?.trim().length ?? 0) > 5000) {
    return { ok: false, error: "Description is too long (max 5000 chars)" };
  }
  if (input.visibility === "password") {
    const pw = input.password?.trim() ?? "";
    if (!pw) {
      return { ok: false, error: "Password is required for password-protected galleries" };
    }
    if (pw.length > 200) {
      return { ok: false, error: "Password is too long (max 200 chars)" };
    }
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();
  const slug = slugifyWithSuffix(trimmedTitle);

  // Defense-in-depth: confirm the project belongs to this workspace
  const projectCheck = await supabase
    .from("projects")
    .select("id")
    .eq("id", input.project_id)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!projectCheck.data) {
    return { ok: false, error: "Selected project not found in this workspace" };
  }

  const insertRes = await supabase
    .from("galleries")
    .insert({
      workspace_id: workspaceId,
      project_id: input.project_id,
      title: trimmedTitle,
      slug,
      description: input.description?.trim() || null,
      visibility: input.visibility,
      password:
        input.visibility === "password" ? input.password!.trim() : null,
    })
    .select("id, slug")
    .single();

  if (insertRes.error) {
    return { ok: false, error: insertRes.error.message };
  }

  const row = insertRes.data as { id: string; slug: string };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  return { ok: true, data: { id: row.id, slug: row.slug } };
}

export interface UpdateGalleryInput {
  gallery_id: string;
  title?: string;
  description?: string | null;
  visibility?: GalleryVisibility;
  password?: string | null;
}

export async function updateGallery(
  input: UpdateGalleryInput
): Promise<ActionResult> {
  if (!input.gallery_id) return { ok: false, error: "Gallery ID is required" };

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const trimmed = input.title.trim();
    if (!trimmed) {
      return { ok: false, error: "Gallery title is required" };
    }
    if (trimmed.length > 200) {
      return { ok: false, error: "Gallery title is too long (max 200 chars)" };
    }
    updates.title = trimmed;
  }
  if (input.description !== undefined) {
    const trimmed = input.description?.trim();
    if (trimmed && trimmed.length > 5000) {
      return { ok: false, error: "Description is too long (max 5000 chars)" };
    }
    updates.description = trimmed || null;
  }
  if (input.visibility !== undefined) {
    updates.visibility = input.visibility;
    if (input.visibility === "password") {
      const pw = input.password?.trim() ?? "";
      if (!pw) {
        return { ok: false, error: "Password required for password-protected galleries" };
      }
      if (pw.length > 200) {
        return { ok: false, error: "Password is too long (max 200 chars)" };
      }
      updates.password = pw;
    } else {
      updates.password = null;
    }
  } else if (input.password !== undefined) {
    const pw = input.password?.trim();
    if (pw && pw.length > 200) {
      return { ok: false, error: "Password is too long (max 200 chars)" };
    }
    updates.password = pw || null;
  }

  const { error } = await supabase
    .from("galleries")
    .update(updates)
    .eq("id", input.gallery_id)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/galleries");
  revalidatePath(`/dashboard/galleries/${input.gallery_id}`);
  return { ok: true };
}

export async function deleteGallery(galleryId: string): Promise<ActionResult> {
  if (!galleryId) return { ok: false, error: "Gallery ID is required" };

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("galleries")
    .delete()
    .eq("id", galleryId)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  return { ok: true };
}
