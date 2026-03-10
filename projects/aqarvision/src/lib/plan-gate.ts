/**
 * Plan gating — vérifie les droits d'une agence selon son plan.
 *
 * Usage:
 *   const gate = createPlanGate(agency.active_plan);
 *   if (!gate.canPublishProperty(currentCount)) { ... }
 *   if (!gate.hasFeature('luxuryBranding')) { ... }
 */

import { getPlanConfig, type PlanType, type PlanLimits } from '@/config';

export interface PlanGate {
  plan: PlanType;
  limits: PlanLimits;

  /** Vérifie si une feature booléenne est accessible */
  hasFeature(feature: keyof Pick<
    PlanLimits,
    'luxuryBranding' | 'customDomain' | 'advancedAnalytics' | 'exportLeads' | 'socialIntegration'
  >): boolean;

  /** Peut publier un nouveau bien ? (count = nombre actuel publié) */
  canPublishProperty(currentCount: number): boolean;

  /** Peut recevoir un nouveau lead ce mois ? (count = leads reçus ce mois) */
  canReceiveLead(currentMonthCount: number): boolean;

  /** Peut ajouter un nouveau membre ? (count = membres actuels) */
  canAddMember(currentCount: number): boolean;

  /** Peut mettre en avant un bien ? (count = biens featured actuels) */
  canFeatureProperty(currentFeaturedCount: number): boolean;

  /** Stockage restant en octets (used = octets utilisés) */
  remainingStorage(usedBytes: number): number;

  /** Vérifie si le stockage est suffisant pour un upload */
  canUpload(usedBytes: number, fileSize: number): boolean;
}

/**
 * Crée un objet de gating pour un plan donné.
 */
export function createPlanGate(plan: string): PlanGate {
  const config = getPlanConfig(plan);
  const limits = config.limits;

  return {
    plan: config.id,
    limits,

    hasFeature(feature) {
      return !!limits[feature];
    },

    canPublishProperty(currentCount: number): boolean {
      return currentCount < limits.maxProperties;
    },

    canReceiveLead(currentMonthCount: number): boolean {
      return currentMonthCount < limits.maxLeadsPerMonth;
    },

    canAddMember(currentCount: number): boolean {
      return currentCount < limits.maxMembers;
    },

    canFeatureProperty(currentFeaturedCount: number): boolean {
      return currentFeaturedCount < limits.featuredProperties;
    },

    remainingStorage(usedBytes: number): number {
      return Math.max(0, limits.maxStorageBytes - usedBytes);
    },

    canUpload(usedBytes: number, fileSize: number): boolean {
      return (usedBytes + fileSize) <= limits.maxStorageBytes;
    },
  };
}

/**
 * Comparaison rapide : le plan a-t-il accès à une feature ?
 * Utile pour les vérifications inline sans créer un objet gate.
 */
export function planHasFeature(
  plan: string,
  feature: keyof Pick<
    PlanLimits,
    'luxuryBranding' | 'customDomain' | 'advancedAnalytics' | 'exportLeads' | 'socialIntegration'
  >,
): boolean {
  return !!getPlanConfig(plan).limits[feature];
}

/**
 * Vérifie si un plan est supérieur ou égal à un autre.
 * Utile pour les upgrades et les comparaisons.
 */
const PLAN_ORDER: Record<PlanType, number> = {
  starter: 0,
  pro: 1,
  enterprise: 2,
};

export function isPlanAtLeast(currentPlan: string, requiredPlan: PlanType): boolean {
  const current = PLAN_ORDER[currentPlan as PlanType] ?? 0;
  const required = PLAN_ORDER[requiredPlan] ?? 0;
  return current >= required;
}
