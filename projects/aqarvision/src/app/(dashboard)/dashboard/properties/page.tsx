import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PropertyActions } from './property-actions';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  sold: { label: 'Vendu', color: 'bg-blue-100 text-blue-700' },
  rented: { label: 'Loué', color: 'bg-purple-100 text-purple-700' },
  archived: { label: 'Archivé', color: 'bg-red-100 text-red-700' },
};

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = { DZD: 'DA', EUR: '€', USD: '$', GBP: '£' };
  const symbol = symbols[currency] || currency;
  return `${price.toLocaleString('fr-FR')} ${symbol}`;
}

export default async function PropertiesPage() {
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

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biens immobiliers</h1>
          <p className="mt-1 text-sm text-gray-500">
            {properties?.length ?? 0} bien(s) au total
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + Ajouter un bien
        </Link>
      </div>

      {properties && properties.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Bien</th>
                <th className="px-6 py-3 font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 font-medium text-gray-500">Prix</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Vues</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((property) => {
                const status = STATUS_LABELS[property.status] || STATUS_LABELS.draft;
                return (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <p className="text-xs text-gray-500">
                        {[property.city, property.wilaya].filter(Boolean).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">
                      {property.type} &middot; {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatPrice(property.price, property.currency)}
                      {property.transaction_type === 'rent' && <span className="text-gray-400">/mois</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{property.views_count}</td>
                    <td className="px-6 py-4">
                      <PropertyActions propertyId={property.id} propertyTitle={property.title} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">Aucun bien pour le moment</p>
          <Link
            href="/dashboard/properties/new"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Ajouter votre premier bien
          </Link>
        </div>
      )}
    </div>
  );
}
