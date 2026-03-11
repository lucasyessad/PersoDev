import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { LeadTimeline } from './timeline';
import { LeadNoteForm } from './note-form';
import type { LeadNote } from '@/types/database';

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualified: 'Qualifié',
  negotiation: 'Négociation',
  converted: 'Converti',
  lost: 'Perdu',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  negotiation: 'bg-purple-100 text-purple-700',
  converted: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
  urgent: 'Urgente',
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Formulaire contact',
  property_detail: 'Fiche bien',
  whatsapp: 'WhatsApp',
  phone: 'Téléphone',
  walk_in: 'Visite',
  referral: 'Recommandation',
  aqarsearch: 'AqarSearch',
};

export default async function LeadDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) return notFound();

  const { data: lead } = await supabase
    .from('leads')
    .select('*, properties:property_id(id, title)')
    .eq('id', id)
    .eq('agency_id', agency.id)
    .single();

  if (!lead) return notFound();

  const { data: notes } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <Link href={`/aqarpro/${slug}/leads`} className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
        &larr; Retour aux leads
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Priorité : {PRIORITY_LABELS[lead.priority]}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoRow label="Téléphone" value={lead.phone} />
              <InfoRow label="Email" value={lead.email} />
              <InfoRow label="Source" value={SOURCE_LABELS[lead.source] || lead.source} />
              {lead.properties && (
                <InfoRow
                  label="Bien associé"
                  value={(lead.properties as { title: string }).title}
                  href={`/aqarpro/${slug}/properties/${(lead.properties as { id: string }).id}/edit`}
                />
              )}
              {lead.budget_min && <InfoRow label="Budget min" value={`${lead.budget_min.toLocaleString('fr-FR')} DA`} />}
              {lead.budget_max && <InfoRow label="Budget max" value={`${lead.budget_max.toLocaleString('fr-FR')} DA`} />}
              {lead.desired_wilaya && <InfoRow label="Wilaya souhaitée" value={lead.desired_wilaya} />}
              {lead.desired_type && <InfoRow label="Type souhaité" value={lead.desired_type} />}
            </div>

            {lead.message && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="mb-1 text-xs font-medium text-gray-500">Message</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Notes</h2>
            <LeadNoteForm leadId={id} />
            {notes && notes.length > 0 ? (
              <div className="mt-4 space-y-3">
                {notes.map((note: LeadNote) => (
                  <div key={note.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(note.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">Aucune note</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <LeadTimeline
            createdAt={lead.created_at}
            contactedAt={lead.contacted_at}
            status={lead.status}
            updatedAt={lead.updated_at}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      {href ? (
        <Link href={href} className="text-sm font-medium text-blue-600 hover:underline">{value}</Link>
      ) : (
        <p className="text-sm font-medium text-gray-900">{value}</p>
      )}
    </div>
  );
}
