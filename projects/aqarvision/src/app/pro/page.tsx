import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Building2, ArrowRight, Search, Shield, Users, BarChart3,
  Zap, Globe2, CheckCircle2, MessageSquare, Star, Layers,
  Smartphone, Palette, FileSpreadsheet, Calendar,
} from 'lucide-react';
import { PLAN_CONFIGS, TRIAL_DURATION_DAYS } from '@/config';

export const metadata: Metadata = {
  title: 'AqarPro — Le SaaS immobilier pour les agences en Algérie',
  description:
    'Publiez vos annonces, gérez vos leads et développez votre agence immobilière avec AqarPro. Le premier SaaS immobilier pensé pour le marché algérien.',
};

/* ─── Data ─────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Globe2,
    title: 'Vitrine agence en ligne',
    desc: 'Votre mini-site personnalisé avec votre branding, vos annonces et vos coordonnées. Prêt en 5 minutes.',
  },
  {
    icon: Users,
    title: 'CRM & gestion de leads',
    desc: 'Pipeline visuel Kanban, scoring automatique, notes internes et suivi du premier contact à la conversion.',
  },
  {
    icon: BarChart3,
    title: 'Analytics avancés',
    desc: 'Suivez les vues, clics, leads et conversions. Identifiez vos meilleures annonces et optimisez votre ROI.',
  },
  {
    icon: Zap,
    title: 'Publication assistée par IA',
    desc: 'Générez titres et descriptions en un clic grâce à l\'IA. Publiez un bien en moins de 2 minutes.',
  },
  {
    icon: Shield,
    title: 'Badge agence vérifiée',
    desc: 'Gagnez la confiance des acheteurs avec le badge "Agence vérifiée" affiché sur toutes vos annonces.',
  },
  {
    icon: MessageSquare,
    title: 'Messagerie intégrée',
    desc: 'Recevez et répondez aux messages des prospects directement depuis votre tableau de bord.',
  },
  {
    icon: Palette,
    title: 'Branding personnalisé',
    desc: 'Logo, couleurs, slogan — votre vitrine reflète votre identité. Templates luxury pour les plans Enterprise.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Export CSV des leads',
    desc: 'Exportez vos contacts au format CSV pour vos outils externes. Compatible Excel et Google Sheets.',
  },
  {
    icon: Layers,
    title: 'Gestion d\'équipe',
    desc: 'Invitez vos agents et attribuez des rôles (admin, agent, viewer). Chacun voit ce qui le concerne.',
  },
  {
    icon: Smartphone,
    title: 'Responsive & PWA',
    desc: 'Gérez votre agence depuis votre téléphone. L\'interface s\'adapte à tous les écrans.',
  },
  {
    icon: Calendar,
    title: 'Notifications en temps réel',
    desc: 'Soyez alerté dès qu\'un nouveau lead arrive, qu\'un bien atteint un palier de vues, ou qu\'un membre rejoint.',
  },
  {
    icon: Star,
    title: 'Score de confiance',
    desc: 'Chaque annonce reçoit un score (0-100) basé sur la qualité des photos, la description et votre profil agence.',
  },
];

const PLANS = [
  {
    id: 'starter' as const,
    popular: false,
  },
  {
    id: 'pro' as const,
    popular: true,
  },
  {
    id: 'enterprise' as const,
    popular: false,
  },
];

/* ─── Navbar (reprise légère) ───────────────────────────────────── */

function ProNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bleu-nuit/95 backdrop-blur-sm border-b border-white/10 h-[72px] flex items-center">
      <div className="w-full max-w-content-xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-or/20 border border-accent-400/30 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-or" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-vitrine text-xl text-white tracking-tight">AqarPro</span>
            <span className="text-caption text-white/40">by AqarVision</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-body-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center h-9 px-4 text-body-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center h-9 px-5 bg-or text-bleu-nuit text-body-sm font-semibold rounded-lg hover:bg-or/90 transition-colors"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────── */

function ProHero() {
  return (
    <section className="relative pt-[72px] bg-bleu-nuit overflow-hidden">
      <div className="max-w-content mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-or/10 border border-accent-400/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-caption text-or font-semibold">{TRIAL_DURATION_DAYS} jours d&apos;essai gratuit — sans engagement</span>
        </div>

        <h1 className="font-vitrine text-display-xl text-white mb-5 leading-tight max-w-3xl mx-auto">
          Le tableau de bord<br />
          <span className="text-or">que votre agence mérite</span>
        </h1>

        <p className="text-body-lg text-white/50 max-w-xl mx-auto mb-10">
          Publiez vos annonces, recevez des leads qualifiés, suivez vos performances
          et gérez votre équipe — tout depuis un seul espace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-12 px-8 bg-or text-bleu-nuit text-body-sm font-semibold rounded-lg hover:bg-or/90 transition-colors"
          >
            Créer mon agence gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 h-12 px-8 border border-white/20 text-white text-body-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            Voir les tarifs
          </a>
        </div>

        {/* Stats crédibilité */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[
            { value: '320+', label: 'Agences' },
            { value: '12 000+', label: 'Annonces' },
            { value: '48', label: 'Wilayas' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-vitrine text-heading-lg text-or">{s.value}</div>
              <div className="text-caption text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─────────────────────────────────────────────────── */

function ProFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-content-xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-caption font-bold text-or uppercase tracking-widest mb-3 block">Fonctionnalités</span>
          <h2 className="font-vitrine text-display-md text-bleu-nuit mb-4">
            Tout ce dont votre agence a besoin
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Un outil complet pour gérer votre activité immobilière au quotidien,
            du premier contact à la signature.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-xl border border-neutral-100 hover:border-accent-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-or" />
              </div>
              <div>
                <h3 className="text-heading-sm text-bleu-nuit mb-1">{title}</h3>
                <p className="text-body-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ──────────────────────────────────────────────────── */

function formatPrice(amount: number): string {
  if (amount === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-DZ').format(amount);
}

function ProPricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-neutral-50">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-caption font-bold text-or uppercase tracking-widest mb-3 block">Tarifs</span>
          <h2 className="font-vitrine text-display-md text-bleu-nuit mb-4">
            Des plans adaptés à chaque agence
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Commencez gratuitement avec {TRIAL_DURATION_DAYS} jours d&apos;essai sur le plan Pro. Aucun engagement, aucune carte requise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(({ id, popular }) => {
            const config = PLAN_CONFIGS[id];
            const limits = config.limits;
            const price = config.pricing.monthlyDZD;

            return (
              <div
                key={id}
                className={[
                  'relative flex flex-col rounded-2xl border p-8',
                  popular
                    ? 'border-accent-400 bg-white shadow-lg scale-[1.02]'
                    : 'border-neutral-200 bg-white',
                ].join(' ')}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-or text-bleu-nuit text-caption font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}

                <h3 className="font-vitrine text-heading-lg text-bleu-nuit mb-1">{config.name}</h3>
                <p className="text-body-sm text-muted-foreground mb-6">{config.description}</p>

                <div className="mb-6">
                  <span className="font-vitrine text-display-sm text-bleu-nuit">
                    {formatPrice(price)}
                  </span>
                  {price > 0 && <span className="text-body-sm text-muted-foreground ml-1">DA/mois</span>}
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className="h-4 w-4 text-accent-500 shrink-0" />
                    {limits.maxProperties === Infinity ? 'Biens illimités' : `${limits.maxProperties} biens`}
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className="h-4 w-4 text-accent-500 shrink-0" />
                    {limits.maxLeadsPerMonth === Infinity ? 'Leads illimités' : `${limits.maxLeadsPerMonth} leads/mois`}
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className="h-4 w-4 text-accent-500 shrink-0" />
                    {limits.maxMembers} membre{limits.maxMembers > 1 ? 's' : ''}
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${limits.advancedAnalytics ? 'text-accent-500' : 'text-neutral-300'}`} />
                    <span className={limits.advancedAnalytics ? '' : 'text-muted-foreground'}>Analytics avancés</span>
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${limits.exportLeads ? 'text-accent-500' : 'text-neutral-300'}`} />
                    <span className={limits.exportLeads ? '' : 'text-muted-foreground'}>Export CSV</span>
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${limits.luxuryBranding ? 'text-accent-500' : 'text-neutral-300'}`} />
                    <span className={limits.luxuryBranding ? '' : 'text-muted-foreground'}>Branding luxury</span>
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-neutral-700">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${limits.customDomain ? 'text-accent-500' : 'text-neutral-300'}`} />
                    <span className={limits.customDomain ? '' : 'text-muted-foreground'}>Domaine personnalisé</span>
                  </li>
                </ul>

                <Link
                  href={id === 'enterprise' ? '#contact' : '/signup'}
                  className={[
                    'inline-flex items-center justify-center gap-2 h-11 px-6 text-body-sm font-semibold rounded-xl transition-colors',
                    popular
                      ? 'bg-or text-bleu-nuit hover:bg-or/90'
                      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
                  ].join(' ')}
                >
                  {id === 'enterprise' ? 'Nous contacter' : 'Commencer'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-body-sm text-muted-foreground mt-8">
          Paiement par CCP, BaridiMob, Dahabia ou virement bancaire. Remise de 10% au trimestre, 20% à l&apos;année.
        </p>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'L\'essai gratuit est-il vraiment sans engagement ?',
    a: `Oui. Vous bénéficiez de ${TRIAL_DURATION_DAYS} jours d'essai sur le plan Pro sans aucune carte bancaire ni paiement requis. À la fin de l'essai, vous passez automatiquement au plan Starter gratuit.`,
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Nous acceptons les paiements par CCP, BaridiMob, Dahabia et virement bancaire. Tous les prix sont en Dinars algériens (DA).',
  },
  {
    q: 'Puis-je changer de plan à tout moment ?',
    a: 'Oui, vous pouvez upgrader ou downgrader à tout moment depuis votre tableau de bord. Le changement prend effet immédiatement.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Vos données sont hébergées sur des serveurs sécurisés (Supabase) avec chiffrement en transit et au repos. Chaque agence a un espace isolé.',
  },
  {
    q: 'Comment obtenir le badge "Agence vérifiée" ?',
    a: 'Soumettez votre registre de commerce et une pièce d\'identité depuis votre tableau de bord. La vérification est gratuite et prend 24-48h.',
  },
];

function ProFAQ() {
  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-content mx-auto max-w-2xl">
        <div className="text-center mb-16">
          <span className="text-caption font-bold text-or uppercase tracking-widest mb-3 block">FAQ</span>
          <h2 className="font-vitrine text-display-md text-bleu-nuit">
            Questions fréquentes
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="border-b border-neutral-100 pb-6">
              <h3 className="text-heading-sm text-bleu-nuit mb-2">{q}</h3>
              <p className="text-body-md text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Final ────────────────────────────────────────────────── */

function ProCTA() {
  return (
    <section className="py-20 px-6 bg-bleu-nuit">
      <div className="max-w-content mx-auto text-center">
        <h2 className="font-vitrine text-display-md text-white mb-4">
          Prêt à développer votre agence ?
        </h2>
        <p className="text-body-lg text-white/50 max-w-lg mx-auto mb-8">
          Rejoignez les 320+ agences qui utilisent AqarPro pour gérer
          leur activité immobilière en Algérie.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 h-12 px-8 bg-or text-bleu-nuit text-body-sm font-semibold rounded-lg hover:bg-or/90 transition-colors"
          >
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-8 border border-white/20 text-white text-body-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
          >
            <Search className="h-4 w-4" /> Retour à AqarSearch
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer Pro ───────────────────────────────────────────────── */

function ProFooter() {
  return (
    <footer className="bg-bleu-nuit border-t border-white/5 py-10 px-6">
      <div className="max-w-content-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-bleu-nuit rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-or" />
          </div>
          <span className="font-vitrine text-white text-sm">AqarPro</span>
          <span className="text-caption text-white/30">by AqarVision</span>
        </div>
        <div className="flex items-center gap-4 text-body-sm text-muted-foreground">
          <Link href="/" className="hover:text-white transition-colors">AqarSearch</Link>
          <Link href="/agences" className="hover:text-white transition-colors">Annuaire</Link>
          <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function ProPage() {
  return (
    <>
      <ProNavbar />
      <main>
        <ProHero />
        <ProFeatures />
        <ProPricing />
        <ProFAQ />
        <ProCTA />
      </main>
      <ProFooter />
    </>
  );
}
