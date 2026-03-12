'use server';

import { createClient } from '@/lib/supabase/server';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Track that the current user viewed a property.
 * Upserts into viewed_properties (updates viewed_at on conflict).
 * Silent if not authenticated.
 */
export async function trackPropertyView(propertyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: true }; // Silent for unauthenticated users
  }

  const { error } = await supabase
    .from('viewed_properties')
    .upsert(
      { user_id: user.id, property_id: propertyId, viewed_at: new Date().toISOString() },
      { onConflict: 'user_id,property_id' }
    );

  if (error) {
    return { success: false, error: 'Erreur lors du suivi de la vue.' };
  }

  return { success: true };
}

/**
 * Returns list of property IDs the current user has viewed.
 */
export async function getViewedPropertyIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from('viewed_properties')
    .select('property_id')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(200);

  return data?.map((v) => v.property_id) ?? [];
}
