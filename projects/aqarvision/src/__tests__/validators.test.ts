import { describe, it, expect } from 'vitest';
import { agencyBrandingSchema, agencyLuxuryBrandingSchema } from '@/lib/validators/agency';
import { leadSchema } from '@/lib/validators/lead';

// ─── Agency Branding Schema ────────────────────────────────────────

describe('agencyBrandingSchema', () => {
  it('accepts valid basic branding data', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Immobilière Alger',
      primary_color: '#1a2b3c',
    });
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'A',
      primary_color: '#000000',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid color format', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Test Agency',
      primary_color: 'not-a-color',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields as null', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Test Agency',
      primary_color: '#ff0000',
      slogan: null,
      phone: null,
      email: null,
      website: null,
      address: null,
      wilaya: null,
    });
    expect(result.success).toBe(true);
  });

  it('validates email format when provided', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('validates website URL format when provided', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      website: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('enforces slogan max length of 120', () => {
    const result = agencyBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      slogan: 'a'.repeat(121),
    });
    expect(result.success).toBe(false);
  });
});

// ─── Luxury Branding Schema ────────────────────────────────────────

describe('agencyLuxuryBrandingSchema', () => {
  it('accepts valid luxury branding data', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'Luxury Realty',
      primary_color: '#d4af37',
      secondary_color: '#1a1a1a',
      hero_style: 'video',
      font_style: 'elegant',
      theme_mode: 'dark',
      tagline: 'Excellence immobiliere',
      stats_years: '15',
      stats_properties_sold: '200',
      stats_clients: '500',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // coerce should convert string numbers
      expect(result.data.stats_years).toBe(15);
      expect(result.data.stats_properties_sold).toBe(200);
    }
  });

  it('extends base schema - rejects invalid name', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'X',
      primary_color: '#000000',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid hero_style', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      hero_style: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid font_style', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      font_style: 'comic-sans',
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for hero_style, font_style, theme_mode', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'Test Agency',
      primary_color: '#000000',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hero_style).toBe('cover');
      expect(result.data.font_style).toBe('elegant');
      expect(result.data.theme_mode).toBe('dark');
    }
  });

  it('rejects negative stats values', () => {
    const result = agencyLuxuryBrandingSchema.safeParse({
      name: 'Test',
      primary_color: '#000000',
      stats_years: -5,
    });
    expect(result.success).toBe(false);
  });
});

// ─── Lead Schema ───────────────────────────────────────────────────

describe('leadSchema', () => {
  it('accepts valid lead data', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed Benali',
      phone: '0555123456',
      source: 'contact_form',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid agency_id (not UUID)', () => {
    const result = leadSchema.safeParse({
      agency_id: 'not-a-uuid',
      name: 'Test',
      phone: '0555123456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short name', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'A',
      phone: '0555123456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short phone number', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed',
      phone: '123',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed',
      phone: '0555123456',
      email: null,
      message: null,
      property_id: null,
    });
    expect(result.success).toBe(true);
  });

  it('validates email format when provided', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed',
      phone: '0555123456',
      email: 'bad-email',
    });
    expect(result.success).toBe(false);
  });

  it('defaults source to contact_form', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed',
      phone: '0555123456',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe('contact_form');
    }
  });

  it('accepts all valid source values matching DB CHECK constraint', () => {
    const sources = ['contact_form', 'property_detail', 'whatsapp', 'phone', 'walk_in', 'referral'];
    for (const source of sources) {
      const result = leadSchema.safeParse({
        agency_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Ahmed',
        phone: '0555123456',
        source,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid source value', () => {
    const result = leadSchema.safeParse({
      agency_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed',
      phone: '0555123456',
      source: 'invalid_source',
    });
    expect(result.success).toBe(false);
  });
});
