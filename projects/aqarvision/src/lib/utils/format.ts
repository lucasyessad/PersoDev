import { COUNTRIES, getCountryConfig, LOCALE } from '@/config';
import type { CountryConfig } from '@/config';

/** Map currency → locale for Intl.NumberFormat */
const CURRENCY_LOCALE_MAP: Record<string, string> = {};
for (const country of Object.values(COUNTRIES)) {
  if (!CURRENCY_LOCALE_MAP[country.currency]) {
    CURRENCY_LOCALE_MAP[country.currency] = country.locale;
  }
}

/**
 * Formate un prix avec la devise appropriée.
 * Utilise la locale du pays pour l'affichage natif.
 */
export function formatPrice(price: number, currency = 'DZD'): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || LOCALE.LOCALE_FR;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Construit le label de localisation d'un bien.
 * Ex: "Alger, Algérie" ou "Madrid, Espagne" ou "Dubai, ÉAU"
 */
export function getLocationLabel(property: {
  country: string;
  city?: string | null;
  wilaya?: string | null;
  commune?: string | null;
}): string {
  const config = getCountryConfig(property.country);
  const parts: string[] = [];

  if (property.commune) parts.push(property.commune);
  if (property.city) parts.push(property.city);
  if (property.wilaya && property.wilaya !== property.city) parts.push(property.wilaya);

  // Pour les biens hors Algérie, ajouter le nom du pays
  if (property.country !== 'DZ') {
    parts.push(config.name);
  }

  return parts.join(', ') || config.name;
}

/**
 * Retourne le drapeau emoji d'un pays.
 */
export function getCountryFlag(countryCode: string): string {
  return getCountryConfig(countryCode).flag;
}
