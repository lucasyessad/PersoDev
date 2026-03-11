import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, UserPlus, UserCheck, Columns3 } from 'lucide-react';
import { LeadRow } from './lead-row';
import { ExportCsvButton } from './export-csv';
import { planHasFeature } from '@/lib/plan-gate';

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Formulaire contact',
  property_detail: 'Fiche bien',
  whatsapp: 'WhatsApp',
  phone: 'Téléphone',
  walk_in: 'Visite',
  referral: 'Recommandation',
  aqarsearch: 'AqarSearch',
};

export default async function LeadsPage({
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
    .select('id, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <p className="text-error-600">Agence introuvable.</p>;
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*, properties:property_id(title)')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false });

  const total = leads?.length ?? 0;
  const newCount = leads?.filter((l) => l.status === 'new').length ?? 0;
  const convertedCount = leads?.filter((l) => l.status === 'converted').length ?? 0;
  const inProgressCount = leads?.filter((l) => ['contacted', 'qualified', 'negotiation'].includes(l.status)).length ?? 0;
  const canExport = planHasFeature(agency.active_plan, 'exportLeads');

  const exportData = canExport && leads ? leads.map((l) => ({
    nom: l.name,
    telephone: l.phone,
    email: l.email || '',
    source: SOURCE_LABELS[l.source] || l.source,
    statut: l.status,
    priorite: l.priority,
    message: l.message || '',
    bien: (l.properties as { title: string } | null)?.title || '',
    date: new Date(l.created_at).toLocaleDateString('fr-FR'),
  })) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-lg text-neutral-900">Gestion des leads</h1>
          <p className="text-body-sm text-neutral-500 mt-0.5">
            {total} lead(s) au total · {newCount} nouveau(x) · {convertedCount} converti(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/aqarpro/${slug}/leads/kanban`}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-body-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Columns3 className="h-4 w-4" /> Kanban
          </Link>
          {canExport && exportData && (
            <ExportCsvButton data={exportData} />
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: total,            icon: Users,     bg: 'bg-neutral-100', text: 'text-neutral-600' },
          { label: 'Nouveaux',  value: newCount,         icon: UserPlus,  bg: 'bg-info-100',    text: 'text-info-600' },
          { label: 'En cours',  value: inProgressCount,  icon: Users,     bg: 'bg-warning-100', text: 'text-warning-600' },
          { label: 'Convertis', value: convertedCount,   icon: UserCheck, bg: 'bg-success-100', text: 'text-success-600' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.text}`} />
            </div>
            <div>
              <p className="text-caption text-neutral-500">{stat.label}</p>
              <p className="text-heading-md text-neutral-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {leads && leads.length > 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-6 py-3 font-medium text-neutral-500">Contact</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Source</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Bien associé</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Statut</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Priorité</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Date</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
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
        <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white py-16 text-center">
          <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-body-md text-neutral-500">Aucun lead pour le moment</p>
          <p className="mt-2 text-body-sm text-neutral-400">
            Les leads apparaîtront ici quand des visiteurs vous contacteront via votre mini-site
          </p>
        </div>
      )}
    </div>
  );
}
