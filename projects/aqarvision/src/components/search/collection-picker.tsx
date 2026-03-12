'use client';

import { useState, useTransition, useEffect } from 'react';
import { FolderPlus, Check, Plus } from 'lucide-react';
import { getCollections, createCollection, addToCollection } from '@/lib/actions/collections';

interface CollectionPickerProps {
  favoriteId: string;
  isAuthenticated: boolean;
}

interface CollectionItem {
  id: string;
  name: string;
  items_count: number;
  created_at: string;
}

export function CollectionPicker({ favoriteId, isAuthenticated }: CollectionPickerProps) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [newName, setNewName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [addedTo, setAddedTo] = useState<string | null>(null);

  useEffect(() => {
    if (open && isAuthenticated) {
      startTransition(async () => {
        const data = await getCollections();
        setCollections(data);
      });
    }
  }, [open, isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleAdd = (collectionId: string) => {
    startTransition(async () => {
      const result = await addToCollection(collectionId, favoriteId);
      if (result.success) {
        setAddedTo(collectionId);
        setTimeout(() => setAddedTo(null), 2000);
      }
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createCollection(newName.trim());
      if (result.success && result.id) {
        await addToCollection(result.id, favoriteId);
        setNewName('');
        const data = await getCollections();
        setCollections(data);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="Ajouter à une collection"
      >
        <FolderPlus className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <p className="mb-2 text-xs font-medium text-gray-500">Collections</p>

            {collections.length === 0 && !isPending && (
              <p className="py-2 text-center text-xs text-gray-400">Aucune collection</p>
            )}

            <div className="max-h-40 space-y-0.5 overflow-y-auto">
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleAdd(c.id)}
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="truncate">{c.name}</span>
                  {addedTo === c.id ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <span className="text-gray-400">{c.items_count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-2 flex gap-1 border-t border-gray-100 pt-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nouvelle collection"
                className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <button
                onClick={handleCreate}
                disabled={isPending || !newName.trim()}
                className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
