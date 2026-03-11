import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EditPropertyForm } from './form';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!agency) redirect(`/aqarpro/${slug}/dashboard`);

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('agency_id', agency.id)
    .single();

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <p className="text-body-sm text-red-800">Bien introuvable ou accès non autorisé.</p>
          <Link
            href={`/aqarpro/${slug}/properties`}
            className="mt-4 inline-flex items-center gap-2 text-body-sm font-medium text-primary-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux biens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={`/aqarpro/${slug}/properties`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-heading-lg text-neutral-900">Modifier le bien</h1>
          <p className="text-body-sm text-neutral-500 truncate max-w-md">{property.title}</p>
        </div>
      </div>
      <EditPropertyForm property={property} />
    </div>
  );
}
