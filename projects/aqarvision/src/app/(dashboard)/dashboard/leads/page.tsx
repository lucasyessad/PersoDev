import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LeadRow } from './lead-row';

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Formulaire contact',
  property_detail: 'Fiche bien',
  whatsapp: 'WhatsApp',
  phone: 'Téléphone',
  walk_in: 'Visite',
  referral: 'Recommandation',
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <div className="p-8"><p className="text-red-600">Agence introuvable.</p></div>;
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*, properties:property_id(title)')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false });

  // Stats
  const total = leads?.length ?? 0;
  const newCount = leads?.filter((l) => l.status === 'new').length ?? 0;
  const convertedCount = leads?.filter((l) => l.status === 'converted').length ?? 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} lead(s) au total &middot; {newCount} nouveau(x) &middot; {convertedCount} converti(s)
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: total, color: 'bg-gray-50' },
          { label: 'Nouveaux', value: newCount, color: 'bg-blue-50' },
          { label: 'En cours', value: leads?.filter((l) => ['contacted', 'qualified', 'negotiation'].includes(l.status)).length ?? 0, color: 'bg-yellow-50' },
          { label: 'Convertis', value: convertedCount, color: 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border border-gray-200 ${stat.color} p-4`}>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {leads && leads.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Contact</th>
                <th className="px-6 py-3 font-medium text-gray-500">Source</th>
                <th className="px-6 py-3 font-medium text-gray-500">Bien associé</th>
                <th className="px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3 font-medium text-gray-500">Priorité</th>
                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={{
                    id: lead.id,
                    name: lead.name,
                    phone: lead.phone,
                    email: lead.email,
                    message: lead.message,
                    source: lead.source,
                    sourceLabel: SOURCE_LABELS[lead.source] || lead.source,
                    status: lead.status,
                    priority: lead.priority,
                    propertyTitle: (lead.properties as { title: string } | null)?.title || null,
                    createdAt: lead.created_at,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">Aucun lead pour le moment</p>
          <p className="mt-2 text-sm text-gray-400">
            Les leads apparaîtront ici quand des visiteurs vous contacteront via votre mini-site
          </p>
        </div>
      )}
    </div>
  );
}
