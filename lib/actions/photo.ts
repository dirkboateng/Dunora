"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { type Adjustments, mergeAdjustments } from "@/lib/photo/adjustments";

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const FREE_TIER_PRESET_LIMIT = 3;
const FREE_TIER_BATCH_LIMIT = 10;

export interface PresetInput {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  adjustments: Partial<Adjustments>;
  is_favorite?: boolean;
}

export async function createPreset(input: PresetInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const name = (input.name ?? "").trim();
  if (!name || name.length > 80) return { ok: false, error: "Name is required (max 80 chars)" };

  const { count } = await supabase
    .from("presets")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if ((count ?? 0) >= FREE_TIER_PRESET_LIMIT) {
    return {
      ok: false,
      error: `Free tier limit reached (${FREE_TIER_PRESET_LIMIT} presets). Upgrade to Pro for unlimited presets.`,
    };
  }

  const adjustments = mergeAdjustments(input.adjustments);
  const tags = (input.tags ?? []).slice(0, 10).map((t) => t.trim().slice(0, 30)).filter(Boolean);

  const { data, error } = await supabase
    .from("presets")
    .insert({
      workspace_id: workspaceId,
      name,
      description: (input.description ?? "").trim().slice(0, 500),
      category: (input.category ?? "custom").trim().slice(0, 30) || "custom",
      tags,
      adjustments,
      is_favorite: !!input.is_favorite,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true, id: data.id };
}

export async function updatePreset(id: string, input: PresetInput): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing preset id" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const name = (input.name ?? "").trim();
  if (!name || name.length > 80) return { ok: false, error: "Name is required (max 80 chars)" };

  const adjustments = mergeAdjustments(input.adjustments);
  const tags = (input.tags ?? []).slice(0, 10).map((t) => t.trim().slice(0, 30)).filter(Boolean);

  const { error } = await supabase
    .from("presets")
    .update({
      name,
      description: (input.description ?? "").trim().slice(0, 500),
      category: (input.category ?? "custom").trim().slice(0, 30) || "custom",
      tags,
      adjustments,
      is_favorite: !!input.is_favorite,
    })
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true };
}

export async function deletePreset(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing preset id" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const { error } = await supabase
    .from("presets")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true };
}

export async function duplicatePreset(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing preset id" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();

  const { data: source } = await supabase
    .from("presets")
    .select("name, description, category, tags, adjustments")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (!source) return { ok: false, error: "Preset not found" };

  const { count } = await supabase
    .from("presets")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);
  if ((count ?? 0) >= FREE_TIER_PRESET_LIMIT) {
    return { ok: false, error: `Free tier limit reached. Upgrade to Pro for unlimited presets.` };
  }

  const { data, error } = await supabase
    .from("presets")
    .insert({
      workspace_id: workspaceId,
      name: `${source.name} (copy)`,
      description: source.description,
      category: source.category,
      tags: source.tags,
      adjustments: source.adjustments,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true, id: data.id };
}

export async function toggleFavorite(id: string, value: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("presets")
    .update({ is_favorite: value })
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true };
}
export async function applyPresetToPhotos(input: {
  preset_id: string;
  photo_ids: string[];
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const photoIds = (input.photo_ids ?? []).filter(Boolean);
  if (photoIds.length === 0) return { ok: false, error: "No photos selected" };

  if (photoIds.length > FREE_TIER_BATCH_LIMIT) {
    return {
      ok: false,
      error: `Free tier limit: ${FREE_TIER_BATCH_LIMIT} photos per batch. Upgrade to Pro for unlimited.`,
    };
  }

  const { data: preset, error: pErr } = await supabase
    .from("presets")
    .select("id, adjustments")
    .eq("id", input.preset_id)
    .eq("workspace_id", workspaceId)
    .maybeSingle();
  if (pErr || !preset) return { ok: false, error: "Preset not found" };

  const { data: validPhotos } = await supabase
    .from("photos")
    .select("id, project_id, projects!inner(workspace_id)")
    .in("id", photoIds);

  const validIds = (validPhotos ?? [])
    .filter((p) => {
      const proj = (p as unknown as { projects: { workspace_id: string } }).projects;
      return proj && proj.workspace_id === workspaceId;
    })
    .map((p) => p.id);

  if (validIds.length === 0) return { ok: false, error: "No accessible photos" };

  const rows = validIds.map((photo_id) => ({
    photo_id,
    workspace_id: workspaceId,
    preset_id: preset.id,
    adjustments: preset.adjustments,
  }));

  const { error } = await supabase
    .from("photo_edits")
    .upsert(rows, { onConflict: "photo_id" });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/galleries");
  return { ok: true };
}

export async function clearPhotoEdit(photoId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("photo_edits")
    .delete()
    .eq("photo_id", photoId)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/projects");
  return { ok: true };
}

export interface WatermarkInput {
  name: string;
  storage_path: string;
  file_name: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  opacity?: number;
  scale?: number;
  is_default?: boolean;
}

export async function createWatermark(input: WatermarkInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const name = (input.name ?? "").trim();
  if (!name || name.length > 80) return { ok: false, error: "Name is required (max 80 chars)" };
  if (!input.storage_path || !input.file_name) return { ok: false, error: "Watermark file missing" };

  const opacity = Math.max(0, Math.min(1, input.opacity ?? 0.6));
  const scale = Math.max(0.05, Math.min(0.5, input.scale ?? 0.15));
  const position = input.position ?? "bottom-right";
  const isDefault = !!input.is_default;

  if (isDefault) {
    await supabase.from("watermarks")
      .update({ is_default: false })
      .eq("workspace_id", workspaceId).eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("watermarks")
    .insert({
      workspace_id: workspaceId,
      name,
      storage_path: input.storage_path,
      file_name: input.file_name,
      position,
      opacity,
      scale,
      is_default: isDefault,
      created_by: user.id,
    })
    .select("id").single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/watermarks");
  return { ok: true, id: data.id };
}

export async function updateWatermark(id: string, input: Partial<WatermarkInput>): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const update: Record<string, unknown> = {};
  if (input.name !== undefined) update.name = input.name.trim().slice(0, 80);
  if (input.position !== undefined) update.position = input.position;
  if (input.opacity !== undefined) update.opacity = Math.max(0, Math.min(1, input.opacity));
  if (input.scale !== undefined) update.scale = Math.max(0.05, Math.min(0.5, input.scale));
  if (input.is_default === true) {
    await supabase.from("watermarks").update({ is_default: false })
      .eq("workspace_id", workspaceId).eq("is_default", true).neq("id", id);
    update.is_default = true;
  } else if (input.is_default === false) {
    update.is_default = false;
  }

  const { error } = await supabase
    .from("watermarks").update(update).eq("id", id).eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/watermarks");
  return { ok: true };
}

export async function deleteWatermark(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId();

  const { data: existing } = await supabase
    .from("watermarks").select("storage_path").eq("id", id).eq("workspace_id", workspaceId).maybeSingle();

  const { error } = await supabase
    .from("watermarks").delete().eq("id", id).eq("workspace_id", workspaceId);
  if (error) return { ok: false, error: error.message };

  if (existing?.storage_path) {
    await supabase.storage.from("watermarks").remove([existing.storage_path]);
  }

  revalidatePath("/dashboard/watermarks");
  return { ok: true };
}
