'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf, Home, QrCode, Hotel, ShoppingCart,
  Award, Map, User, LogOut, BarChart2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { title: 'Travel Hub', icon: <Map />, path: '/dashboard/travel' },
    { title: 'Hotels', icon: <Hotel />, path: '/dashboard/hotels' },
    { title: 'Challenges', icon: <Award />, path: '/dashboard/challenges' },
    { title: 'Rewards', icon: <ShoppingCart />, path: '/dashboard/Rewards' },
    { title: 'Analytics', icon: <BarChart2 />, path: '/dashboard/analytics' },
    { title: 'QR Scanner', icon: <QrCode />, path: '/dashboard/scanner' },
    { title: 'Profile', icon: <User />, path: '/dashboard/profile' },
  ];

  const initials = (user?.displayName || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-forest-deep text-paper flex flex-col z-40">
      {/* wordmark */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
        <Leaf className="w-7 h-7 text-lime" strokeWidth={1.5} />
        <span className="font-display text-xl font-semibold">CarbonGero</span>
      </div>

      <p className="tag text-paper/40 px-6 pt-6 pb-3">Navigation</p>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}
              className={`group relative flex items-center gap-3 px-4 py-2.5 transition-colors ${
                active ? 'bg-white/[0.06] text-lime' : 'text-paper/70 hover:text-paper hover:bg-white/[0.03]'
              }`}>
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-lime transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
              <span className="[&>svg]:w-5 [&>svg]:h-5">{item.icon}</span>
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* user + logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 mb-1">
          <span className="w-9 h-9 grid place-items-center bg-lime text-ink font-display font-semibold text-sm shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.displayName}</p>
            <p className="tag text-paper/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-paper/60 hover:text-clay hover:bg-white/[0.03] transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
};
