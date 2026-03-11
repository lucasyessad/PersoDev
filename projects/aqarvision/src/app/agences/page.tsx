import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, MapPin, Home, ArrowRight, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Annuaire des agences immobilières — Aqar',
  description: 'Découvrez les meilleures agences immobilières au Maroc. Villas, appartements, riads et terrains.',
};

export default async function AgencesPage() {
  const supabase = await createClient();
  const { data: agencies } = await supabase
    .from('agencies')
    .select('id, name, slug, city, logo_url, description, active_plan')
    .eq('is_active', true)
    .order('name');

  const list = agencies ?? [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg text-primary-900">Aqar</span>
          </Link>
          <div className="border-l border-neutral-200 h-5" />
          <nav className="flex items-center gap-1 text-body-sm text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-900">Agences</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-neutral-100 py-12 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="font-display text-display-lg text-neutral-900 mb-2">
            Annuaire des agences
          </h1>
          <p className="text-body-lg text-neutral-500">
            {list.length > 0
              ? `${list.length} agence${list.length !== 1 ? 's' : ''} partenaire${list.length !== 1 ? 's' : ''}`
              : 'Les meilleures agences immobilières au Maroc'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map((agency) => (
              <Link
                key={agency.id}
                href={`/agence/${agency.slug}`}
                className="group bg-white rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-card transition-all"
              >
                {/* Logo / Avatar */}
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {agency.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={agency.logo_url} alt={agency.name} className="w-10 h-10 object-contain rounded-lg" />
                  ) : (
                    <Building2 className="h-6 w-6 text-primary-600" />
                  )}
                </div>

                <h2 className="text-heading-sm text-neutral-900 mb-1 group-hover:text-primary-700 transition-colors">
                  {agency.name}
                </h2>

                {agency.city && (
                  <div className="flex items-center gap-1 text-body-sm text-neutral-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {agency.city}
                  </div>
                )}

                {agency.description && (
                  <p className="text-body-sm text-neutral-500 line-clamp-2 mb-4">
                    {agency.description}
                  </p>
                )}

                <span className="inline-flex items-center gap-1 text-body-sm text-primary-600 font-medium group-hover:gap-2 transition-all">
                  Voir l&apos;agence <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty state with CTA for agencies */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="font-display text-display-md text-neutral-900 mb-3">
              Aucune agence pour l&apos;instant
            </h2>
            <p className="text-body-lg text-neutral-500 max-w-md mb-8">
              Les agences partenaires apparaîtront ici. Vous êtes une agence immobilière ?
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-11 px-6 bg-primary-600 text-white text-body-md font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Rejoindre AqarPro
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
