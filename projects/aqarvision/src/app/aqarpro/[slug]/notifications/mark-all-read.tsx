'use client';

import { useTransition } from 'react';
import { markAllNotificationsAsRead } from '@/lib/actions/notifications';

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await markAllNotificationsAsRead();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
    >
      {isPending ? 'En cours...' : 'Tout marquer comme lu'}
    </button>
  );
}
