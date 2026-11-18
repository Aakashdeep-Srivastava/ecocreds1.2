'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, Award, Gift, TrendingUp, Coins, CheckCheck } from 'lucide-react';

const items = [
  { icon: <Coins />, title: 'Credits earned', body: '+120 credits from your EV ride · Rapido', time: '2h ago', unread: true },
  { icon: <Award />, title: 'New tier unlocked', body: 'You reached the EcoChampion tier', time: '1d ago', unread: true },
  { icon: <Gift />, title: 'Reward redeemed', body: 'Hotel upgrade claimed · −800 credits', time: '2d ago', unread: false },
  { icon: <TrendingUp />, title: 'Weekly report ready', body: 'Your footprint dropped 18% this week', time: '3d ago', unread: false },
];

export function NotificationMenu() {
  const unread = items.filter((i) => i.unread).length;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Notifications"
          className="relative w-10 h-10 grid place-items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#0B0D0C]" />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-[60] w-[22rem] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] shadow-lift overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <span className="font-display font-semibold text-sm text-ink dark:text-white">Notifications</span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-full px-2 py-0.5">
              {unread} new
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.map((n, i) => (
              <DropdownMenu.Item
                key={i}
                className="flex gap-3 px-4 py-3 cursor-pointer outline-none hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-gray-50 dark:focus:bg-white/5 data-[highlighted]:bg-gray-50 dark:data-[highlighted]:bg-white/5"
              >
                <span className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 grid place-items-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                  {n.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate text-ink dark:text-white">{n.title}</p>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white/50 truncate">{n.body}</p>
                  <p className="text-[0.65rem] uppercase tracking-wide text-gray-400 dark:text-white/30 mt-0.5">{n.time}</p>
                </div>
              </DropdownMenu.Item>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-white/10 p-2 flex items-center gap-2">
            <button className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-ink-soft dark:text-white/70 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button className="flex-1 text-center text-xs font-semibold text-green-600 dark:text-green-400 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors">
              View all
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
