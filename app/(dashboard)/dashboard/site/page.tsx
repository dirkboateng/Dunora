import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LandingPhotoSlots } from "@/components/site/LandingPhotoSlots";

export const metadata = {
  title: "Site management",
};

interface LandingPhotoRow {
  id: string;
  slot: number;
  storage_path: string;
  file_name: string;
}

export default async function SitePage() {
  const ctx = await getDashboardContext();

  if (ctx.role !== "owner") {
    redirect("/dashboard");
  }

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
      <div className="space-y-8">
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-ink mb-1">Landing photos</h2>
            <p className="text-sm text-ink-2 leading-relaxed max-w-2xl">
              The 6 photos shown in the preview mock on the landing page. Drop a JPG, PNG or HEIC into each slot. Changes go live immediately.
            </p>
          </div>

          <LandingPhotoSlots
            photos={photos}
            supabaseUrl={supabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
          />
        </section>

        <section className="border-t border-line pt-8">
          <div>
            <h2 className="text-base font-semibold text-ink mb-1">Coming next</h2>
            <p className="text-sm text-muted leading-relaxed">
              Headline, subhead and other landing page texts will become editable here in a future update.
            </p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
