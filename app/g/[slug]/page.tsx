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

interface GalleryPhotoRow {
  photo_id: string;
  sort_order: number;
}

interface PhotoRow {
  id: string;
  storage_path: string;
  file_name: string;
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

  const galleryRes = await supabase
    .from("galleries")
    .select(
      "id, title, slug, description, visibility, password, workspace_id"
    )
    .eq("slug", slug)
    .maybeSingle();

  const gallery = galleryRes.data as PublicGallery | null;
  if (!gallery || gallery.visibility === "private") notFound();

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

  // Parallel fetch: workspace branding, gallery photos, and view bump
  const [wRes, gpRes] = await Promise.all([
    supabase
      .from("workspaces")
      .select("name, brand_color")
      .eq("id", gallery.workspace_id)
      .maybeSingle(),
    supabase
      .from("gallery_photos")
      .select("photo_id, sort_order")
      .eq("gallery_id", gallery.id)
      .eq("is_hidden", false)
      .order("sort_order", { ascending: true })
      .limit(500),
    supabase.rpc("increment_gallery_view" as never, { p_slug: gallery.slug } as never),
  ]);

  const workspace = wRes.data as WorkspaceMini | null;
  const galleryPhotos = (gpRes.data ?? []) as GalleryPhotoRow[];

  // Fetch the actual photo records for the linked photos
  let photos: PhotoRow[] = [];
  const photoUrls: Record<string, string> = {};
  if (galleryPhotos.length > 0) {
    const photoIds = galleryPhotos.map((gp) => gp.photo_id);
    const { data: photoData } = await supabase
      .from("photos")
      .select("id, storage_path, file_name")
      .in("id", photoIds)
      .is("deleted_at", null);

    photos = (photoData ?? []) as PhotoRow[];

    // Sort photos by sort_order from gallery_photos
    const orderMap = new Map(galleryPhotos.map((gp) => [gp.photo_id, gp.sort_order]));
    photos.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

    // Generate signed URLs (1 hour validity) for all photos in parallel
    if (photos.length > 0) {
      const paths = photos.map((p) => p.storage_path);
      const { data: signedData } = await supabase.storage
        .from("originals")
        .createSignedUrls(paths, 3600);
      if (signedData) {
        signedData.forEach((s, i) => {
          if (s.signedUrl) photoUrls[photos[i].id] = s.signedUrl;
        });
      }
    }
  }

  return (
    <GalleryShell
      title={gallery.title}
      studio={workspace?.name}
      brandColor={workspace?.brand_color ?? null}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink mb-3">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="text-ink-2 max-w-prose mb-10">
            {gallery.description}
          </p>
        )}

        {photos.length === 0 ? (
          <div className="bg-surface border border-line rounded-2xl p-10 mt-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-2xl mb-4">
              ✦
            </div>
            <h2 className="text-lg font-semibold text-ink mb-2">
              Photos are being prepared
            </h2>
            <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
              Your studio is putting the final touches on this gallery.
              You&apos;ll be able to view them here shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-6">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((p) => {
                const url = photoUrls[p.id];
                return (
                  <div
                    key={p.id}
                    className="aspect-[4/5] bg-surface-2 rounded-xl overflow-hidden border border-line group relative"
                    title={p.file_name}
                  >
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={p.file_name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                        Loading…
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className="text-xs text-muted mt-12 text-center">
          Powered by{" "}
          <Link
            href="/"
            className="font-semibold text-ink-2 hover:text-ink"
          >
            Dunora
          </Link>
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
