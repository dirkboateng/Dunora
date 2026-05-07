"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function setLandingPhoto(input: {
  slot: number;
  storage_path: string;
  file_name: string;
}): Promise<ActionResult> {
  if (input.slot < 1 || input.slot > 6) {
    return { ok: false, error: "Slot must be between 1 and 6" };
  }
  if (!input.storage_path || !input.file_name) {
    return { ok: false, error: "Missing photo data" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("landing_photos")
    .select("id, storage_path")
    .eq("slot", input.slot)
    .maybeSingle();

  const { error } = await supabase
    .from("landing_photos")
    .upsert(
      {
        slot: input.slot,
        storage_path: input.storage_path,
        file_name: input.file_name,
        uploaded_by: user.id,
      },
      { onConflict: "slot" }
    );

  if (error) return { ok: false, error: error.message };

  if (existing && existing.storage_path && existing.storage_path !== input.storage_path) {
    await supabase.storage.from("landing").remove([existing.storage_path]);
  }

  revalidatePath("/");
  revalidatePath("/dashboard/site");
  return { ok: true };
}

export async function deleteLandingPhoto(slot: number): Promise<ActionResult> {
  if (slot < 1 || slot > 6) {
    return { ok: false, error: "Slot must be between 1 and 6" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("landing_photos")
    .select("id, storage_path")
    .eq("slot", slot)
    .maybeSingle();

  if (!existing) return { ok: true };

  const { error } = await supabase
    .from("landing_photos")
    .delete()
    .eq("slot", slot);

  if (error) return { ok: false, error: error.message };

  if (existing.storage_path) {
    await supabase.storage.from("landing").remove([existing.storage_path]);
  }

  revalidatePath("/");
  revalidatePath("/dashboard/site");
  return { ok: true };
}

export type Locale = "en" | "nl";

export interface LandingContent {
  badge: string;
  headline: string;
  subhead: string;
  cta_primary: string;
  cta_secondary: string;
  for_whom_eyebrow: string;
  for_whom_title: string;
  for_whom_lead: string;
  feature_1_title: string;
  feature_1_body: string;
  feature_2_title: string;
  feature_2_body: string;
  feature_3_title: string;
  feature_3_body: string;
  closing_eyebrow: string;
  closing_title: string;
  closing_body: string;
  closing_cta: string;
  preview_label: string;
  preview_gallery: string;
  preview_meta: string;
  preview_by: string;
  under_construction: string;
  scroll_hint: string;
  sign_in: string;
  footer_legal: string;
  footer_contact: string;
  footer_rights: string;
}

const FIELD_KEYS: (keyof LandingContent)[] = [
  "badge", "headline", "subhead", "cta_primary", "cta_secondary",
  "for_whom_eyebrow", "for_whom_title", "for_whom_lead",
  "feature_1_title", "feature_1_body",
  "feature_2_title", "feature_2_body",
  "feature_3_title", "feature_3_body",
  "closing_eyebrow", "closing_title", "closing_body", "closing_cta",
  "preview_label", "preview_gallery", "preview_meta", "preview_by",
  "under_construction", "scroll_hint", "sign_in",
  "footer_legal", "footer_contact", "footer_rights",
];

export async function saveLandingContent(
  locale: Locale,
  content: LandingContent
): Promise<ActionResult> {
  if (locale !== "en" && locale !== "nl") {
    return { ok: false, error: "Invalid locale" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const update: Record<string, string> = {};
  for (const key of FIELD_KEYS) {
    const value = (content[key] ?? "").toString().trim();
    if (value.length > 5000) {
      return { ok: false, error: `Field "${key}" is too long (max 5000 chars)` };
    }
    update[key] = value;
  }
  update.updated_by = user.id;

  const { error } = await supabase
    .from("landing_content")
    .update(update)
    .eq("locale", locale);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/dashboard/site");
  return { ok: true };
}
