import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler for Supabase.
 * Handles both email confirmation and OAuth (Google/Facebook) callbacks.
 * After authentication, creates the agency if it doesn't exist.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') || null;

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

      // Create agency if none exists (works for both email signup and OAuth)
      if (!existing) {
        // Use agency_name from metadata (email signup) or full_name/email from OAuth
        const agencyName =
          (data.user.user_metadata?.agency_name as string) ||
          (data.user.user_metadata?.full_name as string) ||
          (data.user.email?.split('@')[0] || 'Mon Agence');

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

      // Resolve redirect target
      if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }

      // Default: find agency slug and redirect to dashboard
      const { data: agency } = await supabase
        .from('agencies')
        .select('slug')
        .eq('owner_id', data.user.id)
        .single();

      const target = agency?.slug
        ? `/aqarpro/${agency.slug}/dashboard`
        : '/profil';

      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
