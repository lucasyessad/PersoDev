'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  Palette,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Biens',           href: '/dashboard/properties',  icon: Home },
  { label: 'Leads',           href: '/dashboard/leads',       icon: Users },
  { label: 'Messages',        href: '/dashboard/notifications', icon: MessageSquare },
];

const SETTINGS_ITEMS: NavItem[] = [
  { label: 'Branding',     href: '/dashboard/branding',  icon: Palette },
  { label: 'Abonnement',   href: '/dashboard/billing',   icon: CreditCard },
  { label: 'Paramètres',   href: '/dashboard/settings',  icon: Settings },
];

interface SidebarProps {
  agencyName?: string;
  userEmail?: string;
  userName?: string;
  unreadLeads?: number;
  unreadMessages?: number;
}

export function Sidebar({
  agencyName = 'Mon agence',
  userEmail = '',
  userName = '',
  unreadLeads = 0,
  unreadMessages = 0,
}: SidebarProps) {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = NAV_ITEMS.map(item => ({
    ...item,
    badge:
      item.href === '/dashboard/leads'       ? unreadLeads :
      item.href === '/dashboard/notifications' ? unreadMessages :
      undefined,
  }));

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={[
        'fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-white border-r border-neutral-200 transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]',
      ].join(' ')}
    >
      {/* Logo + agency */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-200 min-h-[72px]">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-neutral-900 truncate">{agencyName}</p>
            <p className="text-caption text-neutral-400">AqarPro</p>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="flex flex-col gap-0.5">
          {items.map(item => (
            <li key={item.href}>
              <NavLink item={item} collapsed={collapsed} active={isActive(item.href)} />
            </li>
          ))}
        </ul>

        <div className="my-3 border-t border-neutral-100" />

        <ul className="flex flex-col gap-0.5">
          {SETTINGS_ITEMS.map(item => (
            <li key={item.href}>
              <NavLink item={item} collapsed={collapsed} active={isActive(item.href)} />
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile */}
      <div className="border-t border-neutral-200 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-neutral-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-caption font-semibold text-primary-600">
                {userName.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-neutral-900 truncate">{userName || 'Utilisateur'}</p>
              <p className="text-caption text-neutral-400 truncate">{userEmail}</p>
            </div>
            <Link href="/dashboard/logout" className="text-neutral-400 hover:text-neutral-700 transition-colors">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard/logout"
            className="flex items-center justify-center h-9 w-full text-neutral-400 hover:text-neutral-700 transition-colors rounded-md hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        aria-label={collapsed ? 'Déplier le menu' : 'Réduire le menu'}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-neutral-600" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-neutral-600" />
        )}
      </button>
    </aside>
  );
}

/* ─── Nav Link ───────────────────────────────────── */

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={[
        'flex items-center gap-3 px-3 h-10 rounded-md transition-colors text-body-md font-medium',
        active
          ? 'bg-primary-50 text-primary-600 font-semibold'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
      ].join(' ')}
    >
      <div className="relative shrink-0">
        <Icon className="h-5 w-5" />
        {item.badge != null && item.badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
            {item.badge > 9 ? '9+' : item.badge}
          </span>
        )}
      </div>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
