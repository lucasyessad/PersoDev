'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getPlanPrice, type PlanType } from '@/config';
import { revalidatePath } from 'next/cache';
import { proPattern } from '@/lib/utils/paths';

const VALID_PLANS    = ['starter', 'pro', 'enterprise'] as const;
const VALID_CYCLES   = ['monthly', 'quarterly', 'yearly'] as const;
const VALID_PAYMENTS = ['ccp', 'baridi_mob', 'virement', 'cash', 'dahabia'] as const;

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const plan    = formData.get('plan')    as string;
  const cycle   = formData.get('cycle')   as string;
  const payment = formData.get('payment') as string;
  const ref     = (formData.get('reference') as string)?.trim() || null;

  if (!VALID_PLANS.includes(plan as any))    return { success: false, error: 'Plan invalide' };
  if (!VALID_CYCLES.includes(cycle as any))  return { success: false, error: 'Cycle invalide' };
  if (!VALID_PAYMENTS.includes(payment as any)) return { success: false, error: 'Méthode de paiement invalide' };

  // Récupérer l'agence
  const { data: agency } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) return { success: false, error: 'Agence introuvable' };

  const priceDZD = getPlanPrice(plan, cycle as any);

  // Calculer la durée
  const startsAt = new Date();
  const endsAt   = new Date(startsAt);
  if (cycle === 'monthly')   endsAt.setMonth(endsAt.getMonth() + 1);
  if (cycle === 'quarterly') endsAt.setMonth(endsAt.getMonth() + 3);
  if (cycle === 'yearly')    endsAt.setFullYear(endsAt.getFullYear() + 1);

  const admin = createAdminClient();

  // Désactiver l'ancienne subscription active
  await admin
    .from('subscriptions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('agency_id', agency.id)
    .in('status', ['active', 'trial']);

  // Créer la nouvelle subscription
  const { error: subError } = await admin
    .from('subscriptions')
    .insert({
      agency_id:         agency.id,
      plan,
      status:            'active',
      price_dzd:         priceDZD,
      billing_cycle:     cycle,
      payment_method:    payment,
      payment_reference: ref,
      starts_at:         startsAt.toISOString(),
      ends_at:           endsAt.toISOString(),
    });

  if (subError) return { success: false, error: subError.message };

  // Mettre à jour le plan de l'agence
  await admin
    .from('agencies')
    .update({ active_plan: plan })
    .eq('id', agency.id);

  revalidatePath(proPattern('settings/billing'));
  return { success: true };
}
