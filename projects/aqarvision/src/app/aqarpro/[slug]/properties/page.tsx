import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Plus,
  Eye,
  Archive,
  FileText,
  MapPin,
  Maximize2,
  BedDouble,
  MoreHorizontal,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { PropertyActions } from './property-actions';
import { getPlanConfig } from '@/config';

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  draft:    { label: 'Brouillon', dot: 'bg-neutral-400' },
  active:   { label: 'Actif',     dot: 'bg-emerald-500' },
  sold:     { label: 'Vendu',     dot: 'bg-blue-500' },
  rented:   { label: 'Loué',      dot: 'bg-violet-500' },
  archived: { label: 'Archivé',   dot: 'bg-neutral-300' },
};

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = { DZD: 'DA', EUR: '€', USD: '$', GBP: '£' };
  const symbol = symbols[currency] || currency;
  return `${price.toLocaleString('fr-FR')} ${symbol}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)}sem`;
  return `Il y a ${Math.floor(days / 30)}mois`;
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('id, active_plan')
    .eq('owner_id', user.id)
    .single();

  if (!agency) {
    return <p className="text-body-sm text-error-600">Agence introuvable.</p>;
  }

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('agency_id', agency.id)
    .order('created_at', { ascending: false });

  const all = properties ?? [];
  const planConfig = getPlanConfig(agency.active_plan ?? 'starter');
  const propLimit = planConfig.limits.maxProperties;

  const activeCount   = all.filter(p => p.status === 'active').length;
  const draftCount    = all.filter(p => p.status === 'draft').length;
  const archivedCount = all.filter(p => ['sold', 'rented', 'archived'].includes(p.status)).length;
  const totalViews    = all.reduce((sum, p) => sum + (p.views_count ?? 0), 0);

  const usagePercent = propLimit === Infinity ? 0 : Math.round((activeCount / propLimit) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-neutral-900">Biens immobiliers</h1>
          <p className="mt-0.5 text-body-sm text-neutral-500">
            {all.length} bien{all.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href={`/aqarpro/${slug}/properties/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-body-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un bien
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Home}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Actifs"
          value={activeCount}
          sub={propLimit === Infinity ? undefined : `sur ${propLimit}`}
        />
        <StatCard
          icon={FileText}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Brouillons"
          value={draftCount}
        />
        <StatCard
          icon={Archive}
          iconBg="bg-neutral-50"
          iconColor="text-neutral-500"
          label="Archivés"
          value={archivedCount}
        />
        <StatCard
          icon={Eye}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          label="Vues totales"
          value={totalViews}
        />
      </div>

      {/* ── Usage bar (if plan has limit) ── */}
      {propLimit !== Infinity && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between text-caption">
            <span className="font-medium text-neutral-700">
              Utilisation du plan ({activeCount}/{propLimit} biens actifs)
            </span>
            <span className={`font-semibold ${usagePercent >= 90 ? 'text-error-600' : usagePercent >= 70 ? 'text-warning-600' : 'text-emerald-600'}`}>
              {usagePercent}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-error-500' : usagePercent >= 70 ? 'bg-warning-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Properties grid ── */}
      {all.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {all.map((property) => {
            const status = STATUS_CONFIG[property.status] || STATUS_CONFIG.draft;
            const hasImage = property.images?.[0];

            return (
              <div
                key={property.id}
                className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-lg"
              >
                {/* Image / Placeholder */}
                <div className="relative aspect-[16/10] bg-neutral-100">
                  {hasImage ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Home className="h-8 w-8 text-neutral-300" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Status badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                    <div className={`h-2 w-2 rounded-full ${status.dot}`} />
                    <span className="text-[11px] font-semibold text-neutral-700">{status.label}</span>
                  </div>

                  {/* Transaction type */}
                  <div className="absolute right-3 top-3">
                    <span className="rounded-md bg-primary-600/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
                    </span>
                  </div>

                  {/* Views on hover */}
                  {(property.views_count ?? 0) > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <Eye className="h-3 w-3" />
                      {property.views_count}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-body-sm font-semibold text-neutral-900">
                        {property.title}
                      </h3>
                      {(property.city || property.wilaya) && (
                        <p className="mt-0.5 flex items-center gap-1 text-caption text-neutral-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {[property.city, property.wilaya].filter(Boolean).join(', ')}
                          </span>
                        </p>
                      )}
                    </div>
                    <PropertyActions propertyId={property.id} propertyTitle={property.title} />
                  </div>

                  {/* Specs row */}
                  <div className="mt-3 flex items-center gap-3 text-caption text-neutral-500">
                    <span className="capitalize">{property.type}</span>
                    {property.surface && (
                      <>
                        <span className="text-neutral-200">|</span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="h-3 w-3" /> {property.surface} m²
                        </span>
                      </>
                    )}
                    {property.rooms && (
                      <>
                        <span className="text-neutral-200">|</span>
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" /> {property.rooms}p
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price + date */}
                  <div className="mt-3 flex items-end justify-between border-t border-neutral-100 pt-3">
                    <p className="text-body-sm font-bold text-primary-600">
                      {formatPrice(property.price, property.currency)}
                      {property.transaction_type === 'rent' && (
                        <span className="text-caption font-normal text-neutral-400">/mois</span>
                      )}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock className="h-3 w-3" />
                      {timeAgo(property.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-gradient-to-br from-white to-neutral-50 px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Home className="h-7 w-7 text-primary-400" />
          </div>
          <h3 className="text-body-md font-semibold text-neutral-900">
            Aucun bien pour le moment
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-body-sm text-neutral-500">
            Commencez à publier vos biens immobiliers pour qu&apos;ils apparaissent sur votre vitrine en ligne.
          </p>
          <Link
            href={`/aqarpro/${slug}/properties/new`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-body-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Ajouter votre premier bien
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Stat card ── */

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-caption text-neutral-500">{label}</p>
        <p className="text-heading-md font-bold text-neutral-900">
          {value.toLocaleString('fr-FR')}
          {sub && <span className="ml-1 text-caption font-normal text-neutral-400">{sub}</span>}
        </p>
      </div>
    </div>
  );
}
