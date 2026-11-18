'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { Coins, Sun, Moon, HelpCircle } from 'lucide-react';
import { NotificationMenu } from './NotificationMenu';
import { ConnectWallet } from './ConnectWallet';
import { startDashboardTour } from '../DashboardTour';

export const TopBar = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const first = (user?.displayName || 'there').split(' ')[0];
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-[#0B0D0C]/85 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 md:px-8">
      <div>
        <p className="tag text-gray-400 dark:text-white/40 leading-none">Proof of Sustainability</p>
        <h1 className="font-display text-base md:text-lg font-semibold leading-tight mt-0.5 text-ink dark:text-white">
          Welcome back, {first}.
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <span data-tour="wallet"><ConnectWallet /></span>
        <span data-tour="credits" className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400">
          <Coins className="w-4 h-4" />
          <span className="font-display font-bold stat-num text-sm">5,000</span>
          <span className="tag opacity-70">credits</span>
        </span>
        <button onClick={startDashboardTour} aria-label="Take a tour" title="Take a tour"
          className="w-10 h-10 grid place-items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button data-tour="theme" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme"
          className="w-10 h-10 grid place-items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
          {mounted && isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <span data-tour="notifications"><NotificationMenu /></span>
      </div>
    </header>
  );
};
