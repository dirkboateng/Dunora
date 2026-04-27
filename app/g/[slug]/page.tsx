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
  const tint = brandColor ?? "#0478
