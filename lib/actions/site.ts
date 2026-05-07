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
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
