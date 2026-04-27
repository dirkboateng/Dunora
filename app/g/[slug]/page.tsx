import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { GalleryPasswordGate } from "@/components/galleries/GalleryPasswordGate";

/**
 * Constant-time string equality to avoid leaking password length / mismatch
 * position via response timing. Both inputs are coerced to the same length
 * by always iterating over the longer string.
 */
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `Gallery · ${slug}`,
  };
}

export default async function PublicGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key: providedKey } = await searchParams;
  const supabase = await createClient();

  // Anon-readable lookup. RLS on the galleries table allows public select
  // for visibility='public' and visibility='password'. Private galleries
  // return null and 404 here.
  const galleryRes = await supabase
    .from("galleries")
    .select(
      "id, title, slug, description, visibility, password, workspace_id"
    )
    .eq("slug", slug)
    .maybeSingle();

  const gallery = galleryRes.data as PublicGallery | null;
  if (!gallery || gallery.visibility === "private") notFound();

  // Password gate. Uses a constant-time comparison to avoid leaking the
  // password's character count via response timing. The password itself is
  // still stored plaintext (MVP shortcut, documented). When we migrate to
  // hashed passwords, replace this with a hash compare.
  if (
    gallery.visibility === "password" &&
    gallery.password &&
    !timingSafeEqual(providedKey ?? "", gallery.password)
  ) {
    return (
      <GalleryShell title={gallery.title}>
        <GalleryPasswordGate slug={gallery.slug} />
      </GalleryShell>
    );
  }

  // Workspace branding fetch + view counter bump in parallel — neither
  // depends on the other, and the view bump is fire-and-forget anyway.
  // Migration 006 must be applied for supabase.rpc("increment_gallery_view" as never, { p_slug: gallery.slug } as never), to exist.
  const [wRes] = await Promise.all([
    supabase
      .from("workspaces")
      .select("name, brand_color")
      .eq("id", gallery.workspace_id)
      .maybeSingle(),
    supabase.rpc("increment_gallery_view", { p_slug: gallery.slug }),
  ]);
  const workspace = wRes.data as WorkspaceMini | null;

  return (
    <GalleryShell
      title={gallery.title}
      studio={workspace?.name}
      brandColor={workspace?.brand_color ?? null}
    >
      <div className="max-w-[760px] mx-auto px-6 py-12 md:py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="text-ink-2 max-w-prose mx-auto mb-10">
            {gallery.description}
          </p>
        )}

        <div className="bg-surface border border-line rounded-2xl p-10 mt-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-2xl mb-4">
            ✦
          </div>
          <h2 className="text-lg font-semibold text-ink mb-2">
            Photos are being prepared
          </h2>
          <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
            Your studio is putting the final touches on this gallery.
            You&apos;ll be able to view, favourite and download photos here
            shortly.
          </p>
        </div>

        <p className="text-xs text-muted mt-12">
          Powered by{" "}
          <a
            href="https://dunora.app"
            className="font-semibold text-ink-2 hover:text-ink"
          >
            Dunora
          </a>
        </p>
      </div>
    </GalleryShell>
  );
}

function GalleryShell({
  children,
  studio,
  brandColor,
}: {
  children: React.ReactNode;
  title: string;
  studio?: string;
  brandColor?: string | null;
}) {
  return (
    <div
      className="min-h-screen bg-bg flex flex-col"
      style={brandColor ? { ["--accent" as string]: brandColor } : undefined}
    >
      <header className="border-b border-line bg-surface/60 backdrop-blur">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={28} />
          {studio && (
            <span className="text-sm font-medium text-ink-2">{studio}</span>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
