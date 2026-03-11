'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { proPattern } from '@/lib/utils/paths';
import type { NotificationType } from '@/types/database';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function markNotificationAsRead(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Erreur lors de la mise à jour' };

  revalidatePath(proPattern('dashboard'));
  return { success: true };
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) return { success: false, error: 'Erreur lors de la mise à jour' };

  revalidatePath(proPattern('dashboard'));
  return { success: true };
}

export async function deleteNotification(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Erreur lors de la suppression' };

  revalidatePath(proPattern('dashboard'));
  return { success: true };
}

/**
 * Crée une notification pour un utilisateur.
 * Utilisé en interne par les autres actions (leads, team, etc.)
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string | null = null,
  agencyId: string | null = null,
  data: Record<string, unknown> = {}
): Promise<void> {
  const supabase = await createClient();
  await supabase.from('notifications').insert({
    user_id: userId,
    agency_id: agencyId,
    type,
    title,
    body,
    data,
    is_read: false,
    created_at: new Date().toISOString(),
  });
}
