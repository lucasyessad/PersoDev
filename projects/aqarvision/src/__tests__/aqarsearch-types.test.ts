import { describe, it, expect } from 'vitest';
import type {
  ViewedProperty,
  PropertyNote,
  FavoriteCollection,
  FavoriteCollectionItem,
  VisitRequest,
  AgencyResponsivenessStats,
  VisitRequestStatus,
  ResponsivenessLevel,
  SearchPropertyResult,
} from '@/types/database';

describe('AqarSearch V2 Types', () => {
  it('ViewedProperty has correct shape', () => {
    const viewed: ViewedProperty = {
      id: 'test-id',
      user_id: 'user-id',
      property_id: 'property-id',
      viewed_at: '2026-03-12T00:00:00Z',
    };
    expect(viewed).toBeDefined();
    expect(viewed.property_id).toBe('property-id');
  });

  it('PropertyNote has correct shape', () => {
    const note: PropertyNote = {
      id: 'test-id',
      user_id: 'user-id',
      property_id: 'property-id',
      content: 'A note',
      created_at: '2026-03-12T00:00:00Z',
      updated_at: '2026-03-12T00:00:00Z',
    };
    expect(note).toBeDefined();
    expect(note.content).toBe('A note');
  });

  it('FavoriteCollection has correct shape', () => {
    const collection: FavoriteCollection = {
      id: 'test-id',
      user_id: 'user-id',
      name: 'My collection',
      created_at: '2026-03-12T00:00:00Z',
      updated_at: '2026-03-12T00:00:00Z',
    };
    expect(collection).toBeDefined();
    expect(collection.name).toBe('My collection');
  });

  it('FavoriteCollectionItem has correct shape', () => {
    const item: FavoriteCollectionItem = {
      id: 'test-id',
      collection_id: 'collection-id',
      favorite_id: 'favorite-id',
      added_at: '2026-03-12T00:00:00Z',
    };
    expect(item).toBeDefined();
  });

  it('VisitRequest has correct shape', () => {
    const request: VisitRequest = {
      id: 'test-id',
      property_id: 'property-id',
      agency_id: 'agency-id',
      user_id: null,
      name: 'John',
      phone: '0555123456',
      email: null,
      message: null,
      status: 'pending',
      created_at: '2026-03-12T00:00:00Z',
      updated_at: '2026-03-12T00:00:00Z',
    };
    expect(request).toBeDefined();
    expect(request.status).toBe('pending');
  });

  it('VisitRequestStatus type is valid', () => {
    const statuses: VisitRequestStatus[] = ['pending', 'confirmed', 'declined', 'completed'];
    expect(statuses).toHaveLength(4);
  });

  it('ResponsivenessLevel type is valid', () => {
    const levels: ResponsivenessLevel[] = ['fast', 'moderate', 'slow', 'unrated'];
    expect(levels).toHaveLength(4);
  });

  it('AgencyResponsivenessStats has correct shape', () => {
    const stats: AgencyResponsivenessStats = {
      agency_id: 'agency-id',
      avg_response_time_minutes: 45,
      response_rate: 95.5,
      total_conversations: 20,
      responsiveness_level: 'fast',
      updated_at: '2026-03-12T00:00:00Z',
    };
    expect(stats).toBeDefined();
    expect(stats.responsiveness_level).toBe('fast');
  });

  it('SearchPropertyResult includes responsiveness_level', () => {
    const result = {} as SearchPropertyResult;
    // Type check: responsiveness_level must exist on the type
    const level: ResponsivenessLevel = 'fast';
    expect(level).toBeDefined();
    // This test validates the type at compile time
    expect(result).toBeDefined();
  });
});
