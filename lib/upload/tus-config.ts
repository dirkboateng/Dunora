/**
 * Constants and helpers for resumable photo uploads via TUS protocol.
 *
 * Reference: https://supabase.com/docs/guides/storage/uploads/resumable-uploads
 *
 * IMPORTANT:
 * - chunkSize MUST be exactly 6 MB. Other values stall uploads server-side.
 * - We use the direct storage hostname for performance.
 * - Each TUS upload URL is valid for 24 hours.
 */

export const TUS_CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB — required by Supabase
export const TUS_RETRY_DELAYS = [0, 3000, 5000, 10000, 20000];

export const ALLOWED_PHOTO_MIME = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
] as const;

export const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200 MB per file
export const MAX_PARALLEL_UPLOADS = 3;

/**
 * Build the resumable upload endpoint URL using the direct storage hostname.
 */
export function getResumableEndpoint(supabaseUrl: string): string {
  try {
    const u = new URL(supabaseUrl);
    const parts = u.hostname.split(".");
    if (
      parts.length >= 3 &&
      parts[parts.length - 2] === "supabase"
    ) {
      parts.splice(1, 0, "storage");
      u.hostname = parts.join(".");
    }
    u.pathname = "/storage/v1/upload/resumable";
    u.search = "";
    return u.toString();
  } catch {
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/upload/resumable`;
  }
}

export function isAllowedMime(mime: string): boolean {
  return (ALLOWED_PHOTO_MIME as readonly string[]).includes(mime);
}

export function isAllowedSize(bytes: number): boolean {
  return bytes > 0 && bytes <= MAX_FILE_BYTES;
}

export function canPreviewMime(mime: string): boolean {
  return mime === "image/jpeg" || mime === "image/png";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
