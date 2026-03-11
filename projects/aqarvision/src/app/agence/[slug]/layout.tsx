import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LuxuryLayout } from '@/components/agency/luxury-layout';
import { AgencyJsonLd } from '@/components/seo/json-ld';
import { WhatsAppButton } from '@/components/agency/whatsapp-button';
import { getAgencyBySlug } from '@/lib/queries/agency';
import { getLocaleAttrs, getTranslations } from '@/lib/i18n';
import { CACHE, PLANS } from '@/config';
import { Building2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aqarvision.dz';

interface AgencyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgencyLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    const t = getTranslations('fr');
    return { title: t('error.agencyNotFound') };
  }

  const description = agency.description
    || `${agency.name} — Agence immobilière${agency.wilaya ? ` à ${agency.wilaya}` : ''}, Algérie`;

  return {
    title: {
      default: agency.name,
      template: `%s | ${agency.name}`,
    },
    description,
    openGraph: {
      title: agency.name,
      description,
      type: 'website',
      ...(agency.cover_image_url && { images: [{ url: agency.cover_image_url, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: agency.name,
      description,
    },
  };
}

export const revalidate = CACHE.PAGE_REVALIDATE;

function getFontClass(fontStyle: string | null): string {
  switch (fontStyle) {
    case 'classic': return 'agency-font-classic';
    case 'elegant': return 'agency-font-elegant';
    default: return 'agency-font-modern';
  }
}

export default async function AgencyLayout({ children, params }: AgencyLayoutProps) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) notFound();

  const localeAttrs = getLocaleAttrs(agency.locale ?? 'fr');
  const jsonLd = <AgencyJsonLd agency={agency} baseUrl={BASE_URL} />;

  // Enterprise → Luxury Layout
  if (agency.active_plan === PLANS.ENTERPRISE) {
    return (
      <div dir={localeAttrs.dir} lang={localeAttrs.lang}>
        {jsonLd}
        <LuxuryLayout agency={agency}>{children}</LuxuryLayout>
      </div>
    );
  }

  // Starter / Pro → Layout professionnel avec theming
  const t = getTranslations(agency.locale ?? 'fr');
  const primaryColor = agency.primary_color || '#234E6F';
  const accentColor = agency.accent_color || primaryColor;
  const borderClass = agency.border_style === 'square' ? 'agency-border-square' : 'agency-border-rounded';
  const fontClass = getFontClass(agency.font_style);

  const navItems = [
    { label: t('nav.home'), href: `/agence/${slug}` },
    { label: t('nav.properties'), href: `/agence/${slug}/biens` },
    { label: t('nav.about'), href: `/agence/${slug}/a-propos` },
    { label: t('nav.contact'), href: `/agence/${slug}/contact` },
  ];

  const socialLinks = [
    agency.facebook_url && { label: 'Facebook', href: agency.facebook_url },
    agency.instagram_url && { label: 'Instagram', href: agency.instagram_url },
    agency.tiktok_url && { label: 'TikTok', href: agency.tiktok_url },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div
      className={`agency-theme ${fontClass} ${borderClass} min-h-screen flex flex-col bg-neutral-50`}
      dir={localeAttrs.dir}
      lang={localeAttrs.lang}
      style={{
        '--agency-primary': primaryColor,
        '--agency-accent': accentColor,
        '--agency-secondary': agency.secondary_color || '#e2e8f0',
      } as React.CSSProperties}
    >
      {jsonLd}

      {/* ── Header ── */}
      <header className="header-glass sticky top-0 z-20">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          <Link href={`/agence/${slug}`} className="flex items-center gap-3 group">
            {agency.logo_url ? (
              <Image
                src={agency.logo_url}
                alt={agency.name}
                width={36}
                height={36}
                className="object-cover"
                style={{ borderRadius: 'var(--agency-radius-sm)' }}
                unoptimized
              />
            ) : (
              <div
                className="w-9 h-9 flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor, borderRadius: 'var(--agency-radius-sm)' }}
              >
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div>
              <span className="text-body-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {agency.name}
              </span>
              {agency.wilaya && (
                <p className="text-caption text-neutral-400">{agency.wilaya}</p>
              )}
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-body-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="flex sm:hidden items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-caption font-medium text-neutral-600 hover:text-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="h-0.5 w-full" style={{ backgroundColor: accentColor }} />

        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Agency info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                {agency.logo_url ? (
                  <Image
                    src={agency.logo_url}
                    alt=""
                    width={32}
                    height={32}
                    className="object-cover"
                    style={{ borderRadius: 'var(--agency-radius-sm)' }}
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-8 h-8 flex items-center justify-center text-white"
                    style={{ backgroundColor: accentColor, borderRadius: 'var(--agency-radius-sm)' }}
                  >
                    <Building2 className="h-4 w-4" />
                  </div>
                )}
                <span className="text-body-sm font-semibold text-neutral-900">{agency.name}</span>
              </div>
              {agency.slogan && (
                <p className="text-caption text-neutral-500">{agency.slogan}</p>
              )}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
                      title={link.label}
                    >
                      <span className="text-[10px] font-bold uppercase">{link.label.slice(0, 2)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div>
              <p className="text-caption font-semibold text-neutral-900 uppercase tracking-wider mb-3">Navigation</p>
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-2">
              <p className="text-caption font-semibold text-neutral-900 uppercase tracking-wider mb-3">Contact</p>
              <ul className="flex flex-col gap-2.5">
                {agency.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    <a href={`tel:${agency.phone}`} className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {agency.phone}
                    </a>
                  </li>
                )}
                {agency.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    <a href={`mailto:${agency.email}`} className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {agency.email}
                    </a>
                  </li>
                )}
                {agency.address && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    <span className="text-body-sm text-neutral-500">{agency.address}</span>
                  </li>
                )}
                {agency.website && (
                  <li className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {agency.website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-caption text-neutral-400">
              &copy; {new Date().getFullYear()} {agency.name}. {t('footer.rights')}
            </p>
            <p className="text-caption text-neutral-300">
              Propulsé par <Link href="/" className="text-neutral-400 hover:text-primary-600 transition-colors">AqarVision</Link>
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton agency={agency} />
    </div>
  );
}
