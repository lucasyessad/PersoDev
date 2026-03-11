/**
 * URL path helpers for AqarPro dashboard routes.
 *
 * All dashboard pages live under /aqarpro/[slug]/...
 * This helper centralises path construction so a future
 * prefix change only requires editing one file.
 */

const PRO_BASE = '/aqarpro';

/** Build an AqarPro dashboard path. */
export function proPath(slug: string, ...segments: string[]): string {
  const tail = segments.length > 0 ? segments.join('/') : 'dashboard';
  return `${PRO_BASE}/${slug}/${tail}`;
}

/**
 * Route-pattern version for revalidatePath in server actions.
 * Uses Next.js dynamic segment syntax so every slug is revalidated.
 */
export function proPattern(...segments: string[]): string {
  const tail = segments.length > 0 ? segments.join('/') : 'dashboard';
  return `${PRO_BASE}/[slug]/${tail}`;
}
