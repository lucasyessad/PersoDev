import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserNotifications, getUnreadNotificationsCount } from '@/lib/queries/notifications';
import { NotificationItem } from './notification-item';
import { MarkAllReadButton } from './mark-all-read';
import { Bell } from 'lucide-react';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(user.id, 50),
    getUnreadNotificationsCount(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-lg text-neutral-900">Notifications</h1>
          <p className="text-body-sm text-neutral-500 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {/* Notification list */}
      {notifications.length > 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white py-16 text-center">
          <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-body-md text-neutral-500">Aucune notification</p>
          <p className="mt-2 text-body-sm text-neutral-400">
            Vous serez notifié des nouveaux leads, messages et mises à jour
          </p>
        </div>
      )}
    </div>
  );
}
