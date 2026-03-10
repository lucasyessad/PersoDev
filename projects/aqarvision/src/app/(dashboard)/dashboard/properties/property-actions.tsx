'use client';

import { useTransition, useState } from 'react';
import Link from 'next/link';
import { deleteProperty } from '@/lib/actions/properties';

export function PropertyActions({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteProperty(propertyId);
      setShowConfirm(false);
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Supprimer &quot;{propertyTitle}&quot; ?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? '...' : 'Oui'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/properties/${propertyId}/edit`}
        className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
      >
        Modifier
      </Link>
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
      >
        Supprimer
      </button>
    </div>
  );
}
