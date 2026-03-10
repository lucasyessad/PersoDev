import type { Lead } from '@/types/database';

export interface LeadScore {
  score: number; // 0-100
  level: 'hot' | 'warm' | 'cold';
  factors: string[];
}

/**
 * Calcule un score de qualité pour un lead.
 * Plus le score est élevé, plus le lead est qualifié.
 */
export function calculateLeadScore(lead: Lead): LeadScore {
  let score = 0;
  const factors: string[] = [];

  // 1. Informations de contact complètes (25 pts)
  if (lead.phone) {
    score += 15;
    factors.push('Téléphone fourni');
  }
  if (lead.email) {
    score += 10;
    factors.push('Email fourni');
  }

  // 2. Message détaillé (20 pts)
  if (lead.message) {
    const msgLen = lead.message.length;
    if (msgLen > 100) {
      score += 20;
      factors.push('Message détaillé');
    } else if (msgLen > 30) {
      score += 10;
      factors.push('Message présent');
    } else {
      score += 5;
    }
  }

  // 3. Bien associé (15 pts)
  if (lead.property_id) {
    score += 15;
    factors.push('Bien ciblé');
  }

  // 4. Budget défini (15 pts)
  if (lead.budget_min || lead.budget_max) {
    score += 15;
    factors.push('Budget défini');
  }

  // 5. Critères de recherche (10 pts)
  if (lead.desired_wilaya) {
    score += 5;
    factors.push('Wilaya souhaitée');
  }
  if (lead.desired_type) {
    score += 5;
    factors.push('Type souhaité');
  }

  // 6. Source qualitative (15 pts)
  const sourceScores: Record<string, number> = {
    property_detail: 15,
    whatsapp: 12,
    phone: 10,
    referral: 12,
    contact_form: 8,
    walk_in: 15,
    aqarsearch: 10,
  };
  const sourceScore = sourceScores[lead.source] || 5;
  score += sourceScore;
  if (sourceScore >= 12) {
    factors.push(`Source qualifiée (${lead.source})`);
  }

  // Cap at 100
  score = Math.min(100, score);

  // Determine level
  let level: LeadScore['level'] = 'cold';
  if (score >= 70) level = 'hot';
  else if (score >= 40) level = 'warm';

  return { score, level, factors };
}

export const LEAD_SCORE_COLORS: Record<string, string> = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-orange-100 text-orange-700',
  cold: 'bg-blue-100 text-blue-700',
};

export const LEAD_SCORE_LABELS: Record<string, string> = {
  hot: 'Chaud',
  warm: 'Tiède',
  cold: 'Froid',
};
