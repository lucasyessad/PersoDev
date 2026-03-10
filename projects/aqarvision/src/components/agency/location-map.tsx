'use client';

import { useEffect, useRef } from 'react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  label?: string;
  className?: string;
  zoom?: number;
}

/**
 * Carte OpenStreetMap légère sans dépendance externe (Leaflet).
 * Utilise une iframe OpenStreetMap embed pour zéro bundle JS supplémentaire.
 * Si Leaflet est installé ultérieurement, ce composant peut être remplacé
 * par un composant react-leaflet plus interactif.
 */
export function LocationMap({
  latitude,
  longitude,
  label,
  className = 'h-64 w-full rounded-lg overflow-hidden',
  zoom = 15,
}: LocationMapProps) {
  const markerLabel = encodeURIComponent(label || 'Emplacement');

  return (
    <div className={className}>
      <iframe
        title={`Carte — ${label || 'Emplacement'}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005},${latitude - 0.003},${longitude + 0.005},${latitude + 0.003}&layer=mapnik&marker=${latitude},${longitude}`}
      />
    </div>
  );
}

/**
 * Wrapper conditionnel : n'affiche la carte que si les coordonnées existent.
 */
export function ConditionalMap({
  latitude,
  longitude,
  label,
  className,
  zoom,
}: {
  latitude: number | null;
  longitude: number | null;
  label?: string;
  className?: string;
  zoom?: number;
}) {
  if (latitude == null || longitude == null) return null;

  return (
    <LocationMap
      latitude={latitude}
      longitude={longitude}
      label={label}
      className={className}
      zoom={zoom}
    />
  );
}
