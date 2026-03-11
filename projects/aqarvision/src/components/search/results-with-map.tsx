'use client';

import { useState } from 'react';
import type { SearchPropertyResult } from '@/types/database';
import { ViewToggle, type ViewMode } from './view-toggle';
import { ResultCard } from './result-card';
import { SearchMap } from './search-map';
import { FavoriteButton } from './favorite-button';

interface ResultsWithMapProps {
  properties: SearchPropertyResult[];
  total: number;
  searchQuery: string;
  isAuthenticated: boolean;
  pagination?: React.ReactNode;
}

export function ResultsWithMap({
  properties,
  total,
  searchQuery,
  isAuthenticated,
  pagination,
}: ResultsWithMapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const propertiesWithLocation = properties.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  return (
    <div>
      {/* Results header: count + view toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-body-sm text-muted-foreground">
          {total.toLocaleString('fr-FR')} bien{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
          {searchQuery && (
            <span className="text-foreground font-medium"> à « {searchQuery} »</span>
          )}
        </p>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* Map view */}
      {viewMode === 'map' && (
        <div className="mb-6">
          {propertiesWithLocation.length > 0 ? (
            <SearchMap properties={propertiesWithLocation} height="520px" />
          ) : (
            <div className="flex h-[520px] items-center justify-center rounded-xl border border-neutral-200 bg-muted/50">
              <p className="text-body-sm text-muted-foreground">
                Aucun bien géolocalisé dans ces résultats
              </p>
            </div>
          )}
          <p className="mt-2 text-caption text-muted-foreground">
            {propertiesWithLocation.length} bien{propertiesWithLocation.length !== 1 ? 's' : ''} affiché{propertiesWithLocation.length !== 1 ? 's' : ''} sur la carte
          </p>
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <ResultCard
                key={property.property_id}
                property={property}
                favoriteButton={
                  <FavoriteButton
                    propertyId={property.property_id}
                    isFavorited={false}
                    isAuthenticated={isAuthenticated}
                  />
                }
              />
            ))}
          </div>
          {pagination}
        </>
      )}
    </div>
  );
}
