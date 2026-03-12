'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { createCollection } from '@/lib/actions/collections';
import { useRouter } from 'next/navigation';

export function CreateCollectionButton() {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createCollection(name.trim());
      if (result.success) {
        setName('');
        setShowInput(false);
        router.refresh();
      }
    });
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nouvelle collection
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la collection"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        autoFocus
      />
      <button
        onClick={handleCreate}
        disabled={isPending || !name.trim()}
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? '...' : 'Créer'}
      </button>
      <button
        onClick={() => { setShowInput(false); setName(''); }}
        className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
      >
        Annuler
      </button>
    </div>
  );
}
