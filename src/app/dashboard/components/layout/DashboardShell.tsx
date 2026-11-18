'use client';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AlgoWalletProvider } from '@/components/wallet-provider';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AlgoWalletProvider>
    <div className="min-h-screen bg-surface-2 dark:bg-[#0B0D0C] text-ink dark:text-white">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className={`${collapsed ? 'ml-16' : 'ml-64'} transition-[margin] duration-300 min-h-screen flex flex-col`}>
        <TopBar />
        <main className="dash flex-1 p-4 md:p-5">{children}</main>
      </div>
    </div>
    </AlgoWalletProvider>
  );
}
