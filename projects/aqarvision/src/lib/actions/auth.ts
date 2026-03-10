'use server';

import { createClient } from '@/lib/supabase/server';

export interface AgencyAuth {
  agency: { id: string; active_plan: string };
  user: { id: string; email: string };
}

export interface AuthError {
  success: false;
  error: string;
}

/**
 * Vérifie que l'utilisateur est propriétaire OU admin de son agence.
 * Utilisé par toutes les server actions qui nécessitent un accès agence.
 */
export async function getAgencyForCurrentUser(): Promise<AgencyAuth | AuthError> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Non authentifié' };
  }

  // D'abord vérifier si l'utilisateur est propriétaire
  const { data: ownedAgency } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (ownedAgency) {
    return {
      agency: { id: ownedAgency.id, active_plan: ownedAgency.active_plan },
      user: { id: user.id, email: user.email || '' },
    };
  }

  // Sinon vérifier si l'utilisateur est membre admin
  const { data: membership } = await supabase
    .from('agency_members')
    .select('agency_id, role')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .in('role', ['admin'])
    .single();

  if (!membership) {
    return { success: false, error: 'Agence introuvable' };
  }

  const { data: memberAgency } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('id', membership.agency_id)
    .single();

  if (!memberAgency) {
    return { success: false, error: 'Agence introuvable' };
  }

  return {
    agency: { id: memberAgency.id, active_plan: memberAgency.active_plan },
    user: { id: user.id, email: user.email || '' },
  };
}

/**
 * Type guard pour différencier une erreur d'auth d'un résultat valide.
 */
export function isAuthError(result: AgencyAuth | AuthError): result is AuthError {
  return 'success' in result && result.success === false;
}
