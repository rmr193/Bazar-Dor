/**
 * Helpers for safely reading Next.js dynamic-route `params`.
 *
 * In Next.js 15, `params` for a route like `app/product/[slug]/page.tsx` is typed as:
 *   { slug: string | string[] | undefined }
 *
 * This helper normalizes that to a single `string` so callers can use the value
 * without sprinkling `as string` casts everywhere.
 */
export function getSlugParam(raw: string | string[] | undefined): string {
  if (Array.isArray(raw)) {
    return raw[0] ?? "";
  }
  return raw ?? "";
}
