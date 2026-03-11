import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUnreadNotificationsCount } from '@/lib/queries/notifications';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: agency } = await supabase
    .from('agencies')
    .select('name, slug')
    .eq('owner_id', user.id)
    .single();

  const unreadCount = await getUnreadNotificationsCount(user.id);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        agencyName={agency?.name ?? 'Mon agence'}
        userEmail={user.email ?? ''}
        userName={user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''}
        unreadMessages={unreadCount}
      />

      {/* Main content — offset by sidebar width */}
      <main className="ml-[260px] flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-200 px-8 py-3 flex items-center justify-between h-14">
          <div className="text-body-sm text-neutral-500">AqarPro</div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <a
                href="/dashboard/notifications"
                className="relative p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-error-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </a>
            )}
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-caption font-semibold text-primary-600">
                {(user.user_metadata?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
