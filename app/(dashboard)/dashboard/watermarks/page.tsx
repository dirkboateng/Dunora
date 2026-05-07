import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WatermarksManager, type Watermark } from "@/components/photo/WatermarksManager";

export const metadata = { title: "Watermarks" };

const FALLBACK_PREVIEW =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85";

interface WatermarkRow {
  id: string;
  name: string;
  storage_path: string;
  file_name: string;
  position: Watermark["position"];
  opacity: number;
  scale: number;
  is_default: boolean;
}

interface LandingPhotoRow {
  storage_path: string;
}

export default async function WatermarksPage() {
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
    .from("watermarks")
    .select("id, name, storage_path, file_name, position, opacity, scale, is_default")
    .eq("workspace_id", ctx.workspaceId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const raw = (rows ?? []) as WatermarkRow[];
  const watermarks: Watermark[] = raw.map((w) => {
    const { data: pub } = supabase.storage.from("watermarks").getPublicUrl(w.storage_path);
    return { ...w, url: pub.publicUrl };
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Watermarks"
      description="Upload your logo and apply it to galleries on delivery. Position, size and opacity all adjustable."
    >
      <WatermarksManager
        watermarks={watermarks}
        previewImageUrl={previewImageUrl}
        supabaseUrl={supabaseUrl}
        supabaseAnonKey={supabaseAnonKey}
      />
    </DashboardShell>
  );
}
