'use client';

import { useTransition } from 'react';
import { Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { clearSearchHistory } from '@/lib/actions/search-history';
import type { SearchHistory } from '@/types/database';

const FILTER_LABELS: Record<string, string> = {
  transaction_type: 'Type',
  country: 'Pays',
  wilaya: 'Wilaya',
  commune: 'Commune',
  city: 'Ville',
  property_type: 'Type bien',
  price_min: 'Prix min',
  price_max: 'Prix max',
  surface_min: 'Surface min',
  surface_max: 'Surface max',
  rooms_min: 'Pièces min',
};

const TX_LABELS: Record<string, string> = {
  sale: 'Vente',
  rent: 'Location',
};

interface RecherchesContentProps {
  history: SearchHistory[];
}

export function RecherchesContent({ history }: RecherchesContentProps) {
  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    startTransition(async () => {
      await clearSearchHistory();
    });
  };

  const buildSearchUrl = (entry: SearchHistory) => {
    const params = new URLSearchParams();
    if (entry.query_text) params.set('q', entry.query_text);
    if (entry.filters && typeof entry.filters === 'object') {
      const filters = entry.filters as Record<string, string>;
      for (const [key, value] of Object.entries(filters)) {
        if (value && key !== 'page' && key !== 'sort') {
          params.set(key, String(value));
        }
      }
    }
    return `/recherche?${params.toString()}`;
  };

  const getFilterTags = (filters: Record<string, unknown>): string[] => {
    const tags: string[] = [];
    for (const [key, value] of Object.entries(filters)) {
      if (!value || key === 'page' || key === 'sort') continue;
      const label = FILTER_LABELS[key] || key;
      const displayValue = key === 'transaction_type'
        ? TX_LABELS[String(value)] || String(value)
        : String(value);
      tags.push(`${label}: ${displayValue}`);
    }
    return tags;
  };

  // Group by date
  const grouped = groupByDate(history);

  return (
    <div className={isPending ? 'opacity-50' : ''}>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleClear}
          disabled={isPending}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          Effacer l&apos;historique
        </button>
      </div>

      {Object.entries(grouped).map(([dateLabel, entries]) => (
        <div key={dateLabel} className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">{dateLabel}</h3>
          <div className="space-y-2">
            {entries.map((entry) => {
              const tags = entry.filters ? getFilterTags(entry.filters as Record<string, unknown>) : [];
              return (
                <Link
                  key={entry.id}
                  href={buildSearchUrl(entry)}
                  className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {entry.query_text || 'Recherche avec filtres'}
                      </p>
                      {tags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="shrink-0 text-xs text-gray-400">
                    {new Date(entry.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDate(items: SearchHistory[]): Record<string, SearchHistory[]> {
  const groups: Record<string, SearchHistory[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const item of items) {
    const date = new Date(item.created_at);
    let label: string;

    if (date.toDateString() === today.toDateString()) {
      label = "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Hier';
    } else {
      label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }

  return groups;
}
