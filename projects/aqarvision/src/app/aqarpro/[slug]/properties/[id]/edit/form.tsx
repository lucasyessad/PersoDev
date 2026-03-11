'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSlug } from '@/lib/hooks/use-slug';
import { updateProperty } from '@/lib/actions/properties';
import { WILAYAS } from '@/lib/constants';
import type { Property } from '@/types/database';
import {
  Home,
  MapPin,
  DollarSign,
  FileText,
  Sparkles,
  Car,
  Waves,
  Snowflake,
  Flame,
  Wifi,
  ShieldCheck,
  Trees,
  Warehouse,
  ArrowUpDown,
  Zap,
  Droplets,
  Wind,
  Dumbbell,
  Baby,
  Accessibility,
  ParkingCircle,
  Check,
  CheckCircle,
  Send,
} from 'lucide-react';

const AMENITIES = [
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'ascenseur', label: 'Ascenseur', icon: ArrowUpDown },
  { id: 'climatisation', label: 'Climatisation', icon: Snowflake },
  { id: 'chauffage', label: 'Chauffage', icon: Flame },
  { id: 'piscine', label: 'Piscine', icon: Waves },
  { id: 'jardin', label: 'Jardin', icon: Trees },
  { id: 'wifi', label: 'Internet/Wifi', icon: Wifi },
  { id: 'securite', label: 'Sécurité', icon: ShieldCheck },
  { id: 'garage', label: 'Garage', icon: Warehouse },
  { id: 'gaz', label: 'Gaz de ville', icon: Zap },
  { id: 'eau', label: 'Eau courante', icon: Droplets },
  { id: 'ventilation', label: 'Ventilation', icon: Wind },
  { id: 'salle_sport', label: 'Salle de sport', icon: Dumbbell },
  { id: 'aire_jeux', label: 'Aire de jeux', icon: Baby },
  { id: 'acces_pmr', label: 'Accès PMR', icon: Accessibility },
  { id: 'parking_couvert', label: 'Parking couvert', icon: ParkingCircle },
] as const;

const inputClass =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30';
const selectClass =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-body-sm text-neutral-900 transition-colors hover:border-neutral-300 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30';
const labelClass = 'mb-1.5 block text-caption font-medium text-neutral-700';

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
          <Icon className="h-4.5 w-4.5 text-primary-600" />
        </div>
        <h2 className="text-body-sm font-semibold text-neutral-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const slug = useSlug();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property.features ?? []
  );

  function toggleAmenity(id: string) {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

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
      commune: formData.get('commune') || null,
      address: formData.get('address') || null,
      currency: formData.get('currency') || 'DZD',
      is_featured: formData.get('is_featured') === 'on',
      images: property.images,
      features: selectedAmenities,
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

  const isDraft = property.status === 'draft';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-body-sm text-red-800">
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-body-sm text-emerald-800">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      {/* ── Informations principales ── */}
      <Section icon={Home} title="Informations principales">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Titre *</label>
            <input id="title" name="title" type="text" required minLength={3} maxLength={200}
              defaultValue={property.title}
              className={inputClass} placeholder="Appartement F3 centre-ville" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="type" className={labelClass}>Type *</label>
              <select id="type" name="type" required defaultValue={property.type} className={selectClass}>
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
              <label htmlFor="transaction_type" className={labelClass}>Transaction *</label>
              <select id="transaction_type" name="transaction_type" required defaultValue={property.transaction_type} className={selectClass}>
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Statut</label>
              <select id="status" name="status" defaultValue={property.status} className={selectClass}>
                <option value="draft">Brouillon</option>
                <option value="active">Actif (publié)</option>
                <option value="sold">Vendu</option>
                <option value="rented">Loué</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Prix et caractéristiques ── */}
      <Section icon={DollarSign} title="Prix et caractéristiques">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelClass}>Prix *</label>
              <input id="price" name="price" type="number" required min={0}
                defaultValue={property.price}
                className={inputClass} placeholder="4 500 000" />
            </div>
            <div>
              <label htmlFor="currency" className={labelClass}>Devise</label>
              <select id="currency" name="currency" defaultValue={property.currency} className={selectClass}>
                <option value="DZD">DZD (Dinar algérien)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="surface" className={labelClass}>Surface (m²)</label>
              <input id="surface" name="surface" type="number" min={0}
                defaultValue={property.surface ?? ''}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="rooms" className={labelClass}>Pièces</label>
              <input id="rooms" name="rooms" type="number" min={0}
                defaultValue={property.rooms ?? ''}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="bathrooms" className={labelClass}>Salles de bain</label>
              <input id="bathrooms" name="bathrooms" type="number" min={0}
                defaultValue={property.bathrooms ?? ''}
                className={inputClass} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Description ── */}
      <Section icon={FileText} title="Description">
        <textarea id="description" name="description" rows={5} maxLength={5000}
          defaultValue={property.description || ''}
          className={inputClass}
          placeholder="Décrivez le bien en détail : état, vue, étage, orientation..." />
      </Section>

      {/* ── Localisation ── */}
      <Section icon={MapPin} title="Localisation">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className={labelClass}>Pays</label>
              <select id="country" name="country" defaultValue={property.country} className={selectClass}>
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
              <label htmlFor="wilaya" className={labelClass}>Wilaya</label>
              <select id="wilaya" name="wilaya" defaultValue={property.wilaya || ''} className={selectClass}>
                <option value="">Sélectionner</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className={labelClass}>Ville</label>
              <input id="city" name="city" type="text" defaultValue={property.city || ''}
                className={inputClass} placeholder="Oran" />
            </div>
            <div>
              <label htmlFor="commune" className={labelClass}>Commune / Quartier</label>
              <input id="commune" name="commune" type="text" defaultValue={property.commune || ''}
                className={inputClass} placeholder="Bir El Djir" />
            </div>
            <div>
              <label htmlFor="address" className={labelClass}>Adresse</label>
              <input id="address" name="address" type="text" defaultValue={property.address || ''}
                className={inputClass} placeholder="Rue, n°..." />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Équipements ── */}
      <Section icon={Sparkles} title="Équipements">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {AMENITIES.map(({ id, label, icon: AmenityIcon }) => {
            const isSelected = selectedAmenities.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleAmenity(id)}
                className={`flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-left text-caption font-medium transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <AmenityIcon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-500' : 'text-neutral-400'}`} />
                <span className="truncate">{label}</span>
                {isSelected && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary-500" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Options ── */}
      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4">
        <input id="is_featured" name="is_featured" type="checkbox"
          defaultChecked={property.is_featured}
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
        <label htmlFor="is_featured" className="text-body-sm font-medium text-neutral-700">
          Mettre en avant sur le mini-site
        </label>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {isPending ? (
            'Enregistrement...'
          ) : (
            <>
              <Check className="h-4 w-4" />
              Sauvegarder
            </>
          )}
        </button>
        {isDraft && (
          <button
            type="submit"
            disabled={isPending}
            onClick={() => {
              const statusSelect = document.getElementById('status') as HTMLSelectElement;
              if (statusSelect) statusSelect.value = 'active';
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Publier
          </button>
        )}
        <Link
          href={`/aqarpro/${slug}/properties`}
          className="rounded-lg border border-neutral-200 px-6 py-2.5 text-body-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
