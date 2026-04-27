import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PlusIcon } from "@/components/dashboard/Icon";
import { Button } from "@/components/ui/Button";
import { GalleriesListSearch } from "@/components/galleries/GalleriesListSearch";
import type { GalleryListItem } from "@/components/galleries/GalleryCard";

export const metadata = {
  title: "Galleries",
};

export default async function GalleriesPage() {
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const galleriesRes = await supabase
    .from("galleries")
    .select(
      "id, title, slug, description, visibility, view_count, published_at, created_at"
    )
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  const galleries = (galleriesRes.data ?? []) as GalleryListItem[];

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Galleries"
      description="Branded gallery links you can share with clients in one tap."
      actions={
        <Link href="/dashboard/galleries/new">
          <Button size="md">
            <PlusIcon size={16} className="mr-1.5" />
            New gallery
          </Button>
        </Link>
      }
    >
      <GalleriesListSearch galleries={galleries} />
    </DashboardShell>
  );
}
