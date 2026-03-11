import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase avec service_role — bypasse le RLS.
 * À utiliser UNIQUEMENT côté serveur (server actions, route handlers).
 * Ne jamais exposer côté client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
