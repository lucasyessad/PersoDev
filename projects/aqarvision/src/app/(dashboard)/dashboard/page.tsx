import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPlanConfig } from '@/config';
import { createPlanGate } from '@/lib/plan-gate';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, active_plan, slug, description, logo_url, phone, email, address, wilaya, instagram_url, facebook_url')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return (
      <div className="p-8">
        <p className="text-red-600">Aucune agence trouvée. Veuillez en créer une.</p>
      </div>
    );
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    propertiesRes,
    activePropertiesRes,
    leadsRes,
    leadsThisMonthRes,
    newLeadsRes,
    convertedLeadsRes,
    membersRes,
    viewsThisMonthRes,
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'active'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).gte('created_at', startOfMonth.toISOString()),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'new'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'converted'),
    supabase.from('agency_members').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('is_active', true),
    supabase.from('property_views').select('id', { count: 'exact', head: true }).eq('agency_id', agency.id).gte('viewed_at', startOfMonth.toISOString()),
  ]);

  const propertyCount = propertiesRes.count ?? 0;
  const activePropertyCount = activePropertiesRes.count ?? 0;
  const leadCount = leadsRes.count ?? 0;
  const leadsThisMonth = leadsThisMonthRes.count ?? 0;
  const newLeadCount = newLeadsRes.count ?? 0;
  const convertedLeadCount = convertedLeadsRes.count ?? 0;
  const memberCount = (membersRes.count ?? 0) + 1; // +1 for owner
  const viewsThisMonth = viewsThisMonthRes.count ?? 0;

  const planConfig = getPlanConfig(agency.active_plan);
  const gate = createPlanGate(agency.active_plan);

  // Completeness score
  const completeness = calculateCompleteness(agency);

  // Recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, name, phone, source, status, created_at')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p className="mb-8 text-sm text-gray-500">Bienvenue, {agency.name}</p>

      {/* Completeness alert */}
      {completeness.score < 100 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">
                Profil complété à {completeness.score}%
              </p>
              <p className="mt-1 text-xs text-amber-600">
                {completeness.missing.slice(0, 3).join(' · ')}
              </p>
            </div>
            <Link
              href="/dashboard/branding"
              className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200"
            >
              Compléter
            </Link>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-amber-100">
            <div
              className="h-2 rounded-full bg-amber-500 transition-all"
              style={{ width: `${completeness.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Biens actifs"
          value={activePropertyCount}
          sub={`${propertyCount} total · ${gate.limits.maxProperties === Infinity ? '∞' : gate.limits.maxProperties} max`}
          href="/dashboard/properties"
          color="blue"
        />
        <StatCard
          label="Leads ce mois"
          value={leadsThisMonth}
          sub={`${leadCount} total · ${newLeadCount} nouveaux`}
          href="/dashboard/leads"
          color="green"
        />
        <StatCard
          label="Vues ce mois"
          value={viewsThisMonth}
          href="/dashboard/analytics"
          color="purple"
        />
        <StatCard
          label="Taux conversion"
          value={leadCount > 0 ? `${Math.round((convertedLeadCount / leadCount) * 100)}%` : '—'}
          sub={`${convertedLeadCount} convertis`}
          href="/dashboard/analytics"
          color="emerald"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Leads */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Derniers leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>

          {recentLeads && recentLeads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.phone} &middot; {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={lead.status} />
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              Aucun lead pour le moment
            </p>
          )}
        </div>

        {/* Quick Actions + Plan Info */}
        <div className="space-y-6">
          {/* Plan */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-xs text-gray-500">Plan actuel</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{planConfig.name}</p>
            {planConfig.badge && (
              <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                {planConfig.badge}
              </span>
            )}
            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p>Membres : {memberCount}/{gate.limits.maxMembers}</p>
              <p>Biens : {propertyCount}/{gate.limits.maxProperties === Infinity ? '∞' : gate.limits.maxProperties}</p>
              <p>Leads/mois : {leadsThisMonth}/{gate.limits.maxLeadsPerMonth === Infinity ? '∞' : gate.limits.maxLeadsPerMonth}</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="mt-4 block text-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Gérer l&apos;abonnement
            </Link>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Actions rapides</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/properties/new"
                className="block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Ajouter un bien
              </Link>
              <Link
                href="/dashboard/team"
                className="block rounded-lg bg-gray-100 px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-200"
              >
                Inviter un membre
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  negotiation: 'bg-purple-100 text-purple-700',
  converted: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-100',
  green: 'bg-green-50 border-green-100',
  purple: 'bg-purple-50 border-purple-100',
  emerald: 'bg-emerald-50 border-emerald-100',
};

function StatCard({
  label,
  value,
  sub,
  href,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${COLOR_MAP[color] || 'bg-white border-gray-200'}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </Link>
  );
}

interface CompletenessResult {
  score: number;
  missing: string[];
}

function calculateCompleteness(agency: Record<string, unknown>): CompletenessResult {
  const checks = [
    { field: 'name', label: 'Nom de l\'agence' },
    { field: 'description', label: 'Description' },
    { field: 'phone', label: 'Téléphone' },
    { field: 'email', label: 'Email' },
    { field: 'address', label: 'Adresse' },
    { field: 'wilaya', label: 'Wilaya' },
    { field: 'logo_url', label: 'Logo' },
    { field: 'instagram_url', label: 'Instagram' },
    { field: 'facebook_url', label: 'Facebook' },
  ];

  const missing: string[] = [];
  let completed = 0;

  for (const check of checks) {
    if (agency[check.field]) {
      completed++;
    } else {
      missing.push(check.label);
    }
  }

  return {
    score: Math.round((completed / checks.length) * 100),
    missing,
  };
}
