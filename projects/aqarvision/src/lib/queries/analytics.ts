import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export interface AnalyticsSummary {
  totalViews: number;
  totalLeads: number;
  totalProperties: number;
  conversionRate: number;
  viewsThisMonth: number;
  leadsThisMonth: number;
  viewsLastMonth: number;
  leadsLastMonth: number;
}

export interface TopProperty {
  id: string;
  title: string;
  views_count: number;
  status: string;
  leadCount: number;
}

export interface DailyStats {
  date: string;
  views: number;
  leads: number;
}

export const getAnalyticsSummary = cache(
  async (agencyId: string): Promise<AnalyticsSummary> => {
    const supabase = await createClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [viewsTotal, leadsTotal, propertiesTotal, viewsMonth, leadsMonth, viewsLast, leadsLast] = await Promise.all([
      supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId),
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId),
      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId),
      supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .gte('viewed_at', startOfMonth),
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .gte('created_at', startOfMonth),
      supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .gte('viewed_at', startOfLastMonth)
        .lte('viewed_at', endOfLastMonth),
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth),
    ]);

    const tv = viewsTotal.count || 0;
    const tl = leadsTotal.count || 0;

    return {
      totalViews: tv,
      totalLeads: tl,
      totalProperties: propertiesTotal.count || 0,
      conversionRate: tv > 0 ? Math.round((tl / tv) * 100 * 10) / 10 : 0,
      viewsThisMonth: viewsMonth.count || 0,
      leadsThisMonth: leadsMonth.count || 0,
      viewsLastMonth: viewsLast.count || 0,
      leadsLastMonth: leadsLast.count || 0,
    };
  }
);

export const getTopProperties = cache(
  async (agencyId: string, limit = 5): Promise<TopProperty[]> => {
    const supabase = await createClient();
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, views_count, status')
      .eq('agency_id', agencyId)
      .order('views_count', { ascending: false })
      .limit(limit);

    if (!properties || properties.length === 0) return [];

    const propertyIds = properties.map((p) => p.id);
    const { data: leadCounts } = await supabase
      .from('leads')
      .select('property_id')
      .eq('agency_id', agencyId)
      .in('property_id', propertyIds);

    const leadCountMap = new Map<string, number>();
    (leadCounts || []).forEach((l: { property_id: string | null }) => {
      if (l.property_id) {
        leadCountMap.set(l.property_id, (leadCountMap.get(l.property_id) || 0) + 1);
      }
    });

    return properties.map((p) => ({
      ...p,
      leadCount: leadCountMap.get(p.id) || 0,
    }));
  }
);

export const getLeadsBySource = cache(
  async (agencyId: string): Promise<Record<string, number>> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('leads')
      .select('source')
      .eq('agency_id', agencyId);

    const counts: Record<string, number> = {};
    (data || []).forEach((lead: { source: string }) => {
      counts[lead.source] = (counts[lead.source] || 0) + 1;
    });
    return counts;
  }
);

export const getLeadsByStatus = cache(
  async (agencyId: string): Promise<Record<string, number>> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('leads')
      .select('status')
      .eq('agency_id', agencyId);

    const counts: Record<string, number> = {};
    (data || []).forEach((lead: { status: string }) => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    return counts;
  }
);
