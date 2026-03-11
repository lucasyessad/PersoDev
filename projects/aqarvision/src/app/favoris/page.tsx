import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserFavorites, getUserFavoritesCount } from '@/lib/queries/favorites';
import { ResultCard } from '@/components/search/result-card';
import { FavoriteButton } from '@/components/search/favorite-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Heart, Building2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mes favoris — AqarSearch',
};

export default async function FavorisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirectTo=/favoris');

  const [favorites, count] = await Promise.all([
    getUserFavorites(user.id),
    getUserFavoritesCount(user.id),
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-or rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-vitrine text-lg text-bleu-nuit">Aqar</span>
          </Link>
          <div className="border-l border-neutral-200 h-5" />
          <h1 className="font-vitrine text-display-md text-foreground">Vos favoris</h1>
          {count > 0 && (
            <span className="text-body-sm text-muted-foreground">
              {count} bien{count !== 1 ? 's' : ''} sauvegardé{count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <ResultCard
                key={property.property_id}
                property={property}
                favoriteButton={
                  <FavoriteButton
                    propertyId={property.property_id}
                    isFavorited={true}
                    isAuthenticated={true}
                  />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Pas encore de favoris"
            description="Ajoutez des biens à vos favoris pour les retrouver facilement ici."
            action={{ label: 'Explorer les biens', href: '/recherche' }}
          />
        )}
      </div>
    </div>
  );
}
