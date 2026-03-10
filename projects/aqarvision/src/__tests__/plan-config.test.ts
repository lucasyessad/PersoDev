import { describe, it, expect } from 'vitest';
import {
  PLAN_CONFIGS,
  PLANS,
  TRIAL_DURATION_DAYS,
  getPlanConfig,
  getPlanPrice,
  getBillingDiscount,
  type PlanType,
} from '@/config';

// ─── PLAN_CONFIGS structure ──────────────────────────────────────────

describe('PLAN_CONFIGS', () => {
  it('has all 3 plans', () => {
    expect(Object.keys(PLAN_CONFIGS)).toEqual(['starter', 'pro', 'enterprise']);
  });

  it('all plans have required fields', () => {
    for (const config of Object.values(PLAN_CONFIGS)) {
      expect(config.id).toBeTruthy();
      expect(config.name).toBeTruthy();
      expect(config.description).toBeTruthy();
      expect(config.limits).toBeDefined();
      expect(config.pricing).toBeDefined();
    }
  });

  it('plan limits increase from starter to enterprise', () => {
    const starter = PLAN_CONFIGS.starter.limits;
    const pro = PLAN_CONFIGS.pro.limits;
    const enterprise = PLAN_CONFIGS.enterprise.limits;

    expect(pro.maxProperties).toBeGreaterThan(starter.maxProperties);
    expect(enterprise.maxProperties).toBeGreaterThan(pro.maxProperties);

    expect(pro.maxLeadsPerMonth).toBeGreaterThan(starter.maxLeadsPerMonth);
    expect(enterprise.maxLeadsPerMonth).toBeGreaterThan(pro.maxLeadsPerMonth);

    expect(pro.maxMembers).toBeGreaterThan(starter.maxMembers);
    expect(enterprise.maxMembers).toBeGreaterThan(pro.maxMembers);

    expect(pro.maxStorageBytes).toBeGreaterThan(starter.maxStorageBytes);
    expect(enterprise.maxStorageBytes).toBeGreaterThan(pro.maxStorageBytes);
  });

  it('pricing increases from starter to enterprise', () => {
    const starter = PLAN_CONFIGS.starter.pricing;
    const pro = PLAN_CONFIGS.pro.pricing;
    const enterprise = PLAN_CONFIGS.enterprise.pricing;

    expect(pro.monthlyDZD).toBeGreaterThan(starter.monthlyDZD);
    expect(enterprise.monthlyDZD).toBeGreaterThan(pro.monthlyDZD);
  });

  it('quarterly is cheaper per month than monthly', () => {
    for (const config of Object.values(PLAN_CONFIGS)) {
      const monthlyRate = config.pricing.monthlyDZD;
      const quarterlyPerMonth = config.pricing.quarterlyDZD / 3;
      expect(quarterlyPerMonth).toBeLessThan(monthlyRate);
    }
  });

  it('yearly is cheaper per month than quarterly', () => {
    for (const config of Object.values(PLAN_CONFIGS)) {
      const quarterlyPerMonth = config.pricing.quarterlyDZD / 3;
      const yearlyPerMonth = config.pricing.yearlyDZD / 12;
      expect(yearlyPerMonth).toBeLessThan(quarterlyPerMonth);
    }
  });

  it('enterprise has infinite properties and leads', () => {
    const e = PLAN_CONFIGS.enterprise.limits;
    expect(e.maxProperties).toBe(Infinity);
    expect(e.maxLeadsPerMonth).toBe(Infinity);
  });

  it('only enterprise has luxury branding and custom domain', () => {
    expect(PLAN_CONFIGS.starter.limits.luxuryBranding).toBe(false);
    expect(PLAN_CONFIGS.pro.limits.luxuryBranding).toBe(false);
    expect(PLAN_CONFIGS.enterprise.limits.luxuryBranding).toBe(true);

    expect(PLAN_CONFIGS.starter.limits.customDomain).toBe(false);
    expect(PLAN_CONFIGS.pro.limits.customDomain).toBe(false);
    expect(PLAN_CONFIGS.enterprise.limits.customDomain).toBe(true);
  });

  it('pro and enterprise have export and analytics', () => {
    expect(PLAN_CONFIGS.starter.limits.exportLeads).toBe(false);
    expect(PLAN_CONFIGS.pro.limits.exportLeads).toBe(true);
    expect(PLAN_CONFIGS.enterprise.limits.exportLeads).toBe(true);

    expect(PLAN_CONFIGS.starter.limits.advancedAnalytics).toBe(false);
    expect(PLAN_CONFIGS.pro.limits.advancedAnalytics).toBe(true);
    expect(PLAN_CONFIGS.enterprise.limits.advancedAnalytics).toBe(true);
  });
});

// ─── TRIAL ───────────────────────────────────────────────────────────

describe('TRIAL_DURATION_DAYS', () => {
  it('is 60 days (2 months)', () => {
    expect(TRIAL_DURATION_DAYS).toBe(60);
  });
});

// ─── getPlanConfig ───────────────────────────────────────────────────

describe('getPlanConfig', () => {
  it('returns correct config for each plan', () => {
    expect(getPlanConfig('starter').id).toBe('starter');
    expect(getPlanConfig('pro').id).toBe('pro');
    expect(getPlanConfig('enterprise').id).toBe('enterprise');
  });

  it('falls back to starter for unknown plan', () => {
    expect(getPlanConfig('unknown').id).toBe('starter');
    expect(getPlanConfig('').id).toBe('starter');
  });
});

// ─── getPlanPrice ────────────────────────────────────────────────────

describe('getPlanPrice', () => {
  it('returns monthly price by default', () => {
    expect(getPlanPrice('starter', 'monthly')).toBe(5_000);
    expect(getPlanPrice('pro', 'monthly')).toBe(12_000);
    expect(getPlanPrice('enterprise', 'monthly')).toBe(30_000);
  });

  it('returns quarterly price', () => {
    expect(getPlanPrice('starter', 'quarterly')).toBe(13_500);
  });

  it('returns yearly price', () => {
    expect(getPlanPrice('starter', 'yearly')).toBe(48_000);
  });
});

// ─── getBillingDiscount ──────────────────────────────────────────────

describe('getBillingDiscount', () => {
  it('returns 0 for monthly', () => {
    expect(getBillingDiscount('monthly')).toBe(0);
  });

  it('returns 10 for quarterly', () => {
    expect(getBillingDiscount('quarterly')).toBe(10);
  });

  it('returns 20 for yearly', () => {
    expect(getBillingDiscount('yearly')).toBe(20);
  });
});
