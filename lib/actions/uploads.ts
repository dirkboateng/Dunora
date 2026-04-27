"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { isAllowedMime, isAllowedSize, MAX_FILE_BYTES } from "@/lib/upload/tus-config";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface CheckQuotaInput {
  total_bytes: number;
}

export interface CheckQuotaResult extends ActionResult {
  available_bytes?: number;
  used_bytes?: number;
  quota_bytes?: number;
}

export async function checkUploadQuota(
  input: CheckQuotaInput,
): Promise<CheckQuotaResult> {
  if (!Number.isFinite(input.total_bytes) || input.total_bytes <= 0) {
    return { ok: false, error: "No files selected" };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("workspaces")
    .select("storage_used_bytes, storage_quota_bytes")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Could not read workspace storage info" };
  }

  const w = data as {
    storage_used_bytes: number;
    storage_quota_bytes: number;
  };
  const available = Math.max(0, w.storage_quota_bytes - w.storage_used_bytes);

  if (input.total_bytes > available) {
    const availableMb = (available / 1024 / 1024).toFixed(0);
    const requestedMb = (input.total_bytes / 1024 / 1024).toFixed(0);
    return {
      ok: false,
      error: `Not enough storage. ${availableMb} MB available, ${requestedMb} MB requested.`,
      available_bytes: available,
      used_bytes: w.storage_used_bytes,
      quota_bytes: w.storage_quota_bytes,
    };
  }

  return {
    ok: true,
    available_bytes: available,
    used_bytes: w.storage_used_bytes,
    quota_bytes: w.storage_quota_bytes,
  };
}

export interface RegisterPhotoInput {
  photo_id: string;
  project_id: string;
  storage_path: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  width?: number;
  height?: number;
}

export async function registerUploadedPhoto(
  input: RegisterPhotoInput,
): Promise<ActionResult> {
  if (!input.photo_id || !input.project_id || !input.storage_path) {
    return { ok: false, error: "Missing required upload metadata" };
  }
  const fileName = (input.file_name ?? "").trim();
  if (!fileName) return { ok: false, error: "File name is required" };
  if (fileName.length > 255) {
    return { ok: false, error: "File name is too long" };
  }
  if (!isAllowedSize(input.file_size_bytes)) {
    return {
      ok: false,
      error: `File size must be between 1 byte and ${MAX_FILE_BYTES} bytes`,
    };
  }
  if (!isAllowedMime(input.mime_type)) {
    return { ok: false, error: "Unsupported file type" };
  }

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const projectCheck = await supabase
    .from("projects")
    .select("id")
    .eq("id", input.project_id)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!projectCheck.data) {
    return { ok: false, error: "Project not found" };
  }

  const { error } = await supabase.from("photos").insert({
    id: input.photo_id,
    workspace_id: workspaceId,
    project_id: input.project_id,
    storage_path: input.storage_path,
    file_name: fileName,
    file_size_bytes: input.file_size_bytes,
    mime_type: input.mime_type,
    width: input.width ?? null,
    height: input.height ?? null,
    status: "ready",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/projects/${input.project_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deletePhoto(photoId: string): Promise<ActionResult> {
  if (!photoId) return { ok: false, error: "Photo ID is required" };

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data: photo } = await supabase
    .from("photos")
    .select("project_id")
    .eq("id", photoId)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!photo) {
    return { ok: false, error: "Photo not found" };
  }

  const { error } = await supabase
    .from("photos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", photoId)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };

  const p = photo as { project_id: string };
  revalidatePath(`/dashboard/projects/${p.project_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
