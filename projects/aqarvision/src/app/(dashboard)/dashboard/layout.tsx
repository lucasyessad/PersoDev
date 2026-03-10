import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: 'home' },
  { href: '/dashboard/branding', label: 'Branding', icon: 'palette' },
  { href: '/dashboard/properties', label: 'Biens', icon: 'building' },
  { href: '/dashboard/leads', label: 'Leads', icon: 'users' },
];

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  palette: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" />
    </svg>
  ),
  building: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m4.5-18v18m4.5-18v18m4.5-18v18M5.25 3h13.5M5.25 21h13.5M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6.75H15m-1.5 3H15m-1.5 3H15" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
};

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/" className="text-lg font-bold text-gray-900">
            AqarVision
          </Link>
        </div>

        {agency && (
          <div className="border-b border-gray-200 px-6 py-3">
            <p className="truncate text-sm font-medium text-gray-900">{agency.name}</p>
            <Link
              href={`/agence/${agency.slug}`}
              className="text-xs text-blue-600 hover:underline"
              target="_blank"
            >
              Voir le mini-site
            </Link>
          </div>
        )}

        <nav className="mt-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              {ICONS[item.icon]}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="mb-2 truncate text-xs text-gray-500">{user.email}</div>
          <LogoutForm />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}

function LogoutForm() {
  return (
    <form action="/dashboard/logout" method="POST">
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-200"
      >
        Se déconnecter
      </button>
    </form>
  );
}
