import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, active_plan, slug')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return (
      <div className="p-8">
        <p className="text-red-600">Aucune agence trouvée. Veuillez en créer une.</p>
      </div>
    );
  }

  // Fetch counts
  const [propertiesRes, leadsRes] = await Promise.all([
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agency.id),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('agency_id', agency.id),
  ]);

  const propertyCount = propertiesRes.count ?? 0;
  const leadCount = leadsRes.count ?? 0;

  // Recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, name, phone, source, status, created_at')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Biens', value: propertyCount, href: '/dashboard/properties', color: 'bg-blue-50 text-blue-700' },
    { label: 'Leads', value: leadCount, href: '/dashboard/leads', color: 'bg-green-50 text-green-700' },
    { label: 'Plan', value: agency.active_plan.charAt(0).toUpperCase() + agency.active_plan.slice(1), href: '/pricing', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p className="mb-8 text-sm text-gray-500">Bienvenue, {agency.name}</p>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="rounded-xl border border-gray-200 bg-white">
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
