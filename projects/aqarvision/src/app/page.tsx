import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight, Search, Star, Shield, Users, ChevronRight } from 'lucide-react';
import { SearchBar } from '@/components/search/search-bar';
import { Suspense } from 'react';

/* ─── Data ───────────────────────────────────────────────────────── */

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

const TRANSACTION_TYPES = [
  {
    type: 'rent-long',
    label: 'Location longue durée',
    description: 'Appartements, villas et studios à louer à l\'année partout en Algérie.',
    icon: '🏠',
    border: 'border-primary-300 hover:border-primary-500',
    iconBg: 'bg-primary-100',
    href: '/recherche?transaction_type=rent',
    cta: 'Voir les locations',
  },
  {
    type: 'rent-short',
    label: 'Location courte durée',
    description: 'Logements meublés pour vos déplacements, vacances ou séjours temporaires.',
    icon: '🌴',
    border: 'border-amber-300 hover:border-amber-500',
    iconBg: 'bg-amber-100',
    href: '/recherche?transaction_type=rent&short_term=1',
    cta: 'Réserver un logement',
  },
  {
    type: 'buy',
    label: 'Achat immobilier',
    description: 'Trouvez votre bien idéal parmi des milliers d\'annonces vérifiées sur tout le territoire.',
    icon: '🔑',
    border: 'border-green-300 hover:border-green-500',
    iconBg: 'bg-green-100',
    href: '/recherche?transaction_type=sale',
    cta: 'Explorer les biens',
  },
];

/* ─── Navbar ─────────────────────────────────────────────────────── */

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200 h-[72px] flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-8 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl text-primary-900 tracking-tight">Aqar</span>
            <span className="text-neutral-400" style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Vision</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-body-sm text-neutral-600">
          <Link href="/recherche?transaction_type=rent" className="hover:text-primary-700 transition-colors">Location</Link>
          <Link href="/recherche?transaction_type=sale" className="hover:text-primary-700 transition-colors">Achat</Link>
          <Link href="/agences" className="hover:text-primary-700 transition-colors">Agences</Link>
          <Link href="/recherche?country=ES" className="hover:text-primary-700 transition-colors">International</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/recherches"
            className="hidden sm:inline-flex items-center gap-1.5 text-body-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            Mes recherches
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-9 px-4 bg-primary-600 text-white text-body-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            Espace agence
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[80vh] pt-[72px]"
      style={{ background: 'linear-gradient(150deg, #0A1929 0%, #0D2D52 55%, #0F3D72 100%)' }}
    >
      {/* Algerian flag accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]">
        <div className="h-full w-full flex">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-green-600" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 max-w-[900px] mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-caption text-white/80">🇩🇿 Plateforme immobilière — 48 wilayas d'Algérie</span>
        </div>

        <h1 className="font-display text-display-xl text-white mb-4 leading-tight">
          Votre prochain logement<br />
          <span className="text-primary-300">commence ici</span>
        </h1>
        <p className="text-body-lg text-white/70 mb-10 max-w-xl">
          Location longue durée, courte durée, achat — des milliers d'annonces
          vérifiées partout en Algérie.
        </p>

        <Suspense fallback={null}>
          <SearchBar variant="hero" />
        </Suspense>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { label: 'Appartements Alger',  href: '/recherche?q=Alger&type=appartement' },
            { label: 'Villas Oran',          href: '/recherche?q=Oran&type=villa' },
            { label: 'Studios Constantine',  href: '/recherche?q=Constantine' },
            { label: 'Terrains Tizi-Ouzou', href: '/recherche?q=Tizi-Ouzou&type=terrain' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-caption text-white/60 hover:text-white/90 transition-colors border border-white/20 rounded-full px-3 py-1 hover:border-white/40"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-xl text-white">{s.value}</div>
              <div className="text-caption text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Transaction Types ──────────────────────────────────────────── */

function TransactionTypes() {
  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display text-display-md text-neutral-900 mb-3">Que cherchez-vous ?</h2>
        <p className="text-body-lg text-neutral-500 max-w-lg mx-auto">
          Que ce soit pour habiter, investir ou passer un séjour, trouvez exactement ce qu'il vous faut.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {TRANSACTION_TYPES.map(t => (
          <Link
            key={t.type}
            href={t.href}
            className={`group flex flex-col p-8 rounded-2xl border-2 bg-white transition-all hover:shadow-lg ${t.border}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${t.iconBg} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
              {t.icon}
            </div>
            <h3 className="font-display text-display-sm text-neutral-900 mb-2">{t.label}</h3>
            <p className="text-body-md text-neutral-500 flex-1 mb-5">{t.description}</p>
            <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary-700 group-hover:gap-3 transition-all">
              {t.cta} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      {/* Vente CTA */}
      <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">🤝</div>
          <div>
            <h3 className="text-heading-md text-neutral-900">Vous souhaitez vendre un bien ?</h3>
            <p className="text-body-sm text-neutral-500">
              Mettez-vous en relation directe avec une agence référencée. Estimation gratuite, accompagnement personnalisé.
            </p>
          </div>
        </div>
        <Link
          href="/agences"
          className="shrink-0 inline-flex items-center gap-2 h-11 px-6 bg-neutral-900 text-white text-body-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          Trouver une agence <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─── Popular Cities ─────────────────────────────────────────────── */

function PopularCities() {
  return (
    <section className="py-20 px-6 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="font-display text-display-md text-neutral-900 mb-3 text-center">Explorer par ville</h2>
        <p className="text-body-lg text-neutral-500 text-center mb-10">Des annonces dans toutes les wilayas d'Algérie</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CITIES.map(city => (
            <Link
              key={city.name}
              href={`/recherche?q=${encodeURIComponent(city.name)}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/2] block shadow-sm"
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
      </div>
    </section>
  );
}

/* ─── International Banner ───────────────────────────────────────── */

function InternationalBanner() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0A1929 0%, #0D3B6B 100%)' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
                <span className="text-caption text-white/80">🌍 Annonces à l'international</span>
              </div>
              <h2 className="font-display text-display-md text-white mb-3">
                Immobilier en Espagne,<br className="hidden md:block" /> France et Dubai
              </h2>
              <p className="text-body-lg text-white/70 max-w-lg">
                Les Algériens peuvent publier et consulter des annonces immobilières à l'étranger.
                Diaspora, investissement, résidence secondaire.
              </p>
            </div>
            <Link
              href="/recherche"
              className="shrink-0 inline-flex items-center gap-2 h-12 px-8 bg-white text-primary-900 text-body-md font-semibold rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
            >
              Voir les annonces <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Why Us ─────────────────────────────────────────────────────── */

function WhyUs() {
  const points = [
    { icon: Shield, title: 'Annonces vérifiées',  desc: 'Toutes les annonces sont contrôlées avant publication.' },
    { icon: Users,  title: 'Agences référencées', desc: 'Accédez aux meilleures agences de votre wilaya.' },
    { icon: Search, title: 'Recherche avancée',   desc: 'Filtrez par surface, prix, wilaya, type de bien et plus.' },
    { icon: Star,   title: '100% gratuit',         desc: 'La consultation des annonces est gratuite pour les acheteurs.' },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="font-display text-display-md text-neutral-900 text-center mb-12">Pourquoi choisir Aqar ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {points.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-heading-sm text-neutral-900 mb-2">{title}</h3>
              <p className="text-body-sm text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Agency CTA ─────────────────────────────────────────────────── */

function AgencyCTA() {
  return (
    <section className="py-16 px-6 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shrink-0">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="font-display text-display-sm text-neutral-900 mb-1">Vous êtes une agence immobilière ?</h2>
            <p className="text-body-md text-neutral-500">
              Gérez vos annonces, recevez vos leads et développez votre visibilité avec AqarPro.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/pricing" className="h-11 px-5 border border-neutral-300 text-body-sm font-medium text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors inline-flex items-center">
            Voir les tarifs
          </Link>
          <Link href="/signup" className="h-11 px-6 bg-primary-600 text-white text-body-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
            Créer mon espace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-primary-900 py-16 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {[
            {
              title: 'Chercher',
              links: ['Location longue durée', 'Location courte durée', 'Acheter un bien', 'Biens à la une'],
              hrefs: ['/recherche?transaction_type=rent', '/recherche?transaction_type=rent&short_term=1', '/recherche?transaction_type=sale', '/recherche?featured=1'],
            },
            {
              title: 'International',
              links: ['Immobilier Espagne', 'Immobilier France', 'Immobilier Dubai', 'Toutes destinations'],
              hrefs: ['/recherche?country=ES', '/recherche?country=FR', '/recherche?country=AE', '/recherche'],
            },
            {
              title: 'Agences',
              links: ['Annuaire agences', 'AqarPro', 'Créer un compte', 'Tarifs'],
              hrefs: ['/agences', '/dashboard', '/signup', '/pricing'],
            },
            {
              title: 'Légal',
              links: ['À propos', 'Confidentialité', 'Conditions', 'Contact'],
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-white">AqarSearch</span>
          </div>
          <p className="text-caption text-neutral-500">
            © {new Date().getFullYear()} AqarVision. Tous droits réservés. · Plateforme immobilière algérienne
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TransactionTypes />
        <PopularCities />
        <InternationalBanner />
        <WhyUs />
        <AgencyCTA />
      </main>
      <Footer />
    </>
  );
}
