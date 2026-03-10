import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAnalyticsSummary, getTopProperties, getLeadsBySource, getLeadsByStatus } from '@/lib/queries/analytics';
import { planHasFeature } from '@/lib/plan-gate';
import Link from 'next/link';

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
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  negotiation: 'bg-purple-500',
  converted: 'bg-emerald-500',
  lost: 'bg-red-500',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <div className="p-8"><p className="text-red-600">Agence introuvable</p></div>;
  }

  if (!planHasFeature(agency.active_plan, 'advancedAnalytics')) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-lg font-medium text-gray-900">Fonctionnalité Pro</p>
          <p className="mt-2 text-sm text-gray-500">
            Les analytics avancés sont disponibles à partir du plan Pro.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="mb-8 text-sm text-gray-500">Performance de votre agence</p>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Vues totales"
          value={summary.totalViews.toLocaleString('fr-FR')}
          sub={`${summary.viewsThisMonth} ce mois`}
          trend={viewsTrend}
        />
        <KpiCard
          label="Leads totaux"
          value={summary.totalLeads.toLocaleString('fr-FR')}
          sub={`${summary.leadsThisMonth} ce mois`}
          trend={leadsTrend}
        />
        <KpiCard
          label="Taux conversion"
          value={`${summary.conversionRate}%`}
          sub="Vues → Leads"
        />
        <KpiCard
          label="Biens actifs"
          value={summary.totalProperties.toLocaleString('fr-FR')}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Properties */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Top biens (par vues)</h2>
          </div>
          {topProperties.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {topProperties.map((property, i) => (
                <div key={property.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{property.title}</p>
                      <p className="text-xs text-gray-500">{property.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{property.views_count} vues</p>
                    <p className="text-xs text-gray-500">{property.leadCount} leads</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Aucune donnée</p>
          )}
        </div>

        {/* Leads by Source */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Leads par source</h2>
          </div>
          {totalSourceLeads > 0 ? (
            <div className="p-6 space-y-3">
              {Object.entries(leadsBySource)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => {
                  const pct = Math.round((count / totalSourceLeads) * 100);
                  return (
                    <div key={source}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-700">{SOURCE_LABELS[source] || source}</span>
                        <span className="font-medium text-gray-900">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Aucune donnée</p>
          )}
        </div>

        {/* Leads Pipeline */}
        <div className="rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Pipeline des leads</h2>
          </div>
          {totalStatusLeads > 0 ? (
            <div className="p-6">
              <div className="flex gap-2 overflow-x-auto">
                {(['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'] as const).map((status) => {
                  const count = leadsByStatus[status] || 0;
                  const pct = Math.round((count / totalStatusLeads) * 100);
                  return (
                    <div key={status} className="flex-1 min-w-[100px] rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className={`mx-auto mb-2 h-3 w-3 rounded-full ${STATUS_COLORS[status]}`} />
                      <p className="text-xs text-gray-500">{STATUS_LABELS[status]}</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-400">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-400">Aucune donnée</p>
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
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend !== undefined && trend !== 0 && (
          <span className={`mb-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
