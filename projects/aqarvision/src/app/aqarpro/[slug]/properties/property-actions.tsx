'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { deleteProperty } from '@/lib/actions/properties';
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';

export function PropertyActions({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleDelete() {
    startTransition(async () => {
      await deleteProperty(propertyId);
      setShowConfirm(false);
      setOpen(false);
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          {!showConfirm ? (
            <>
              <Link
                href={`/dashboard/properties/${propertyId}/edit`}
                className="flex items-center gap-2.5 px-3 py-2.5 text-caption font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                <Pencil className="h-3.5 w-3.5 text-neutral-400" />
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-caption font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </>
          ) : (
            <div className="p-3">
              <p className="text-caption text-neutral-600">
                Supprimer <span className="font-semibold">&quot;{propertyTitle}&quot;</span> ?
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-red-600 py-1.5 text-caption font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? '...' : 'Supprimer'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-caption font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
