import Link from 'next/link';
import { FolderOpen, Plus } from 'lucide-react';
import { getCollections } from '@/lib/actions/collections';
import { CreateCollectionButton } from './create-collection-button';

export const metadata = {
  title: 'Mes collections | AqarVision',
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes collections</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organisez vos favoris en collections thématiques
          </p>
        </div>
        <CreateCollectionButton />
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16">
          <FolderOpen className="mb-3 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Aucune collection</p>
          <p className="mt-1 text-xs text-gray-400">
            Créez votre première collection pour organiser vos favoris
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/espace/collections/${collection.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {collection.items_count} {collection.items_count === 1 ? 'bien' : 'biens'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
