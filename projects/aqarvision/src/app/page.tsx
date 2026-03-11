import Link from 'next/link';
import Image from 'next/image';
import {
  Building2, ArrowRight, Search, Shield, Star, MapPin,
  CheckCircle2,
} from 'lucide-react';
import { SearchBar } from '@/components/search/search-bar';
import { Suspense } from 'react';

/* ─── Data ─────────────────────────────────────────────────────── */

const CITIES = [
  { name: 'Alger',       count: 3240, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { name: 'Oran',        count: 1870, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { name: 'Constantine', count: 940,  image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=600&q=80' },
  { name: 'Annaba',      count: 620,  image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80' },
  { name: 'Tizi-Ouzou',  count: 480,  image: 'https://images.unsplash.com/photo-1567604446671-ce9ca99e1c91?w=600&q=80' },
  { name: 'Sétif',       count: 390,  image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80' },
];

const STATS = [
  { label: 'Annonces actives',    value: '12 000+' },
  { label: 'Agences partenaires', value: '320+' },
  { label: 'Transactions/mois',   value: '800+' },
  { label: 'Wilayas couvertes',   value: '48' },
];

/* ─── Navbar ────────────────────────────────────────────────────── */

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200 h-[72px] flex items-center">
      <div className="w-full max-w-content-xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-primary-900 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-accent-400" />
          </div>
          <span className="font-display text-xl text-primary-900 tracking-tight">AqarVision</span>
        </Link>

        {/* CTAs — 2 audiences */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/recherche"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 text-body-sm font-semibold text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Je suis particulier
          </Link>
          <Link
            href="/pro"
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent-400 text-primary-900 text-body-sm font-semibold rounded-lg hover:bg-accent-300 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            Je suis professionnel
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero — Recherche immobilière ──────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[80vh] pt-[72px]"
      style={{ background: 'linear-gradient(150deg, #0A1929 0%, #0D2D52 55%, #0F3D72 100%)' }}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 max-w-[900px] mx-auto w-full">
        <h1 className="font-display text-display-xl text-white mb-4 leading-tight">
          Trouvez votre prochain bien<br />
          <span className="text-accent-400">en Algérie</span>
        </h1>
        <p className="text-body-lg text-white/60 mb-10 max-w-xl">
          Des milliers d&apos;annonces vérifiées dans 48 wilayas.
          Recherche avancée, alertes, carte interactive — 100% gratuit.
        </p>

        {/* Barre de recherche */}
        <Suspense fallback={null}>
          <SearchBar variant="hero" />
        </Suspense>

        {/* Recherches rapides */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { label: 'Appartements Alger',  href: '/recherche?q=Alger&property_type=appartement' },
            { label: 'Villas Oran',          href: '/recherche?q=Oran&property_type=villa' },
            { label: 'Studios Constantine',  href: '/recherche?q=Constantine' },
            { label: 'Terrains Tizi-Ouzou', href: '/recherche?q=Tizi-Ouzou&property_type=terrain' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-caption text-white/50 hover:text-white/80 transition-colors border border-white/15 rounded-full px-3 py-1 hover:border-white/30"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="w-full bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-content-xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-heading-md text-accent-400">{s.value}</div>
              <div className="text-caption text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Villes populaires ─────────────────────────────────────────── */

function PopularCities() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-content-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-display-md text-primary-900 mb-3">Explorer par ville</h2>
          <p className="text-body-lg text-neutral-500">Des annonces dans toutes les wilayas d&apos;Algérie</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CITIES.map(city => (
            <Link
              key={city.name}
              href={`/recherche?q=${encodeURIComponent(city.name)}`}
              className="group relative overflow-hidden rounded-xl aspect-[3/2] block shadow-sm"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-heading-md text-white">{city.name}</h3>
                <p className="text-body-sm text-white/70">{city.count.toLocaleString('fr-FR')} annonces</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/recherche" className="inline-flex items-center gap-2 text-body-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Voir toutes les annonces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Encart AqarPro ────────────────────────────────────────────── */

function ProBanner() {
  return (
    <section className="py-16 px-6 bg-primary-900">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <span className="text-caption font-bold text-accent-400 uppercase tracking-widest mb-2 block">AqarPro</span>
          <h2 className="font-display text-display-sm text-white mb-3">
            Vous êtes une agence immobilière ?
          </h2>
          <p className="text-body-md text-white/50 max-w-lg">
            Publiez vos annonces, recevez des leads qualifiés et gérez votre activité
            depuis un seul tableau de bord. Le premier SaaS immobilier pensé pour l&apos;Algérie.
          </p>
        </div>
        <Link
          href="/pro"
          className="shrink-0 inline-flex items-center gap-2 h-12 px-8 bg-accent-400 text-primary-900 text-body-sm font-semibold rounded-lg hover:bg-accent-300 transition-colors"
        >
          Découvrir AqarPro <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-white/5 py-16 px-6">
      <div className="max-w-content-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          {[
            {
              title: 'AqarSearch',
              links: ['Rechercher un bien', 'Alertes de recherche', 'Mes favoris', 'Prix du marché'],
              hrefs: ['/recherche', '/alertes', '/favoris', '/prix-immobilier'],
            },
            {
              title: 'AqarPro',
              links: ['Espace professionnel', 'Annuaire agences', 'Tarifs', 'Créer une agence'],
              hrefs: ['/pro', '/agences', '/pricing', '/signup'],
            },
            {
              title: 'AqarVision',
              links: ['À propos', 'Confidentialité', 'Conditions d\'utilisation', 'Contact'],
              hrefs: ['#', '#', '#', '#'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-body-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link, i) => (
                  <li key={link}>
                    <Link href={col.hrefs[i]} className="text-body-sm text-neutral-400 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-800 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-accent-400" />
            </div>
            <span className="font-display text-white text-sm">AqarVision</span>
          </div>
          <p className="text-caption text-neutral-500">
            © {new Date().getFullYear()} AqarVision. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PopularCities />
        <ProBanner />
      </main>
      <Footer />
    </>
  );
}
