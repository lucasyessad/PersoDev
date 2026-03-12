import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CalendarCheck, Phone, Mail, Clock } from 'lucide-react';
import type { VisitRequestStatus } from '@/types/database';

export const metadata = {
  title: 'Demandes de visite | Dashboard',
};

const statusLabels: Record<VisitRequestStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
  declined: { label: 'Refusée', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminée', color: 'bg-gray-100 text-gray-800' },
};

export default async function VisitesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Get user's agency
  const { data: member } = await supabase
    .from('agency_members')
    .select('agency_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!member) redirect('/dashboard');

  // Get visit requests for agency
  const { data: visits } = await supabase
    .from('visit_requests')
    .select(`
      id, name, phone, email, message, status, created_at,
      properties!inner (title)
    `)
    .eq('agency_id', member.agency_id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Demandes de visite</h1>
        <p className="mt-1 text-sm text-gray-500">
          {visits?.length ?? 0} demande{(visits?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {!visits || visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16">
          <CalendarCheck className="mb-3 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Aucune demande de visite</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => {
            const property = visit.properties as unknown as { title: string };
            const status = statusLabels[(visit.status as VisitRequestStatus) ?? 'pending'];
            return (
              <div
                key={visit.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{visit.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">{property.title}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {visit.phone}
                  </span>
                  {visit.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {visit.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(visit.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {visit.message && (
                  <p className="mt-2 text-xs text-gray-500 italic">
                    &laquo; {visit.message} &raquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
