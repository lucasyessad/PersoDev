import Link from 'next/link';
import Image from 'next/image';
import { History, ArrowRight, Eye, Building2 } from 'lucide-react';
import { getLastSearch, getRecentlyViewed } from '@/lib/queries/search-resume';
import { formatPrice } from '@/lib/utils/format';

/**
 * Banner shown on /recherche when user is authenticated and no filters are active.
 * Shows last search + recently viewed properties.
 */
export async function SearchResumeBanner() {
  const [lastSearch, recentlyViewed] = await Promise.all([
    getLastSearch(),
    getRecentlyViewed(3),
  ]);

  if (!lastSearch && recentlyViewed.length === 0) return null;

  // Build search URL from last search filters
  const buildSearchUrl = (filters: Record<string, unknown>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    return `/recherche?${params.toString()}`;
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Last search */}
      {lastSearch && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <History className="h-4 w-4" />
              <span className="font-medium">Reprendre votre dernière recherche</span>
            </div>
            <Link
              href={buildSearchUrl(lastSearch.filters as Record<string, unknown>)}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Reprendre
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {lastSearch.query_text && (
            <p className="mt-1 text-xs text-blue-600">
              &laquo; {lastSearch.query_text} &raquo;
            </p>
          )}
        </div>
      )}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Eye className="h-4 w-4" />
            Derniers biens consultés
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {recentlyViewed.map((property) => (
              <Link
                key={property.property_id}
                href={`/bien/${property.property_id}`}
                className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Building2 className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {property.title}
                  </p>
                  <p className="text-xs text-gray-500">{property.wilaya}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatPrice(property.price, property.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
