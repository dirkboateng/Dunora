import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PresetsManager, type Preset } from "@/components/presets/PresetsManager";

export const metadata = {
  title: "Presets",
};

export default async function PresetsPage() {
  const ctx = await getDashboardContext();
  if (ctx.role !== "owner") redirect("/dashboard");

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("gallery_presets")
    .select("id, name, description, default_visibility, default_brand_color, default_watermark_id, is_default")
    .eq("workspace_id", ctx.workspaceId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  const presets = (rows ?? []) as Preset[];

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Presets"
      description="Reusable templates for new galleries. Set defaults once, apply them on every shoot."
    >
      <PresetsManager presets={presets} />
    </DashboardShell>
  );
}
