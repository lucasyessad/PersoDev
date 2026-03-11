'use client';

import { usePathname } from 'next/navigation';

/**
 * Extract the agency slug from the current pathname.
 * Assumes URL pattern: /aqarpro/[slug]/...
 */
export function useSlug(): string {
  const pathname = usePathname();
  const parts = pathname.split('/');
  // /aqarpro/[slug]/... → parts[2] is the slug
  return parts[2] ?? '';
}
