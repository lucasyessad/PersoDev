import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Immobilier en Algérie — Annonces par wilaya | AqarVision',
  description: 'Trouvez votre bien immobilier en Algérie. Parcourez les annonces de vente et location par wilaya, ville et type de bien.',
};

const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida',
  'Batna', 'Sétif', 'Tlemcen', 'Béjaïa', 'Tizi Ouzou',
  'Djelfa', 'Biskra', 'Mostaganem', 'Médéa', 'Chlef',
  'Skikda', 'Sidi Bel Abbès', 'Bouira', 'M\'sila', 'Jijel',
  'Boumerdès', 'El Oued', 'Ghardaïa', 'Tipaza', 'Mila',
  'Aïn Defla', 'Bordj Bou Arréridj', 'Tiaret', 'Tébessa', 'Ouargla',
  'Guelma', 'Souk Ahras', 'Relizane', 'Mascara', 'Laghouat',
  'Saïda', 'Khenchela', 'El Tarf', 'Aïn Témouchent', 'Tissemsilt',
  'Oum El Bouaghi', 'Naâma', 'El Bayadh', 'Adrar', 'Béchar',
  'Tamanghasset', 'Illizi', 'Tindouf',
];

const PROPERTY_TYPES = [
  { slug: 'appartement', label: 'Appartements' },
  { slug: 'villa', label: 'Villas' },
  { slug: 'terrain', label: 'Terrains' },
  { slug: 'local-commercial', label: 'Locaux commerciaux' },
  { slug: 'bureau', label: 'Bureaux' },
  { slug: 'maison', label: 'Maisons' },
  { slug: 'duplex', label: 'Duplex' },
  { slug: 'studio', label: 'Studios' },
];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ImmobilierPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Immobilier en Algérie</h1>
          <p className="mt-2 text-lg text-gray-600">
            Parcourez les annonces immobilières par wilaya et type de bien
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Property Types */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Par type de bien</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {PROPERTY_TYPES.map((type) => (
              <Link
                key={type.slug}
                href={`/recherche?property_type=${type.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center transition-shadow hover:shadow-md"
              >
                <p className="font-medium text-gray-900">{type.label}</p>
                <p className="mt-1 text-xs text-gray-500">Voir les annonces</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Wilayas */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Par wilaya</h2>
          <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {WILAYAS.map((wilaya) => (
              <Link
                key={wilaya}
                href={`/immobilier/${toSlug(wilaya)}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                {wilaya}
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-12 rounded-xl bg-white border border-gray-200 p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Le marché immobilier en Algérie
          </h2>
          <div className="prose prose-gray max-w-none text-sm">
            <p>
              AqarVision regroupe des milliers d&apos;annonces immobilières à travers les 48 wilayas d&apos;Algérie.
              Que vous cherchiez un appartement à Alger, une villa à Oran, un terrain à Constantine
              ou un local commercial à Béjaïa, notre plateforme vous permet de trouver le bien idéal.
            </p>
            <p>
              Chaque annonce est vérifiée par notre système de score de confiance AqarTrust,
              qui évalue la qualité des photos, la cohérence du prix et la fiabilité de l&apos;agence
              pour vous garantir une expérience de recherche transparente.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
