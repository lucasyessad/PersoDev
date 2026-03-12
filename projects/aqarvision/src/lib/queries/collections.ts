import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

/**
 * Get a single collection with its favorite items and property details.
 */
export const getCollectionWithFavorites = cache(async (collectionId: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get collection
  const { data: collection } = await supabase
    .from('favorite_collections')
    .select('id, name, created_at')
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single();

  if (!collection) return null;

  // Get items with property details via favorites join
  const { data: items } = await supabase
    .from('favorite_collection_items')
    .select(`
      id,
      favorite_id,
      added_at,
      favorites!inner (
        property_id
      )
    `)
    .eq('collection_id', collectionId);

  const propertyIds = items?.map((item) => {
    const fav = item.favorites as unknown as { property_id: string };
    return fav.property_id;
  }) ?? [];

  // Fetch property details from search view
  let properties: Record<string, unknown>[] = [];
  if (propertyIds.length > 0) {
    const { data } = await supabase
      .from('search_properties_view')
      .select('*')
      .in('property_id', propertyIds);
    properties = data ?? [];
  }

  return {
    ...collection,
    items: items ?? [],
    properties,
  };
});
