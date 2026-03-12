'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { propertyNoteSchema } from '@/lib/validators/notes';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Create or update a personal note on a property.
 * One note per user per property (upsert on unique constraint).
 */
export async function upsertNote(data: { property_id: string; content: string }): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const result = propertyNoteSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message };
  }

  const { error } = await supabase
    .from('property_notes')
    .upsert(
      {
        user_id: user.id,
        property_id: result.data.property_id,
        content: result.data.content,
      },
      { onConflict: 'user_id,property_id' }
    );

  if (error) {
    return { success: false, error: 'Erreur lors de la sauvegarde de la note.' };
  }

  revalidatePath(`/bien/${result.data.property_id}`);
  revalidatePath('/espace/favoris');
  return { success: true };
}

/**
 * Delete a personal note on a property.
 */
export async function deleteNote(propertyId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Vous devez être connecté.' };
  }

  const { error } = await supabase
    .from('property_notes')
    .delete()
    .eq('user_id', user.id)
    .eq('property_id', propertyId);

  if (error) {
    return { success: false, error: 'Erreur lors de la suppression de la note.' };
  }

  revalidatePath(`/bien/${propertyId}`);
  revalidatePath('/espace/favoris');
  return { success: true };
}

/**
 * Get the current user's note for a property.
 */
export async function getNoteForProperty(propertyId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('property_notes')
    .select('content')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single();

  return data?.content ?? null;
}
