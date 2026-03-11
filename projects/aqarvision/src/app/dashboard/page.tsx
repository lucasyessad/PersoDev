import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Legacy /dashboard redirect.
 * Resolves the user's agency slug and redirects to /aqarpro/[slug]/dashboard.
 */
export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('slug')
    .eq('owner_id', user.id)
    .single();

  if (agency?.slug) {
    redirect(`/aqarpro/${agency.slug}/dashboard`);
  }

  // No agency — send to profile
  redirect('/profil');
}
