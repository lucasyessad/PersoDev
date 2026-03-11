'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, MapPin, Maximize2, BedDouble, Bath } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type PropertyCardVariant = 'default' | 'featured' | 'horizontal' | 'compact' | 'mini-site';

interface PropertyCardData {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  city?: string;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  transactionType?: 'sale' | 'rent';
  status?: 'active' | 'draft' | 'sold' | 'rented' | 'archived';
  featured?: boolean;
  isFavorited?: boolean;
  agency?: {
    name: string;
    logo?: string;
  };
  className?: string;
}

interface PropertyCardProps extends PropertyCardData {
  variant?: PropertyCardVariant;
  onFavoriteToggle?: (id: string, current: boolean) => void;
  href?: string;
}

function formatPrice(price: number, currency = 'MAD'): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)} M ${currency}`;
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(0)} K ${currency}`;
  }
  return `${price.toLocaleString('fr-FR')} ${currency}`;
}

/* ─── Image Carousel ─────────────────────────────── */

function ImageCarousel({
  images,
  title,
  aspectClass,
}: {
  images: string[];
  title: string;
  aspectClass: string;
}) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
    },
    [images.length]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrent(i => (i === images.length - 1 ? 0 : i + 1));
    },
    [images.length]
  );

  const visibleImages = images.slice(0, 5);

  return (
    <div className={['relative overflow-hidden rounded-lg group/carousel', aspectClass].join(' ')}>
      {/* Images */}
      {visibleImages.map((src, i) => (
        <div
          key={i}
          className={[
            'absolute inset-0 transition-opacity duration-300',
            i === current ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <Image
            src={src}
            alt={i === 0 ? title : `${title} — photo ${i + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={i === 0}
            loading={i === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}

      {/* Arrow buttons — show on hover, desktop only */}
      {visibleImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 hover:shadow-md z-10"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="h-4 w-4 text-neutral-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 hover:shadow-md z-10"
            aria-label="Photo suivante"
          >
            <ChevronRight className="h-4 w-4 text-neutral-700" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {visibleImages.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setCurrent(i); }}
                className={[
                  'w-1.5 h-1.5 rounded-full transition-opacity duration-150',
                  i === current ? 'bg-white opacity-100' : 'bg-white opacity-50',
                ].join(' ')}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-2 right-2 text-caption text-white/80 z-10">
            {current + 1}/{visibleImages.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Property Card ──────────────────────────────── */

export function PropertyCard({
  id,
  title,
  price,
  currency = 'MAD',
  location,
  city,
  surface,
  bedrooms,
  bathrooms,
  images,
  transactionType = 'sale',
  status,
  featured,
  isFavorited = false,
  agency,
  variant = 'default',
  onFavoriteToggle,
  href,
  className = '',
}: PropertyCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [bouncing, setBouncing]   = useState(false);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const next = !favorited;
      setFavorited(next);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 300);
      onFavoriteToggle?.(id, next);
    },
    [favorited, id, onFavoriteToggle]
  );

  const cardHref = href ?? `/bien/${id}`;

  /* ── Aspect ratio by variant ── */
  const aspectClass =
    variant === 'featured'    ? 'aspect-[3/2]' :
    variant === 'horizontal'  ? 'aspect-[1/1]' :
    variant === 'compact'     ? 'aspect-[3/2]' :
                                'aspect-[4/3]';

  /* ── Status badge ── */
  const statusBadge =
    status === 'sold'     ? <Badge variant="error">Vendu</Badge> :
    status === 'rented'   ? <Badge variant="error">Loué</Badge> :
    status === 'draft'    ? <Badge variant="default">Brouillon</Badge> :
    featured              ? <Badge variant="premium">À la une</Badge> :
    null;

  /* ── Transaction type badge ── */
  const txBadge = (
    <Badge variant={transactionType === 'sale' ? 'primary' : 'success'}>
      {transactionType === 'sale' ? 'Vente' : 'Location'}
    </Badge>
  );

  /* ── Property specs ── */
  const specs = [
    bedrooms  != null && `${bedrooms} ch.`,
    bathrooms != null && `${bathrooms} sdb`,
    surface   != null && `${surface} m²`,
  ].filter(Boolean).join(' · ');

  /* ── Horizontal variant ── */
  if (variant === 'horizontal') {
    return (
      <Link
        href={cardHref}
        className={[
          'group flex rounded-lg border border-neutral-200 overflow-hidden bg-white',
          'shadow-card hover:shadow-card-hover transition-shadow duration-300',
          className,
        ].join(' ')}
      >
        <div className="w-[40%] shrink-0 relative">
          <ImageCarousel images={images} title={title} aspectClass="h-full" />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between gap-2">
          <div className="flex gap-2">
            {txBadge}
            {statusBadge}
          </div>
          <div>
            <p className="font-mono text-price-sm text-neutral-900">{formatPrice(price, currency)}</p>
            <h3 className="text-heading-sm text-neutral-900 mt-1 line-clamp-2">{title}</h3>
            <p className="flex items-center gap-1 text-body-sm text-neutral-500 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </p>
          </div>
          {specs && <p className="text-body-sm text-neutral-500">{specs}</p>}
          {agency && (
            <p className="text-caption text-neutral-400">{agency.name}</p>
          )}
        </div>
      </Link>
    );
  }

  /* ── Compact variant (dashboard) ── */
  if (variant === 'compact') {
    return (
      <Link
        href={cardHref}
        className={[
          'group flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors',
          className,
        ].join(' ')}
      >
        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 relative">
          {images[0] && (
            <Image src={images[0]} alt={title} fill className="object-cover" sizes="48px" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-price-sm text-neutral-900">{formatPrice(price, currency)}</p>
          <p className="text-body-sm text-neutral-700 truncate">{title}</p>
          <p className="text-caption text-neutral-500">{location}</p>
        </div>
        {statusBadge}
      </Link>
    );
  }

  /* ── Default / Featured / Mini-site variants ── */
  const isMiniSite = variant === 'mini-site';

  return (
    <Link
      href={cardHref}
      className={[
        'group relative flex flex-col bg-white rounded-lg overflow-hidden',
        isMiniSite
          ? 'border-0'
          : 'border border-neutral-200 shadow-card hover:shadow-card-hover',
        'transition-shadow duration-300',
        className,
      ].join(' ')}
    >
      {/* Image carousel */}
      <div className="relative">
        <ImageCarousel images={images} title={title} aspectClass={aspectClass} />

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={[
              'h-4 w-4 transition-colors',
              bouncing ? 'animate-heart-bounce' : '',
              favorited ? 'fill-error-600 stroke-error-600' : 'stroke-neutral-700',
            ].join(' ')}
          />
        </button>

        {/* Badges overlay top-left */}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {txBadge}
          {statusBadge}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4">
        {/* Price */}
        <p className={['font-mono text-neutral-900', isMiniSite ? 'text-price text-accent-600' : 'text-price-sm'].join(' ')}>
          {formatPrice(price, currency)}
        </p>

        {/* Title */}
        <h3 className={['text-neutral-900 line-clamp-2', isMiniSite ? 'text-heading-md' : 'text-heading-sm'].join(' ')}>
          {title}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-body-sm text-neutral-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {city ? `${location}, ${city}` : location}
        </p>

        {/* Specs */}
        {specs && (
          <div className="flex items-center gap-3 text-body-sm text-neutral-500 pt-0.5">
            {bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {bedrooms} ch.
              </span>
            )}
            {bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {bathrooms} sdb
              </span>
            )}
            {surface != null && (
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                {surface} m²
              </span>
            )}
          </div>
        )}

        {/* Agency */}
        {agency && (
          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-neutral-100">
            {agency.logo && (
              <div className="w-5 h-5 rounded relative overflow-hidden shrink-0">
                <Image src={agency.logo} alt={agency.name} fill className="object-contain" sizes="20px" />
              </div>
            )}
            <p className="text-caption text-neutral-400">{agency.name}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Property Grid ──────────────────────────────── */

export function PropertyGrid({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'grid gap-6',
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
