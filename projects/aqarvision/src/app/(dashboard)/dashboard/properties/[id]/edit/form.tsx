'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProperty } from '@/lib/actions/properties';
import type { Property } from '@/types/database';

export function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: formData.get('title'),
      description: formData.get('description') || null,
      price: Number(formData.get('price')),
      surface: formData.get('surface') ? Number(formData.get('surface')) : null,
      rooms: formData.get('rooms') ? Number(formData.get('rooms')) : null,
      bathrooms: formData.get('bathrooms') ? Number(formData.get('bathrooms')) : null,
      type: formData.get('type'),
      transaction_type: formData.get('transaction_type'),
      status: formData.get('status'),
      country: formData.get('country') || 'DZ',
      city: formData.get('city') || null,
      wilaya: formData.get('wilaya') || null,
      address: formData.get('address') || null,
      currency: formData.get('currency') || 'DZD',
      is_featured: formData.get('is_featured') === 'on',
      images: property.images,
      features: (formData.get('features') as string || '')
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const result = await updateProperty(property.id, data);
      if (result.success) {
        setMessage('Bien mis à jour avec succès');
        router.refresh();
      } else {
        setError(result.error || 'Erreur inconnue');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-200 bg-white p-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Informations principales</h2>

        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Titre *</label>
          <input id="title" name="title" type="text" required minLength={3} maxLength={200}
            defaultValue={property.title}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={4} maxLength={5000}
            defaultValue={property.description || ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="type" className="mb-1 block text-sm font-medium">Type *</label>
            <select id="type" name="type" required defaultValue={property.type}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="apartment">Appartement</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="commercial">Local commercial</option>
              <option value="land">Terrain</option>
              <option value="office">Bureau</option>
              <option value="warehouse">Entrepôt</option>
            </select>
          </div>

          <div>
            <label htmlFor="transaction_type" className="mb-1 block text-sm font-medium">Transaction</label>
            <select id="transaction_type" name="transaction_type" defaultValue={property.transaction_type}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium">Statut</label>
            <select id="status" name="status" defaultValue={property.status}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="draft">Brouillon</option>
              <option value="active">Actif (publié)</option>
              <option value="sold">Vendu</option>
              <option value="rented">Loué</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Prix et caractéristiques</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">Prix *</label>
            <input id="price" name="price" type="number" required min={0}
              defaultValue={property.price}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="currency" className="mb-1 block text-sm font-medium">Devise</label>
            <select id="currency" name="currency" defaultValue={property.currency}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="DZD">DZD (Dinar algérien)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="USD">USD (Dollar)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="surface" className="mb-1 block text-sm font-medium">Surface (m²)</label>
            <input id="surface" name="surface" type="number" min={0}
              defaultValue={property.surface ?? ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="rooms" className="mb-1 block text-sm font-medium">Pièces</label>
            <input id="rooms" name="rooms" type="number" min={0}
              defaultValue={property.rooms ?? ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="mb-1 block text-sm font-medium">Salles de bain</label>
            <input id="bathrooms" name="bathrooms" type="number" min={0}
              defaultValue={property.bathrooms ?? ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label htmlFor="features" className="mb-1 block text-sm font-medium">Caractéristiques</label>
          <input id="features" name="features" type="text"
            defaultValue={property.features.join(', ')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Parking, Ascenseur, Climatisation" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Localisation</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium">Pays</label>
            <select id="country" name="country" defaultValue={property.country}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="DZ">Algérie</option>
              <option value="FR">France</option>
              <option value="MA">Maroc</option>
              <option value="TN">Tunisie</option>
              <option value="AE">Émirats Arabes Unis</option>
              <option value="TR">Turquie</option>
              <option value="ES">Espagne</option>
            </select>
          </div>
          <div>
            <label htmlFor="wilaya" className="mb-1 block text-sm font-medium">Wilaya / Région</label>
            <input id="wilaya" name="wilaya" type="text" defaultValue={property.wilaya || ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">Ville</label>
            <input id="city" name="city" type="text" defaultValue={property.city || ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium">Adresse</label>
            <input id="address" name="address" type="text" defaultValue={property.address || ''}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="is_featured" name="is_featured" type="checkbox"
          defaultChecked={property.is_featured}
          className="h-4 w-4 rounded border-gray-300 text-blue-600" />
        <label htmlFor="is_featured" className="text-sm font-medium">Mettre en avant</label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isPending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
          {isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <Link href="/dashboard/properties"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          Annuler
        </Link>
      </div>
    </form>
  );
}
