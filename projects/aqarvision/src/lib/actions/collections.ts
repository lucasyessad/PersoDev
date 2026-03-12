'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { collectionSchema } from '@/lib/validators/collections';

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

const MAX_COLLECTIONS = 20;

/**
 * Create a new favorite collection.
 */
export async function createCollection(name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const result = collectionSchema.safeParse({ name });
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message };
  }

  // Check limit
  const { count } = await supabase
    .from('favorite_collections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((count || 0) >= MAX_COLLECTIONS) {
    return { success: false, error: `Vous ne pouvez pas créer plus de ${MAX_COLLECTIONS} collections.` };
  }

  const { data, error } = await supabase
    .from('favorite_collections')
    .insert({ user_id: user.id, name: result.data.name })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: 'Erreur lors de la création de la collection.' };
  }

  revalidatePath('/espace/collections');
  return { success: true, id: data.id };
}

/**
 * Rename a collection.
 */
export async function renameCollection(id: string, name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const result = collectionSchema.safeParse({ name });
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message };
  }

  const { error } = await supabase
    .from('favorite_collections')
    .update({ name: result.data.name })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Erreur lors du renommage.' };
  }

  revalidatePath('/espace/collections');
  return { success: true };
}

/**
 * Delete a collection (cascade deletes items).
 */
export async function deleteCollection(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const { error } = await supabase
    .from('favorite_collections')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Erreur lors de la suppression.' };
  }

  revalidatePath('/espace/collections');
  return { success: true };
}

/**
 * Add a favorite to a collection.
 */
export async function addToCollection(collectionId: string, favoriteId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const { error } = await supabase
    .from('favorite_collection_items')
    .insert({ collection_id: collectionId, favorite_id: favoriteId });

  if (error) {
    if (error.code === '23505') {
      return { success: true }; // Already in collection
    }
    return { success: false, error: 'Erreur lors de l\'ajout à la collection.' };
  }

  revalidatePath('/espace/collections');
  return { success: true };
}

/**
 * Remove a favorite from a collection.
 */
export async function removeFromCollection(collectionId: string, favoriteId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const { error } = await supabase
    .from('favorite_collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('favorite_id', favoriteId);

  if (error) {
    return { success: false, error: 'Erreur lors de la suppression de la collection.' };
  }

  revalidatePath('/espace/collections');
  return { success: true };
}

/**
 * Get all collections for the current user with item counts.
 */
export async function getCollections(): Promise<{ id: string; name: string; items_count: number; created_at: string }[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: collections } = await supabase
    .from('favorite_collections')
    .select('id, name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!collections || collections.length === 0) return [];

  // Get item counts for each collection
  const collectionIds = collections.map((c) => c.id);
  const { data: items } = await supabase
    .from('favorite_collection_items')
    .select('collection_id')
    .in('collection_id', collectionIds);

  const countMap = new Map<string, number>();
  items?.forEach((item) => {
    countMap.set(item.collection_id, (countMap.get(item.collection_id) || 0) + 1);
  });

  return collections.map((c) => ({
    ...c,
    items_count: countMap.get(c.id) || 0,
  }));
}
