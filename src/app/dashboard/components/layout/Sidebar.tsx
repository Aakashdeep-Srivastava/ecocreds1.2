'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, QrCode, Hotel, ShoppingCart, Award, Map, User, LogOut,
  BarChart2, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { title: 'Dashboard', icon: Home, path: '/dashboard' },
  { title: 'Travel Hub', icon: Map, path: '/dashboard/travel' },
  { title: 'Hotels', icon: Hotel, path: '/dashboard/hotels' },
  { title: 'Challenges', icon: Award, path: '/dashboard/challenges' },
  { title: 'Rewards', icon: ShoppingCart, path: '/dashboard/Rewards' },
  { title: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
  { title: 'QR Scanner', icon: QrCode, path: '/dashboard/scanner' },
  { title: 'Profile', icon: User, path: '/dashboard/profile' },
];

export const Sidebar = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initials = (user?.displayName || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-[#0B0D0C] border-r border-gray-200 dark:border-white/10 transition-[width] duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* logo + collapse toggle */}
      <div className={`flex items-center h-16 border-b border-gray-200 dark:border-white/10 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <img src="/logo-mark.png" alt="CarbonGero" className="w-8 h-8 object-contain shrink-0" />
          {!collapsed && (
            <span className="font-display text-lg font-bold tracking-tight truncate">
              Carbon<span className="text-green-600">Gero</span>
            </span>
          )}
        </Link>
        {!collapsed && (
          <button onClick={onToggle} aria-label="Collapse sidebar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-ink hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} aria-label="Expand sidebar"
          className="mx-auto mt-3 p-1.5 rounded-lg text-gray-400 hover:text-ink hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      {!collapsed && <p className="tag text-gray-400 dark:text-white/40 px-5 pt-5 pb-2">Navigation</p>}

      <nav className={`flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 ${collapsed ? 'px-2 pt-2' : 'px-3'}`}>
        {menuItems.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} title={collapsed ? item.title : undefined}
              className={`group relative flex items-center rounded-lg transition-colors ${
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5'
              } ${
                active
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold'
                  : 'text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white'
              }`}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-green-600 dark:bg-green-400" />}
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* user + logout */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <span className="w-9 h-9 grid place-items-center rounded-lg bg-brand-gradient text-[#07210f] font-display font-bold text-sm shrink-0">{initials}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-ink dark:text-white">{user?.displayName}</p>
              <p className="tag text-gray-400 dark:text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={() => logout()} title={collapsed ? 'Sign out' : undefined}
          className={`flex items-center rounded-lg w-full text-gray-500 dark:text-white/50 hover:text-error hover:bg-red-50 dark:hover:bg-error/10 transition-colors ${
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5'
          }`}>
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
