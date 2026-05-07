"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

export interface PresetInput {
  name: string;
  description?: string;
  default_visibility: "private" | "public" | "password";
  default_brand_color?: string | null;
  default_watermark_id?: string | null;
  is_default?: boolean;
}

function validateColor(color: string | null | undefined): string | null {
  if (!color) return null;
  const trimmed = color.trim();
  if (!trimmed) return null;
  if (!/^#[0-9a-fA-F]{6}$/.test(trimmed)) return null;
  return trimmed.toLowerCase();
}

export async function createPreset(input: PresetInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const workspaceId = await getCurrentWorkspaceId();
  const name = (input.name ?? "").trim();
  if (!name || name.length > 80) {
    return { ok: false, error: "Name is required (max 80 chars)" };
  }

  const description = (input.description ?? "").trim().slice(0, 500);
  const visibility = input.default_visibility;
  if (!["private", "public", "password"].includes(visibility)) {
    return { ok: false, error: "Invalid visibility" };
  }

  const brandColor = validateColor(input.default_brand_color);
  const isDefault = !!input.is_default;

  if (isDefault) {
    await supabase
      .from("gallery_presets")
      .update({ is_default: false })
      .eq("workspace_id", workspaceId)
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("gallery_presets")
    .insert({
      workspace_id: workspaceId,
      name,
      description,
      default_visibility: visibility,
      default_brand_color: brandColor,
      default_watermark_id: input.default_watermark_id || null,
      is_default: isDefault,
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
  if (!name || name.length > 80) {
    return { ok: false, error: "Name is required (max 80 chars)" };
  }

  const description = (input.description ?? "").trim().slice(0, 500);
  const visibility = input.default_visibility;
  if (!["private", "public", "password"].includes(visibility)) {
    return { ok: false, error: "Invalid visibility" };
  }

  const brandColor = validateColor(input.default_brand_color);
  const isDefault = !!input.is_default;

  if (isDefault) {
    await supabase
      .from("gallery_presets")
      .update({ is_default: false })
      .eq("workspace_id", workspaceId)
      .eq("is_default", true)
      .neq("id", id);
  }

  const { error } = await supabase
    .from("gallery_presets")
    .update({
      name,
      description,
      default_visibility: visibility,
      default_brand_color: brandColor,
      default_watermark_id: input.default_watermark_id || null,
      is_default: isDefault,
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
    .from("gallery_presets")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/presets");
  return { ok: true };
}
