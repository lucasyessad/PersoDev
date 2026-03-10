import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserNotifications, getUnreadNotificationsCount } from '@/lib/queries/notifications';
import { NotificationItem } from './notification-item';
import { MarkAllReadButton } from './mark-all-read';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(user.id, 50),
    getUnreadNotificationsCount(user.id),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-gray-400">
            Aucune notification
          </p>
        )}
      </div>
    </div>
  );
}
