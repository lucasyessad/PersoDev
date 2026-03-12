'use client';

import { useState, useTransition } from 'react';
import { StickyNote, Save, Trash2, LogIn } from 'lucide-react';
import { upsertNote, deleteNote } from '@/lib/actions/notes';
import Link from 'next/link';

interface PropertyNoteProps {
  propertyId: string;
  initialNote: string | null;
  isAuthenticated: boolean;
}

export function PropertyNote({ propertyId, initialNote, isAuthenticated }: PropertyNoteProps) {
  const [content, setContent] = useState(initialNote ?? '');
  const [saved, setSaved] = useState(!!initialNote);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <Link
          href={`/auth/visiteur/login?redirectTo=${encodeURIComponent(`/bien/${propertyId}`)}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          Connectez-vous pour ajouter une note personnelle
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!content.trim()) return;
    startTransition(async () => {
      const result = await upsertNote({ property_id: propertyId, content: content.trim() });
      if (result.success) setSaved(true);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteNote(propertyId);
      if (result.success) {
        setContent('');
        setSaved(false);
      }
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        <StickyNote className="h-4 w-4" />
        Note personnelle
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        placeholder="Ajouter une note privée sur ce bien..."
        className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
        maxLength={1000}
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">{content.length}/1000</span>
        <div className="flex gap-2">
          {initialNote && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Supprimer
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isPending || !content.trim() || saved}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-3 w-3" />
            {saved ? 'Sauvegardé' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
