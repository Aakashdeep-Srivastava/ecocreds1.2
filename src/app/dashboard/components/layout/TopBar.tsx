'use client';
import { useAuth } from '@/context/AuthContext';
import { Coins, Bell } from 'lucide-react';

export const TopBar = () => {
  const { user } = useAuth();
  const first = (user?.displayName || 'there').split(' ')[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-paper/85 backdrop-blur-md border-b border-ink/10 flex items-center justify-between px-6 md:px-8">
      <div>
        <p className="tag text-ink-faint leading-none">The Almanac — Vol. I</p>
        <h1 className="font-display text-lg md:text-xl font-semibold leading-tight mt-0.5">
          Welcome back, {first}.
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-forest-deep text-lime">
          <Coins className="w-4 h-4" />
          <span className="font-display font-semibold stat-num text-paper text-sm">5,000</span>
          <span className="tag text-paper/50">credits</span>
        </span>
        <button className="w-10 h-10 grid place-items-center border border-ink/15 bg-[#faf8f1] hover:bg-ink hover:text-paper transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
