import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SEARCH } from '@/config';

interface Props {
  params: Promise<{ wilaya: string }>;
}

function fromSlug(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wilaya } = await params;
  const name = fromSlug(wilaya);
  return {
    title: `Immobilier ${name} — Vente & Location | AqarVision`,
    description: `Consultez toutes les annonces immobilières à ${name}. Appartements, villas, terrains et locaux commerciaux en vente et location.`,
  };
}

const PROPERTY_TYPES = [
  { slug: 'appartement', label: 'Appartements' },
  { slug: 'villa', label: 'Villas' },
  { slug: 'terrain', label: 'Terrains' },
  { slug: 'local-commercial', label: 'Locaux commerciaux' },
  { slug: 'bureau', label: 'Bureaux' },
  { slug: 'maison', label: 'Maisons' },
];

export default async function WilayaPage({ params }: Props) {
  const { wilaya } = await params;
  const name = fromSlug(wilaya);

  const supabase = await createClient();

  // Get properties count for this wilaya
  const { count: saleCount } = await supabase
    .from('search_properties_view')
    .select('*', { count: 'exact', head: true })
    .ilike('wilaya', `%${name}%`)
    .eq('transaction_type', 'sale');

  const { count: rentCount } = await supabase
    .from('search_properties_view')
    .select('*', { count: 'exact', head: true })
    .ilike('wilaya', `%${name}%`)
    .eq('transaction_type', 'rent');

  const total = (saleCount || 0) + (rentCount || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/immobilier" className="hover:text-blue-600">Immobilier</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Immobilier à {name}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {total} annonce{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick links */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/recherche?wilaya=${encodeURIComponent(name)}&transaction_type=sale`}
            className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-lg font-semibold text-gray-900">Vente</p>
            <p className="text-sm text-gray-500">{saleCount || 0} annonces de vente à {name}</p>
          </Link>
          <Link
            href={`/recherche?wilaya=${encodeURIComponent(name)}&transaction_type=rent`}
            className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-lg font-semibold text-gray-900">Location</p>
            <p className="text-sm text-gray-500">{rentCount || 0} annonces de location à {name}</p>
          </Link>
        </div>

        {/* By type */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Par type de bien à {name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {PROPERTY_TYPES.map((type) => (
              <Link
                key={type.slug}
                href={`/recherche?wilaya=${encodeURIComponent(name)}&property_type=${type.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-medium text-gray-900">{type.label} à {name}</p>
                <p className="mt-1 text-xs text-blue-600">Voir les annonces</p>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-12 rounded-xl bg-white border border-gray-200 p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Immobilier à {name} — Guide
          </h2>
          <div className="prose prose-gray max-w-none text-sm">
            <p>
              Découvrez les meilleures offres immobilières à {name} sur AqarVision.
              Notre plateforme regroupe des annonces d&apos;agences immobilières vérifiées
              proposant des appartements, villas, terrains et locaux commerciaux
              en vente et location dans la wilaya de {name}.
            </p>
            <p>
              Utilisez notre moteur de recherche AqarSearch avec des filtres avancés
              (prix, surface, nombre de pièces) pour trouver le bien qui correspond
              exactement à vos critères. Chaque annonce dispose d&apos;un score de confiance
              AqarTrust pour vous aider à identifier les meilleures opportunités.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
