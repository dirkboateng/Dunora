/**
 * Convert a free-form string into a URL-safe slug.
 * Mirrors the SQL generate_slug() function in migration 001.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Add a short random suffix to keep slugs unique without DB roundtrips.
 * Format: "my-project-x4k9"
 */
export function slugifyWithSuffix(input: string): string {
  const base = slugify(input) || "untitled";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
