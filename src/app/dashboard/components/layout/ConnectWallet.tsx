'use client';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';

export function ConnectWallet() {
  const { wallets, activeAddress, activeWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const posted = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Persist the connected Algorand address to the backend (PRD FR-006).
  useEffect(() => {
    if (activeAddress && posted.current !== activeAddress) {
      posted.current = activeAddress;
      fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress }),
      }).catch(() => {});
    }
  }, [activeAddress]);

  if (!mounted) {
    return <div className="w-[9.5rem] h-10 rounded-lg border border-gray-200 dark:border-white/10 animate-pulse" />;
  }

  if (activeAddress) {
    const short = `${activeAddress.slice(0, 4)}…${activeAddress.slice(-4)}`;
    return (
      <div className="relative">
        <button onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-green-300 dark:border-green-500/40 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500" /> {short} <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] shadow-lift p-2 z-[60]">
              <div className="px-3 py-2">
                <p className="tag text-gray-400 dark:text-white/40">Connected · {activeWallet?.metadata.name}</p>
                <p className="text-xs font-mono break-all mt-1 text-ink dark:text-white">{activeAddress}</p>
              </div>
              <button onClick={() => { activeWallet?.disconnect(); setOpen(false); posted.current = null; }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-red-50 dark:hover:bg-error/10 transition-colors">
                <LogOut className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold shadow-brand hover:brightness-105 transition">
        <Wallet className="w-4 h-4" /> <span className="hidden sm:inline">Connect wallet</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] shadow-lift p-2 z-[60]">
            <p className="tag text-gray-400 dark:text-white/40 px-3 pt-2 pb-1">Algorand wallets · TestNet</p>
            {wallets.map((w) => (
              <button key={w.id} onClick={async () => { try { await w.connect(); } finally { setOpen(false); } }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {w.metadata.icon && <img src={w.metadata.icon} alt="" className="w-6 h-6 rounded" />}
                <span className="text-sm font-medium text-ink dark:text-white">{w.metadata.name}</span>
              </button>
            ))}
            <p className="text-[0.65rem] text-gray-400 dark:text-white/30 px-3 pt-2 pb-1">MetaMask isn’t supported on Algorand.</p>
          </div>
        </>
      )}
    </div>
  );
}
