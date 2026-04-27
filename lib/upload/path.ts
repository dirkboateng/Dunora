/**
 * Path conventions for photo storage.
 *
 * Storage paths follow:
 *   originals/{workspace_id}/{project_id}/{photo_id}.{ext}
 */

const EXT_FROM_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
};

export function extForMime(mime: string): string {
  return EXT_FROM_MIME[mime] ?? "bin";
}

export function buildStoragePath({
  workspaceId,
  projectId,
  photoId,
  mimeType,
}: {
  workspaceId: string;
  projectId: string;
  photoId: string;
  mimeType: string;
}): string {
  const ext = extForMime(mimeType);
  return `${workspaceId}/${projectId}/${photoId}.${ext}`;
}

export function generatePhotoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  throw new Error("crypto.randomUUID unavailable — please update your browser");
}
