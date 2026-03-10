import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler for Supabase email confirmation.
 * After email verification, creates the agency if it doesn't exist.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user already has an agency
      const { data: existing } = await supabase
        .from('agencies')
        .select('id')
        .eq('owner_id', data.user.id)
        .single();

      // Create agency from signup metadata if none exists
      if (!existing && data.user.user_metadata?.agency_name) {
        const agencyName = data.user.user_metadata.agency_name as string;
        const slug = agencyName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        await supabase.from('agencies').insert({
          owner_id: data.user.id,
          name: agencyName,
          slug: `${slug}-${Date.now().toString(36).slice(-4)}`,
          active_plan: 'starter',
          locale: 'fr',
          primary_color: '#2563eb',
        });
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
