import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAnalyticsSummary, getTopProperties, getLeadsBySource, getLeadsByStatus } from '@/lib/queries/analytics';
import { planHasFeature } from '@/lib/plan-gate';
import Link from 'next/link';
import { Eye, Users, TrendingUp, Home, BarChart3 } from 'lucide-react';

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Formulaire',
  property_detail: 'Fiche bien',
  whatsapp: 'WhatsApp',
  phone: 'Téléphone',
  walk_in: 'Visite',
  referral: 'Recommandation',
  aqarsearch: 'AqarSearch',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualified: 'Qualifié',
  negotiation: 'Négociation',
  converted: 'Converti',
  lost: 'Perdu',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-info-600',
  contacted: 'bg-warning-600',
  qualified: 'bg-success-600',
  negotiation: 'bg-primary-600',
  converted: 'bg-success-600',
  lost: 'bg-error-600',
};

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <p className="text-error-600">Agence introuvable</p>;
  }

  if (!planHasFeature(agency.active_plan, 'advancedAnalytics')) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-heading-lg text-neutral-900">Analytics</h1>
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <div className="mx-auto w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
            <BarChart3 className="h-7 w-7 text-primary-600" />
          </div>
          <p className="text-heading-md text-neutral-900">Fonctionnalité Pro</p>
          <p className="mt-2 text-body-sm text-neutral-500 max-w-sm mx-auto">
            Les analytics avancés sont disponibles à partir du plan Pro. Visualisez vos performances, identifiez vos meilleurs biens et optimisez votre ROI.
          </p>
          <Link
            href={`/aqarpro/${slug}/settings/billing`}
            className="mt-6 inline-flex items-center h-10 px-6 bg-primary-600 text-white text-body-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Passer au plan Pro
          </Link>
        </div>
      </div>
    );
  }

  const [summary, topProperties, leadsBySource, leadsByStatus] = await Promise.all([
    getAnalyticsSummary(agency.id),
    getTopProperties(agency.id),
    getLeadsBySource(agency.id),
    getLeadsByStatus(agency.id),
  ]);

  const viewsTrend = summary.viewsLastMonth > 0
    ? Math.round(((summary.viewsThisMonth - summary.viewsLastMonth) / summary.viewsLastMonth) * 100)
    : 0;
  const leadsTrend = summary.leadsLastMonth > 0
    ? Math.round(((summary.leadsThisMonth - summary.leadsLastMonth) / summary.leadsLastMonth) * 100)
    : 0;

  const totalSourceLeads = Object.values(leadsBySource).reduce((a, b) => a + b, 0);
  const totalStatusLeads = Object.values(leadsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-heading-lg text-neutral-900">Analytics</h1>
        <p className="text-body-sm text-neutral-500 mt-0.5">Performance de votre agence</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Vues totales" value={summary.totalViews.toLocaleString('fr-FR')} sub={`${summary.viewsThisMonth} ce mois`} trend={viewsTrend} icon={Eye} />
        <KpiCard label="Leads totaux" value={summary.totalLeads.toLocaleString('fr-FR')} sub={`${summary.leadsThisMonth} ce mois`} trend={leadsTrend} icon={Users} />
        <KpiCard label="Taux conversion" value={`${summary.conversionRate}%`} sub="Vues → Leads" icon={TrendingUp} />
        <KpiCard label="Biens actifs" value={summary.totalProperties.toLocaleString('fr-FR')} icon={Home} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Properties */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="text-heading-sm text-neutral-900">Top biens (par vues)</h2>
          </div>
          {topProperties.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {topProperties.map((property, i) => (
                <div key={property.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-caption font-bold text-primary-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-body-sm font-medium text-neutral-900 truncate max-w-[200px]">{property.title}</p>
                      <p className="text-caption text-neutral-400">{property.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-semibold text-neutral-900">{property.views_count} vues</p>
                    <p className="text-caption text-neutral-400">{property.leadCount} leads</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-body-sm text-neutral-400">Aucune donnée</p>
          )}
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="text-heading-sm text-neutral-900">Leads par source</h2>
          </div>
          {totalSourceLeads > 0 ? (
            <div className="p-6 space-y-4">
              {Object.entries(leadsBySource)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => {
                  const pct = Math.round((count / totalSourceLeads) * 100);
                  return (
                    <div key={source}>
                      <div className="mb-1.5 flex justify-between text-body-sm">
                        <span className="text-neutral-700">{SOURCE_LABELS[source] || source}</span>
                        <span className="font-semibold text-neutral-900">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-neutral-100">
                        <div
                          className="h-2 rounded-full bg-primary-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-body-sm text-neutral-400">Aucune donnée</p>
          )}
        </div>

        {/* Leads Pipeline */}
        <div className="bg-white rounded-xl border border-neutral-200 lg:col-span-2">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="text-heading-sm text-neutral-900">Pipeline des leads</h2>
          </div>
          {totalStatusLeads > 0 ? (
            <div className="p-6">
              <div className="flex gap-3 overflow-x-auto">
                {(['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'] as const).map((status) => {
                  const count = leadsByStatus[status] || 0;
                  const pct = Math.round((count / totalStatusLeads) * 100);
                  return (
                    <div key={status} className="flex-1 min-w-[100px] rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                      <div className={`mx-auto mb-2 h-3 w-3 rounded-full ${STATUS_COLORS[status]}`} />
                      <p className="text-caption text-neutral-500">{STATUS_LABELS[status]}</p>
                      <p className="mt-1 text-heading-md text-neutral-900">{count}</p>
                      <p className="text-caption text-neutral-400">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-body-sm text-neutral-400">Aucune donnée</p>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon: typeof Eye;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-body-sm text-neutral-500">{label}</p>
        <Icon className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="flex items-end gap-2">
        <p className="text-display-sm font-display text-neutral-900">{value}</p>
        {trend !== undefined && trend !== 0 && (
          <span className={`mb-1 text-caption font-semibold ${trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-caption text-neutral-400">{sub}</p>}
    </div>
  );
}
