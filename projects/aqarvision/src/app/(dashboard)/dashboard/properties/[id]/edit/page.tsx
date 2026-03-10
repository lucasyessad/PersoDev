import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EditPropertyForm } from './form';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) redirect('/dashboard');

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('agency_id', agency.id)
    .single();

  if (!property) {
    return (
      <div className="p-8">
        <p className="text-red-600">Bien introuvable ou accès non autorisé.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Modifier le bien</h1>
      <EditPropertyForm property={property} />
    </div>
  );
}
