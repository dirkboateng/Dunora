import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { GalleryPasswordGate } from "@/components/galleries/GalleryPasswordGate";

function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

interface PublicGallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  visibility: string;
  password: string | null;
  workspace_id: string;
}

interface WorkspaceMini {
  name: string;
  brand_color: string | null;
}

function GalleryShell({
  title,
  studio,
  brandColor,
  children,
}: {
  title?: string;
  studio?: string;
  brandColor?: string | null;
  children: React.ReactNode;
}) {
  const tint = brandColor ?? "#047857";
  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-surface border-b border-line">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={26} tint={tint} />
            <span className="text-sm font-semibold text-ink">
              {studio ?? "Dunora"}
            </span>
          </div>
          <span className="text-xs text-muted">
            Powered by{" "}
            <Link href="/" className="text-accent-deep hover:underline">
              Dunora
            </Link>
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {title && (
          <h1 className="text-2xl md:text-4xl font-bold tracking-[-0.6px] text-ink mb-2">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}

export default async function PublicGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pw?: string }>;
}) {
  const { slug } = await params;
  const { pw } = await searchParams;

  const supabase = await createClient();

  const { data: galleryData } = await supabase
    .from("galleries")
    .select("id, title, slug, description, visibility, password, workspace_id")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  const gallery = galleryData as PublicGallery | null;
  if (!gallery) notFound();

  if (gallery.visibility === "private") notFound();

  if (gallery.visibility === "password") {
    const ok =
      typeof pw === "string" &&
      gallery.password !== null &&
      timingSafeEqual(pw, gallery.password);
    if (!ok) {
      return (
        <GalleryShell title={gallery.title}>
          <GalleryPasswordGate slug={slug} hasError={typeof pw === "string"} />
        </GalleryShell>
      );
    }
  }

  const [wRes] = await Promise.all([
    supabase
      .from("workspaces")
      .select("name, brand_color")
      .eq("id", gallery.workspace_id)
      .maybeSingle(),
    supabase.rpc("increment_gallery_view" as never, { p_slug: gallery.slug } as never),
  ]);
  const workspace = wRes.data as WorkspaceMini | null;

  return (
    <GalleryShell
      title={gallery.title}
      studio={workspace?.name}
      brandColor={workspace?.brand_color ?? null}
    >
      {gallery.description && (
        <p className="text-ink-2 text-base leading-relaxed mb-8 max-w-2xl">
          {gallery.description}
        </p>
      )}
      <div className="bg-surface border border-line rounded-2xl p-10 md:p-16 text-center">
        <div className="text-sm font-medium text-ink mb-1.5">
          Photos are being prepared
        </div>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          The photo grid lands in the next release. The gallery itself is live —
          your link is shareable.
        </p>
      </div>
    </GalleryShell>
  );
}
