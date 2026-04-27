"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteGallery } from "@/lib/actions/galleries";
import { Button } from "@/components/ui/Button";

interface GalleryDetailHeaderProps {
  title: string;
  slug: string;
  visibility: string;
  viewCount: number;
  galleryId: string;
}

export function GalleryDetailHeader({
  title,
  slug,
  visibility,
  galleryId,
}: GalleryDetailHeaderProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopyLink() {
    const url = `${window.location.origin}/g/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteGallery(galleryId);
      if (!result.ok) {
        setError(result.error ?? "Could not delete gallery");
        return;
      }
      router.push("/dashboard/galleries");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.6px] text-ink">
            {title}
          </h1>
          <p className="text-ink-2 mt-1.5 text-sm">
            <span className="capitalize">{visibility}</span> gallery
            {visibility !== "private" && (
              <span className="text-muted"> · /g/{slug}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {visibility !== "private" && (
            <>
              <Button variant="secondary" size="md" onClick={handleCopyLink}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
              <Link
                href={`/g/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md">
                  View public ↗
                </Button>
              </Link>
            </>
          )}
          {!confirming ? (
            <Button
              variant="ghost"
              size="md"
              onClick={() => setConfirming(true)}
            >
              Delete
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setConfirming(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDelete}
                loading={pending}
              >
                {pending ? "Deleting…" : "Confirm delete"}
              </Button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-3 bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
    </div>
  );
}
