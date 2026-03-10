'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { leadSchema } from '@/lib/validators/lead';
import { createPlanGate } from '@/lib/plan-gate';
import { createNotification } from './notifications';
import { RATE_LIMIT } from '@/config';

interface ActionResult {
  success: boolean;
  error?: string;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT.MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, RATE_LIMIT.WINDOW_MS);
}

export async function createLead(formData: Record<string, unknown>): Promise<ActionResult> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(`lead:${ip}`)) {
    return { success: false, error: 'Trop de requêtes. Veuillez réessayer dans une minute.' };
  }

  const result = leadSchema.safeParse(formData);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: firstError?.message || 'Données invalides' };
  }

  const supabase = await createClient();

  // Vérifier que l'agence existe et récupérer son plan
  const { data: agency, error: agencyError } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('id', result.data.agency_id)
    .single();

  if (agencyError || !agency) {
    return { success: false, error: 'Agence introuvable' };
  }

  // Vérifier la limite de leads mensuelle du plan
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyLeadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('agency_id', agency.id)
    .gte('created_at', startOfMonth.toISOString());

  const gate = createPlanGate(agency.active_plan);
  if (!gate.canReceiveLead(monthlyLeadCount || 0)) {
    return { success: false, error: 'Cette agence ne peut plus recevoir de messages ce mois-ci.' };
  }

  const { error } = await supabase.from('leads').insert({
    ...result.data,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: 'Erreur lors de l\'envoi du message' };
  }

  // Notification au propriétaire de l'agence
  const { data: agencyOwner } = await supabase
    .from('agencies')
    .select('owner_id')
    .eq('id', agency.id)
    .single();

  if (agencyOwner) {
    await createNotification(
      agencyOwner.owner_id,
      'new_lead',
      `Nouveau lead : ${result.data.name}`,
      result.data.message?.slice(0, 100) || null,
      agency.id,
      { leadName: result.data.name, source: result.data.source }
    );
  }

  return { success: true };
}
