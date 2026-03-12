import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Maximize2, BedDouble, Building2, Sparkles, Eye } from 'lucide-react';
import type { SearchPropertyResult } from '@/types/database';
import { formatPrice, getLocationLabel } from '@/lib/utils/format';
import { TrustBadge } from './trust-badge';
import { ResponsivenessBadge } from './responsiveness-badge';

interface ResultCardProps {
  property: SearchPropertyResult;
  locale?: 'fr' | 'ar' | 'en';
  favoriteButton?: React.ReactNode;
  /** Whether this property has been viewed by the current user */
  isViewed?: boolean;
}

const transactionLabels = {
  fr: { sale: 'Vente', rent: 'Location' },
  ar: { sale: 'بيع', rent: 'إيجار' },
  en: { sale: 'Sale', rent: 'Rent' },
} as const;

const newLabels = {
  fr: 'Nouveau',
  ar: 'جديد',
  en: 'New',
} as const;

const viewedLabels = {
  fr: 'Déjà vu',
  ar: 'تمت المشاهدة',
  en: 'Viewed',
} as const;

function isNewProperty(publishedAt: string | null): boolean {
  if (!publishedAt) return false;
  const published = new Date(publishedAt);
  const now = new Date();
  const diffDays = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export function ResultCard({ property, locale = 'fr', favoriteButton, isViewed = false }: ResultCardProps) {
  const mainImage = property.images?.[0];
  const location = getLocationLabel(property);
  const transactionLabel = transactionLabels[locale][property.transaction_type];
  const isNew = isNewProperty(property.published_at);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={`/bien/${property.property_id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <Building2 className="h-12 w-12" />
            </div>
          )}
          {/* Transaction badge */}
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              property.transaction_type === 'sale'
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {transactionLabel}
          </span>

          {/* Top-right badges stack */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5 items-end">
            {/* Featured badge */}
            {property.is_featured && (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                {locale === 'fr' ? 'En vedette' : locale === 'ar' ? 'مميز' : 'Featured'}
              </span>
            )}
            {/* New badge */}
            {isNew && (
              <span className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Sparkles className="h-2.5 w-2.5" />
                {newLabels[locale]}
              </span>
            )}
            {/* Viewed badge */}
            {isViewed && (
              <span className="flex items-center gap-1 rounded-full bg-gray-600/80 px-2 py-0.5 text-[10px] font-medium text-white">
                <Eye className="h-2.5 w-2.5" />
                {viewedLabels[locale]}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Price + Trust + Responsiveness */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(property.price, property.currency)}
          </span>
          <div className="flex items-center gap-1.5">
            <ResponsivenessBadge level={property.responsiveness_level} locale={locale} />
            <TrustBadge score={property.trust_score} locale={locale} />
          </div>
        </div>

        {/* Title */}
        <Link href={`/bien/${property.property_id}`}>
          <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-900 hover:text-blue-600">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {property.surface && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {property.surface} m²
            </span>
          )}
          {property.rooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.rooms} {locale === 'fr' ? 'pièces' : locale === 'ar' ? 'غرف' : 'rooms'}
            </span>
          )}
        </div>

        {/* Agency + Favorite */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <Link
            href={`/agence/${property.agency_slug}`}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600"
          >
            {property.agency_logo_url ? (
              <Image
                src={property.agency_logo_url}
                alt={property.agency_name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            <span className="line-clamp-1">{property.agency_name}</span>
          </Link>
          {favoriteButton}
        </div>
      </div>
    </div>
  );
}
