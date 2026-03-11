'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

interface SearchBarProps {
  variant?: 'hero' | 'nav';
  defaultValues?: {
    location?: string;
    type?: string;
    maxPrice?: string;
  };
}

const PROPERTY_TYPES = [
  { value: '', label: 'Tous types' },
  { value: 'villa', label: 'Villa' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'riad', label: 'Riad' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'commercial', label: 'Commercial' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'Tous prix' },
  { value: '500000', label: '< 500K MAD' },
  { value: '1000000', label: '< 1M MAD' },
  { value: '2000000', label: '< 2M MAD' },
  { value: '5000000', label: '< 5M MAD' },
  { value: '10000000', label: '< 10M MAD' },
];

export function SearchBar({ variant = 'hero', defaultValues = {} }: SearchBarProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(defaultValues.location ?? searchParams.get('q') ?? '');
  const [type, setType]         = useState(defaultValues.type ?? searchParams.get('type') ?? '');
  const [maxPrice, setMaxPrice] = useState(defaultValues.maxPrice ?? searchParams.get('maxPrice') ?? '');
  const [focused, setFocused]   = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('q', location);
    if (type)     params.set('type', type);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');
    router.push(`/recherche?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  /* ── Nav (condensed) variant ── */
  if (variant === 'nav') {
    return (
      <div className="flex items-center bg-white border border-neutral-300 rounded-full shadow-sm overflow-hidden h-12 max-w-[560px] w-full hover:shadow-md transition-shadow">
        <input
          type="text"
          placeholder="Où cherchez-vous ?"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 text-body-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent"
        />
        <button
          onClick={handleSearch}
          className="w-10 h-10 m-1 bg-or rounded-full flex items-center justify-center hover:bg-bleu-nuit/90 transition-colors shrink-0"
          aria-label="Rechercher"
        >
          <Search className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  /* ── Hero variant — pill with 3 sections ── */
  return (
    <div className="w-full max-w-[720px] mx-auto">
      <div className="flex items-stretch bg-white rounded-full shadow-lg overflow-hidden h-16">
        {/* Location */}
        <div
          className={[
            'flex-1 flex items-center gap-2 px-6 cursor-text transition-colors',
            focused === 'location' ? 'bg-muted/50' : 'hover:bg-muted',
          ].join(' ')}
          onClick={() => document.getElementById('search-location')?.focus()}
        >
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0 w-full">
            <span className="text-caption text-muted-foreground">Ville ou quartier</span>
            <input
              id="search-location"
              type="text"
              placeholder="Marrakech…"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused('location')}
              onBlur={() => setFocused(null)}
              className="text-body-sm text-foreground placeholder:text-muted-foreground outline-none bg-transparent w-full"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-muted my-3" />

        {/* Type */}
        <div
          className={[
            'flex items-center gap-2 px-6 transition-colors min-w-[140px]',
            focused === 'type' ? 'bg-muted/50' : 'hover:bg-muted',
          ].join(' ')}
        >
          <Home className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-caption text-muted-foreground">Type de bien</span>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              onFocus={() => setFocused('type')}
              onBlur={() => setFocused(null)}
              className="text-body-sm text-foreground outline-none bg-transparent appearance-none cursor-pointer w-full"
              style={{ backgroundImage: 'none', paddingRight: 0, minHeight: 0 }}
            >
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-muted my-3" />

        {/* Budget */}
        <div
          className={[
            'flex items-center gap-2 px-6 transition-colors min-w-[130px]',
            focused === 'price' ? 'bg-muted/50' : 'hover:bg-muted',
          ].join(' ')}
        >
          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-caption text-muted-foreground">Budget max</span>
            <select
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              onFocus={() => setFocused('price')}
              onBlur={() => setFocused(null)}
              className="text-body-sm text-foreground outline-none bg-transparent appearance-none cursor-pointer w-full"
              style={{ backgroundImage: 'none', paddingRight: 0, minHeight: 0 }}
            >
              {PRICE_OPTIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center pr-2 pl-4">
          <button
            onClick={handleSearch}
            className="w-12 h-12 bg-or rounded-full flex items-center justify-center hover:bg-bleu-nuit/90 active:bg-bleu-nuit transition-colors shadow-md"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
