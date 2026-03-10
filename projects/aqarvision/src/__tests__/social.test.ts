import { describe, it, expect } from 'vitest';
import {
  extractInstagramUsername,
  extractFacebookPageId,
  extractTikTokUsername,
  getOEmbedData,
} from '@/lib/social/fetch-feed';

describe('extractInstagramUsername', () => {
  it('extracts username from standard URL', () => {
    expect(extractInstagramUsername('https://instagram.com/luxury_realty')).toBe('luxury_realty');
  });

  it('extracts username with trailing slash', () => {
    expect(extractInstagramUsername('https://www.instagram.com/agency123/')).toBe('agency123');
  });

  it('returns null for invalid URL', () => {
    expect(extractInstagramUsername('https://example.com')).toBeNull();
  });
});

describe('extractFacebookPageId', () => {
  it('extracts page name from URL', () => {
    expect(extractFacebookPageId('https://facebook.com/myagency')).toBe('myagency');
  });

  it('extracts profile ID from profile.php URL', () => {
    expect(extractFacebookPageId('https://facebook.com/profile.php?id=123456789')).toBe('123456789');
  });

  it('returns null for invalid URL', () => {
    expect(extractFacebookPageId('https://example.com')).toBeNull();
  });
});

describe('extractTikTokUsername', () => {
  it('extracts username with @ prefix', () => {
    expect(extractTikTokUsername('https://tiktok.com/@agency_dz')).toBe('agency_dz');
  });

  it('returns null for missing @', () => {
    expect(extractTikTokUsername('https://tiktok.com/agency')).toBeNull();
  });
});

describe('getOEmbedData', () => {
  it('returns empty array when no URLs provided', () => {
    expect(getOEmbedData(null, null, null)).toEqual([]);
  });

  it('returns embed for Instagram URL', () => {
    const result = getOEmbedData('https://instagram.com/test', null, null);
    expect(result).toHaveLength(1);
    expect(result[0].platform).toBe('instagram');
    expect(result[0].embedUrl).toContain('embed');
  });

  it('returns embeds for all platforms', () => {
    const result = getOEmbedData(
      'https://instagram.com/test',
      'https://facebook.com/test',
      'https://tiktok.com/@test'
    );
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.platform)).toEqual(['instagram', 'facebook', 'tiktok']);
  });
});
