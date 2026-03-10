import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Subscription } from '@/types/database';

export const getActiveSubscription = cache(
  async (agencyId: string): Promise<Subscription | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('agency_id', agencyId)
      .in('status', ['active', 'trial', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data as Subscription | null;
  }
);

export const getSubscriptionHistory = cache(
  async (agencyId: string): Promise<Subscription[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });
    return (data || []) as Subscription[];
  }
);
