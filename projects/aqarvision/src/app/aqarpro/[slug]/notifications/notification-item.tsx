'use client';

import { useTransition } from 'react';
import { markNotificationAsRead, deleteNotification } from '@/lib/actions/notifications';
import type { Notification } from '@/types/database';

const TYPE_ICONS: Record<string, string> = {
  new_lead: '📩',
  lead_assigned: '👤',
  lead_status_change: '🔄',
  subscription_expiring: '⚠️',
  subscription_expired: '🔴',
  subscription_renewed: '✅',
  property_published: '🏠',
  property_view_milestone: '👀',
  member_invited: '📧',
  member_joined: '🤝',
  system: '⚙️',
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleMarkRead() {
    if (notification.is_read) return;
    startTransition(async () => {
      await markNotificationAsRead(notification.id);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteNotification(notification.id);
    });
  }

  return (
    <div
      className={`flex items-start gap-4 px-6 py-4 transition-colors ${
        notification.is_read ? 'bg-white' : 'bg-blue-50/50'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <span className="mt-0.5 text-lg">
        {TYPE_ICONS[notification.type] || '📌'}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm ${notification.is_read ? 'text-gray-700' : 'font-medium text-gray-900'}`}>
              {notification.title}
            </p>
            {notification.body && (
              <p className="mt-0.5 text-xs text-gray-500">{notification.body}</p>
            )}
          </div>
          <p className="shrink-0 text-xs text-gray-400">
            {new Date(notification.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="mt-2 flex gap-2">
          {!notification.is_read && (
            <button
              onClick={handleMarkRead}
              disabled={isPending}
              className="text-xs text-blue-600 hover:underline disabled:opacity-50"
            >
              Marquer comme lu
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {!notification.is_read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );
}
