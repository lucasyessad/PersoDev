import { z } from 'zod';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/config';

const supportedCountryCodes = Object.keys(COUNTRIES);
const supportedCurrencies = [...new Set(Object.values(COUNTRIES).map((c) => c.currency))];

export const propertySchema = z.object({
  title: z.string().min(3, 'Le titre doit faire au moins 3 caractères').max(200),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().min(0, 'Le prix doit être positif'),
  surface: z.number().min(0).optional().nullable(),
  rooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().int().min(0).optional().nullable(),
  type: z.string().min(1, 'Le type de bien est requis'),
  transaction_type: z.enum(['sale', 'rent']).default('sale'),
  status: z.enum(['draft', 'active', 'sold', 'rented', 'archived']).default('draft'),

  // Localisation
  country: z
    .string()
    .length(2, 'Code pays ISO à 2 lettres requis')
    .transform((v) => v.toUpperCase())
    .refine((v) => supportedCountryCodes.includes(v), 'Pays non supporté')
    .default(DEFAULT_COUNTRY),
  city: z.string().max(100).optional().nullable(),
  wilaya: z.string().max(100).optional().nullable(),
  commune: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  currency: z
    .string()
    .length(3, 'Code devise ISO à 3 lettres requis')
    .transform((v) => v.toUpperCase())
    .refine((v) => supportedCurrencies.includes(v), 'Devise non supportée')
    .default('DZD'),

  // Coordonnées
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),

  // Médias
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),

  is_featured: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertySchema>;
