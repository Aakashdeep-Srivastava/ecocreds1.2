'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@txnlab/use-wallet-react';
import { Wallet, Loader2 } from 'lucide-react';

export function WalletLoginButton() {
  const router = useRouter();
  const { wallets, activeAddress } = useWallet();
  const [mounted, setMounted] = useState(false);
  const handled = useRef(false);

  useEffect(() => setMounted(true), []);

  // Once a wallet is connected, link the address and enter the dashboard.
  useEffect(() => {
    if (activeAddress && !handled.current) {
      handled.current = true;
      fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress }),
      })
        .catch(() => {})
        .finally(() => router.push('/dashboard'));
    }
  }, [activeAddress, router]);

  if (!mounted) {
    return <div className="w-full h-11 rounded-lg border border-gray-200 animate-pulse" />;
  }

  if (activeAddress) {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-3.5 text-sm text-ink-soft">
        <Loader2 className="w-4 h-4 animate-spin" /> Connecting your wallet…
      </div>
    );
  }

  const pera = wallets.find((w) => w.id === 'pera') ?? wallets[0];

  return (
    <button
      type="button"
      onClick={() => pera?.connect()}
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg border border-gray-200 hover:border-green-400 bg-white text-ink font-medium transition-colors"
    >
      {pera?.metadata?.icon ? (
        <img src={pera.metadata.icon} alt="" className="w-5 h-5 rounded" />
      ) : (
        <Wallet className="w-5 h-5 text-green-600" />
      )}
      Continue with Pera Wallet
    </button>
  );
}
