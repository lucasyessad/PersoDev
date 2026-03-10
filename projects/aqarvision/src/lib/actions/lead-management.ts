'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

async function getAgencyForUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Non authentifié' };

  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) return { error: 'Agence introuvable' };

  return { agency, user };
}

export async function updateLeadStatus(
  leadId: string,
  status: string
): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency } = auth as { agency: { id: string } };

  const validStatuses = ['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Statut invalide' };
  }

  const supabase = await createClient();

  const updateData: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'contacted') {
    updateData.contacted_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', leadId)
    .eq('agency_id', agency.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function updateLeadPriority(
  leadId: string,
  priority: string
): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency } = auth as { agency: { id: string } };

  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return { success: false, error: 'Priorité invalide' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('leads')
    .update({
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('agency_id', agency.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function deleteLead(leadId: string): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency } = auth as { agency: { id: string } };

  const supabase = await createClient();

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('agency_id', agency.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la suppression' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}
