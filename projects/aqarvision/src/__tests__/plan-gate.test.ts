import { describe, it, expect } from 'vitest';
import { createPlanGate, planHasFeature, isPlanAtLeast } from '@/lib/plan-gate';

// ─── createPlanGate ──────────────────────────────────────────────────

describe('createPlanGate', () => {
  describe('starter plan', () => {
    const gate = createPlanGate('starter');

    it('has correct plan id', () => {
      expect(gate.plan).toBe('starter');
    });

    it('allows publishing under limit', () => {
      expect(gate.canPublishProperty(0)).toBe(true);
      expect(gate.canPublishProperty(14)).toBe(true);
    });

    it('blocks publishing at limit', () => {
      expect(gate.canPublishProperty(15)).toBe(false);
      expect(gate.canPublishProperty(20)).toBe(false);
    });

    it('allows leads under limit', () => {
      expect(gate.canReceiveLead(0)).toBe(true);
      expect(gate.canReceiveLead(29)).toBe(true);
    });

    it('blocks leads at limit', () => {
      expect(gate.canReceiveLead(30)).toBe(false);
    });

    it('allows only 1 member', () => {
      expect(gate.canAddMember(0)).toBe(true);
      expect(gate.canAddMember(1)).toBe(false);
    });

    it('has no luxury features', () => {
      expect(gate.hasFeature('luxuryBranding')).toBe(false);
      expect(gate.hasFeature('customDomain')).toBe(false);
      expect(gate.hasFeature('advancedAnalytics')).toBe(false);
      expect(gate.hasFeature('exportLeads')).toBe(false);
      expect(gate.hasFeature('socialIntegration')).toBe(false);
    });

    it('cannot feature properties', () => {
      expect(gate.canFeatureProperty(0)).toBe(false);
    });
  });

  describe('pro plan', () => {
    const gate = createPlanGate('pro');

    it('allows up to 50 properties', () => {
      expect(gate.canPublishProperty(49)).toBe(true);
      expect(gate.canPublishProperty(50)).toBe(false);
    });

    it('allows up to 150 leads per month', () => {
      expect(gate.canReceiveLead(149)).toBe(true);
      expect(gate.canReceiveLead(150)).toBe(false);
    });

    it('allows up to 5 members', () => {
      expect(gate.canAddMember(4)).toBe(true);
      expect(gate.canAddMember(5)).toBe(false);
    });

    it('has export and analytics but not luxury', () => {
      expect(gate.hasFeature('exportLeads')).toBe(true);
      expect(gate.hasFeature('advancedAnalytics')).toBe(true);
      expect(gate.hasFeature('socialIntegration')).toBe(true);
      expect(gate.hasFeature('luxuryBranding')).toBe(false);
      expect(gate.hasFeature('customDomain')).toBe(false);
    });

    it('allows up to 3 featured properties', () => {
      expect(gate.canFeatureProperty(2)).toBe(true);
      expect(gate.canFeatureProperty(3)).toBe(false);
    });
  });

  describe('enterprise plan', () => {
    const gate = createPlanGate('enterprise');

    it('allows unlimited properties', () => {
      expect(gate.canPublishProperty(999_999)).toBe(true);
    });

    it('allows unlimited leads', () => {
      expect(gate.canReceiveLead(999_999)).toBe(true);
    });

    it('allows up to 20 members', () => {
      expect(gate.canAddMember(19)).toBe(true);
      expect(gate.canAddMember(20)).toBe(false);
    });

    it('has all features', () => {
      expect(gate.hasFeature('luxuryBranding')).toBe(true);
      expect(gate.hasFeature('customDomain')).toBe(true);
      expect(gate.hasFeature('advancedAnalytics')).toBe(true);
      expect(gate.hasFeature('exportLeads')).toBe(true);
      expect(gate.hasFeature('socialIntegration')).toBe(true);
    });

    it('allows unlimited featured properties', () => {
      expect(gate.canFeatureProperty(999_999)).toBe(true);
    });
  });

  describe('storage', () => {
    const gate = createPlanGate('starter');

    it('calculates remaining storage', () => {
      const used = 100 * 1024 * 1024; // 100 MB
      const remaining = gate.remainingStorage(used);
      expect(remaining).toBe(400 * 1024 * 1024); // 400 MB
    });

    it('returns 0 when storage exceeded', () => {
      const used = 600 * 1024 * 1024; // 600 MB > 500 MB limit
      expect(gate.remainingStorage(used)).toBe(0);
    });

    it('allows upload within limit', () => {
      const used = 400 * 1024 * 1024;
      const fileSize = 50 * 1024 * 1024;
      expect(gate.canUpload(used, fileSize)).toBe(true);
    });

    it('blocks upload exceeding limit', () => {
      const used = 490 * 1024 * 1024;
      const fileSize = 20 * 1024 * 1024;
      expect(gate.canUpload(used, fileSize)).toBe(false);
    });
  });

  describe('unknown plan fallback', () => {
    it('falls back to starter', () => {
      const gate = createPlanGate('unknown');
      expect(gate.plan).toBe('starter');
      expect(gate.canPublishProperty(15)).toBe(false);
    });
  });
});

// ─── planHasFeature ──────────────────────────────────────────────────

describe('planHasFeature', () => {
  it('returns false for starter luxury', () => {
    expect(planHasFeature('starter', 'luxuryBranding')).toBe(false);
  });

  it('returns true for enterprise luxury', () => {
    expect(planHasFeature('enterprise', 'luxuryBranding')).toBe(true);
  });

  it('returns true for pro exportLeads', () => {
    expect(planHasFeature('pro', 'exportLeads')).toBe(true);
  });
});

// ─── isPlanAtLeast ───────────────────────────────────────────────────

describe('isPlanAtLeast', () => {
  it('starter is at least starter', () => {
    expect(isPlanAtLeast('starter', 'starter')).toBe(true);
  });

  it('starter is NOT at least pro', () => {
    expect(isPlanAtLeast('starter', 'pro')).toBe(false);
  });

  it('pro is at least starter', () => {
    expect(isPlanAtLeast('pro', 'starter')).toBe(true);
  });

  it('pro is at least pro', () => {
    expect(isPlanAtLeast('pro', 'pro')).toBe(true);
  });

  it('pro is NOT at least enterprise', () => {
    expect(isPlanAtLeast('pro', 'enterprise')).toBe(false);
  });

  it('enterprise is at least everything', () => {
    expect(isPlanAtLeast('enterprise', 'starter')).toBe(true);
    expect(isPlanAtLeast('enterprise', 'pro')).toBe(true);
    expect(isPlanAtLeast('enterprise', 'enterprise')).toBe(true);
  });

  it('unknown plan falls back to starter level', () => {
    expect(isPlanAtLeast('unknown', 'starter')).toBe(true);
    expect(isPlanAtLeast('unknown', 'pro')).toBe(false);
  });
});
