import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LandingPhotoSlots } from "@/components/site/LandingPhotoSlots";
import { LandingContentForm } from "@/components/site/LandingContentForm";
import type { LandingContent } from "@/lib/actions/site";

export const metadata = {
  title: "Site management",
};

interface LandingPhotoRow {
  id: string;
  slot: number;
  storage_path: string;
  file_name: string;
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

function emptyContent(): LandingContent {
  const obj = {} as LandingContent;
  for (const k of FIELD_KEYS) (obj as Record<string, string>)[k] = "";
  return obj;
}

function rowToContent(row: Record<string, unknown> | null): LandingContent {
  const out = emptyContent();
  if (!row) return out;
  for (const k of FIELD_KEYS) {
    const v = row[k];
    (out as Record<string, string>)[k] = typeof v === "string" ? v : "";
  }
  return out;
}

export default async function SitePage() {
  const ctx = await getDashboardContext();
  if (ctx.role !== "owner") redirect("/dashboard");

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("landing_photos")
    .select("id, slot, storage_path, file_name")
    .order("slot", { ascending: true });

  const landingPhotos = (rows ?? []) as LandingPhotoRow[];
  const photos: Record<number, { slot: number; storage_path: string; file_name: string; url: string } | undefined> = {};
  for (const p of landingPhotos) {
    const { data: pub } = supabase.storage.from("landing").getPublicUrl(p.storage_path);
    photos[p.slot] = {
      slot: p.slot,
      storage_path: p.storage_path,
      file_name: p.file_name,
      url: pub.publicUrl,
    };
  }

  const { data: contentRows } = await supabase.from("landing_content").select("*");
  const enRow = (contentRows ?? []).find((r) => r.locale === "en") ?? null;
  const nlRow = (contentRows ?? []).find((r) => r.locale === "nl") ?? null;
  const initialEn = rowToContent(enRow);
  const initialNl = rowToContent(nlRow);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Site management"
      description="Manage what visitors see on your public landing page."
    >
      <div className="space-y-12">
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-ink mb-1">Landing photos</h2>
            <p className="text-sm text-ink-2 leading-relaxed max-w-2xl">
              The 6 photos shown in the preview mock on the landing page. Drop a JPG, PNG or HEIC into each slot. Changes go live immediately.
            </p>
          </div>
          <LandingPhotoSlots photos={photos} supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
        </section>

        <section className="border-t border-line pt-10">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-ink mb-1">Landing texts</h2>
            <p className="text-sm text-ink-2 leading-relaxed max-w-2xl">
              All editable text on the landing page. Switch between Dutch and English. Changes go live immediately after saving.
            </p>
          </div>
          <LandingContentForm initialEn={initialEn} initialNl={initialNl} />
        </section>
      </div>
    </DashboardShell>
  );
}
