'use client';
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';

// One manager for the app. Pera is the primary Algorand wallet; Lute is a
// browser wallet convenient for desktop testing. TestNet to match anchoring.
const manager = new WalletManager({
  wallets: [
    WalletId.PERA,
    { id: WalletId.LUTE, options: { siteName: 'CarbonGero' } },
  ],
  network: NetworkId.TESTNET,
});

export function AlgoWalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletProvider manager={manager}>{children}</WalletProvider>;
}
