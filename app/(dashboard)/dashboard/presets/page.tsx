import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PresetsLibrary, type LibraryPreset } from "@/components/photo/PresetsLibrary";

export const metadata = { title: "Presets" };

const FALLBACK_PREVIEW =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85";

interface PresetRow {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  is_favorite: boolean;
  adjustments: Record<string, number> | null;
}

interface LandingPhotoRow {
  storage_path: string;
}

export default async function PresetsPage() {
  const ctx = await getDashboardContext();
  if (ctx.role !== "owner") redirect("/dashboard");

  const supabase = await createClient();

  const { data: landingPhoto } = await supabase
    .from("landing_photos")
    .select("storage_path")
    .order("slot", { ascending: true })
    .limit(1)
    .maybeSingle();

  let previewImageUrl = FALLBACK_PREVIEW;
  const lp = landingPhoto as LandingPhotoRow | null;
  if (lp?.storage_path) {
    const { data: pub } = supabase.storage.from("landing").getPublicUrl(lp.storage_path);
    if (pub.publicUrl) previewImageUrl = pub.publicUrl;
  }

  const { data: rows } = await supabase
    .from("presets")
    .select("id, name, description, category, tags, is_favorite, adjustments")
    .eq("workspace_id", ctx.workspaceId)
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false });

  const raw = (rows ?? []) as PresetRow[];
  const presets: LibraryPreset[] = raw.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    category: p.category ?? "custom",
    tags: p.tags ?? [],
    is_favorite: p.is_favorite,
    adjustments: (p.adjustments ?? {}) as LibraryPreset["adjustments"],
  }));

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Presets"
      description="Lightroom-style adjustments. Build a look once, apply it across galleries with one click."
    >
      <PresetsLibrary presets={presets} previewImageUrl={previewImageUrl} />
    </DashboardShell>
  );
}
