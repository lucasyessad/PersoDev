'use client';

import { useState, useTransition } from 'react';
import { addLeadNote } from '@/lib/actions/lead-notes';

interface LeadNoteFormProps {
  leadId: string;
}

export function LeadNoteForm({ leadId }: LeadNoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await addLeadNote(leadId, content);
      if (result.success) {
        setContent('');
        setError('');
      } else {
        setError(result.error || 'Erreur');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajouter une note..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? '...' : 'Ajouter'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
