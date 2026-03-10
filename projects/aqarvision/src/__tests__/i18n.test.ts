import { describe, it, expect } from 'vitest';
import { getTranslations, isRtlLocale, getLocaleAttrs } from '@/lib/i18n';

describe('getTranslations', () => {
  it('returns French translations by default', () => {
    const t = getTranslations('fr');
    expect(t('nav.home')).toBe('Accueil');
    expect(t('nav.properties')).toBe('Biens');
  });

  it('returns Arabic translations', () => {
    const t = getTranslations('ar');
    expect(t('nav.home')).toBe('الرئيسية');
  });

  it('interpolates params', () => {
    const t = getTranslations('fr');
    expect(t('about.heading', { name: 'Test' })).toBe('À propos de Test');
  });
});

describe('isRtlLocale', () => {
  it('returns true for Arabic', () => {
    expect(isRtlLocale('ar')).toBe(true);
  });

  it('returns false for French', () => {
    expect(isRtlLocale('fr')).toBe(false);
  });
});

describe('getLocaleAttrs', () => {
  it('returns RTL attrs for Arabic', () => {
    expect(getLocaleAttrs('ar')).toEqual({ dir: 'rtl', lang: 'ar-DZ' });
  });

  it('returns LTR attrs for French', () => {
    expect(getLocaleAttrs('fr')).toEqual({ dir: 'ltr', lang: 'fr-DZ' });
  });
});
