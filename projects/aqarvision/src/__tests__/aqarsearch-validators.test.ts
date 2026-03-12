import { describe, it, expect } from 'vitest';
import { propertyNoteSchema } from '@/lib/validators/notes';
import { collectionSchema } from '@/lib/validators/collections';
import { visitRequestSchema } from '@/lib/validators/visit-request';

// ─── Property Note Schema ────────────────────────────────────────

describe('propertyNoteSchema', () => {
  it('accepts valid note data', () => {
    const result = propertyNoteSchema.safeParse({
      property_id: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Belle propriété, à revoir',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = propertyNoteSchema.safeParse({
      property_id: '550e8400-e29b-41d4-a716-446655440000',
      content: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects content over 1000 chars', () => {
    const result = propertyNoteSchema.safeParse({
      property_id: '550e8400-e29b-41d4-a716-446655440000',
      content: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('accepts content at exactly 1000 chars', () => {
    const result = propertyNoteSchema.safeParse({
      property_id: '550e8400-e29b-41d4-a716-446655440000',
      content: 'a'.repeat(1000),
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid property_id', () => {
    const result = propertyNoteSchema.safeParse({
      property_id: 'not-a-uuid',
      content: 'test',
    });
    expect(result.success).toBe(false);
  });
});

// ─── Collection Schema ───────────────────────────────────────────

describe('collectionSchema', () => {
  it('accepts valid collection name', () => {
    const result = collectionSchema.safeParse({ name: 'Appartements Alger' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = collectionSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 chars', () => {
    const result = collectionSchema.safeParse({ name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('accepts name at exactly 100 chars', () => {
    const result = collectionSchema.safeParse({ name: 'a'.repeat(100) });
    expect(result.success).toBe(true);
  });
});

// ─── Visit Request Schema ────────────────────────────────────────

describe('visitRequestSchema', () => {
  const validData = {
    property_id: '550e8400-e29b-41d4-a716-446655440000',
    agency_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Ahmed Benali',
    phone: '0555123456',
  };

  it('accepts valid minimal data', () => {
    const result = visitRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts valid full data', () => {
    const result = visitRequestSchema.safeParse({
      ...validData,
      email: 'ahmed@test.com',
      message: 'Je souhaite visiter ce bien samedi matin.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = visitRequestSchema.safeParse({ ...validData, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects short phone', () => {
    const result = visitRequestSchema.safeParse({ ...validData, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = visitRequestSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('accepts empty email string', () => {
    const result = visitRequestSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(true);
  });

  it('rejects message over 500 chars', () => {
    const result = visitRequestSchema.safeParse({
      ...validData,
      message: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid property_id', () => {
    const result = visitRequestSchema.safeParse({
      ...validData,
      property_id: 'not-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid agency_id', () => {
    const result = visitRequestSchema.safeParse({
      ...validData,
      agency_id: 'not-uuid',
    });
    expect(result.success).toBe(false);
  });
});
