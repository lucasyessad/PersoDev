import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { SearchPropertyResult } from '@/types/database';

/**
 * Get the user's last search from search_history.
 */
export const getLastSearch = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('search_history')
    .select('id, query_text, filters, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return data;
});

/**
 * Get the user's recently viewed properties with details.
 */
export const getRecentlyViewed = cache(async (limit = 3): Promise<SearchPropertyResult[]> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Get recent viewed property IDs
  const { data: viewed } = await supabase
    .from('viewed_properties')
    .select('property_id')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(limit);

  if (!viewed || viewed.length === 0) return [];

  const propertyIds = viewed.map((v) => v.property_id);

  // Fetch property details
  const { data: properties } = await supabase
    .from('search_properties_view')
    .select('*')
    .in('property_id', propertyIds);

  return (properties as SearchPropertyResult[]) ?? [];
});
