import Link from 'next/link';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { getCollectionWithFavorites } from '@/lib/queries/collections';
import { ResultCard } from '@/components/search/result-card';
import { notFound } from 'next/navigation';
import type { SearchPropertyResult } from '@/types/database';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const collection = await getCollectionWithFavorites(id);
  return {
    title: collection ? `${collection.name} | AqarVision` : 'Collection introuvable',
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const collection = await getCollectionWithFavorites(id);

  if (!collection) {
    notFound();
  }

  const properties = collection.properties as unknown as SearchPropertyResult[];

  return (
    <div>
      <Link
        href="/espace/collections"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour aux collections
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{collection.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {properties.length} {properties.length === 1 ? 'bien' : 'biens'}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16">
          <FolderOpen className="mb-3 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Collection vide</p>
          <p className="mt-1 text-xs text-gray-400">
            Ajoutez des favoris à cette collection depuis la page de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <ResultCard key={property.property_id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
