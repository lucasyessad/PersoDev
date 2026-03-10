import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { AgencyMember } from '@/types/database';

export const getAgencyMembers = cache(
  async (agencyId: string): Promise<AgencyMember[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('agency_members')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    return (data || []) as AgencyMember[];
  }
);

export const getAgencyMembersCount = cache(
  async (agencyId: string): Promise<number> => {
    const supabase = await createClient();
    const { count } = await supabase
      .from('agency_members')
      .select('*', { count: 'exact', head: true })
      .eq('agency_id', agencyId)
      .eq('is_active', true);
    return count || 0;
  }
);
