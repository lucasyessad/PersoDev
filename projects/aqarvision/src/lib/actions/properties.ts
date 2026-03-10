'use server';

import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validators/property';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Vérifie que l'utilisateur est propriétaire/admin de l'agence.
 */
async function getAgencyForUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Non authentifié' };

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) return { error: 'Agence introuvable' };

  return { agency, user };
}

export async function createProperty(
  formData: Record<string, unknown>
): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency, user } = auth as { agency: { id: string; active_plan: string }; user: { id: string } };

  const result = propertySchema.safeParse(formData);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: firstError?.message || 'Données invalides' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...result.data,
      agency_id: agency.id,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: 'Erreur lors de la création du bien' };
  }

  revalidatePath('/dashboard/properties');
  return { success: true, id: data.id };
}

export async function updateProperty(
  propertyId: string,
  formData: Record<string, unknown>
): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency } = auth as { agency: { id: string; active_plan: string } };

  const result = propertySchema.safeParse(formData);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: firstError?.message || 'Données invalides' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('properties')
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .eq('agency_id', agency.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }

  revalidatePath('/dashboard/properties');
  return { success: true };
}

export async function deleteProperty(propertyId: string): Promise<ActionResult> {
  const auth = await getAgencyForUser();
  if ('error' in auth && !('agency' in auth)) {
    return { success: false, error: auth.error };
  }
  const { agency } = auth as { agency: { id: string; active_plan: string } };

  const supabase = await createClient();

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('agency_id', agency.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la suppression' };
  }

  revalidatePath('/dashboard/properties');
  return { success: true };
}
