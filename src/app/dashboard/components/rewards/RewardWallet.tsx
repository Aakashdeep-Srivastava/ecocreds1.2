'use client';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import algosdk from 'algosdk';
import { Coins, Wallet, ExternalLink, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface RewardAssetInfo { asaId: number; unit: string; name: string; live: boolean; explorer: string }
interface RewardSummary {
  unit: string; asaId: number; assetExplorer: string; live: boolean;
  earnedCoins: number; claimableCoins: number; issued: number; simulated: number; optInRequired: number; pendingWallet: number;
}
interface RewardItem {
  id: string; proofId: string; amount: number; unit: string; status: string;
  network: string; txId: string; explorerUrl: string; createdAt: string;
}
interface AccountSnap {
  address: string; explorer: string; rewardAsaId: number; rewardUnit: string;
  rewardBalance: number; optedIn: boolean; indexerError?: string;
}

const STATUS_STYLE: Record<string, string> = {
  ISSUED: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  SIMULATED: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  OPTIN_REQUIRED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  PENDING_WALLET: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

export function RewardWallet() {
  const { activeAddress, algodClient, signTransactions } = useWallet();
  const [asset, setAsset] = useState<RewardAssetInfo | null>(null);
  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [snap, setSnap] = useState<AccountSnap | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const loadLedger = useCallback(async () => {
    try {
      const [a, r] = await Promise.all([
        fetch('/api/rewards?resource=assets').then((x) => x.json()),
        fetch('/api/rewards').then((x) => x.json()),
      ]);
      setAsset(a?.reward ?? null);
      setSummary(r?.summary ?? null);
      setRewards(Array.isArray(r?.rewards) ? r.rewards : []);
    } catch {
      /* keep prior state on transient error */
    }
  }, []);

  const loadAccount = useCallback(async (address: string) => {
    try {
      const s = await fetch(`/api/rewards?resource=account&address=${encodeURIComponent(address)}`).then((x) => x.json());
      setSnap(s);
    } catch {
      setSnap(null);
    }
  }, []);

  useEffect(() => { loadLedger(); }, [loadLedger]);
  useEffect(() => { if (activeAddress) loadAccount(activeAddress); else setSnap(null); }, [activeAddress, loadAccount]);

  const handleClaim = async () => {
    if (!activeAddress) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim', address: activeAddress }),
      }).then((x) => x.json());
      if (res.status === 'OPTIN_REQUIRED') {
        setMsg({ ok: false, text: `Opt into ${asset?.unit || 'CGRO'} first, then claim.` });
      } else if (res.status === 'NOTHING') {
        setMsg({ ok: false, text: 'Nothing to claim yet — earn rewards by submitting activities.' });
      } else if (res.status === 'ISSUED') {
        setMsg({ ok: true, text: `Claimed ${res.claimed} ${asset?.unit || 'CGRO'} on-chain to your wallet.` });
      } else if (res.status === 'SIMULATED') {
        setMsg({ ok: true, text: `Claimed ${res.claimed} ${asset?.unit || 'CGRO'} (simulated — treasury not funded yet).` });
      } else {
        setMsg({ ok: false, text: 'Claim failed. Please try again.' });
      }
      await loadLedger();
      if (activeAddress) await loadAccount(activeAddress);
    } catch {
      setMsg({ ok: false, text: 'Claim failed. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleOptIn = async () => {
    if (!activeAddress || !asset?.asaId) return;
    setBusy(true);
    setMsg(null);
    try {
      const sp = await algodClient.getTransactionParams().do();
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: activeAddress,
        amount: 0,
        assetIndex: Number(asset.asaId),
        suggestedParams: sp,
      });
      const signed = await signTransactions([txn]);
      const toSend = signed.filter((s): s is Uint8Array => s != null);
      if (toSend.length === 0) throw new Error('Signing was cancelled.');
      await algodClient.sendRawTransaction(toSend).do();
      await algosdk.waitForConfirmation(algodClient, txn.txID(), 4);
      setMsg({ ok: true, text: `Opted in to ${asset.unit}. You can now receive rewards on-chain.` });
      await loadAccount(activeAddress);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Opt-in failed.' });
    } finally {
      setBusy(false);
    }
  };

  const hasAsa = !!asset?.asaId;
  const onChainBalance = snap?.rewardBalance ?? 0;
  const claimable = summary?.claimableCoins ?? 0;
  const needsOptIn = hasAsa && !!activeAddress && snap && !snap.optedIn;
  const canClaim = !!activeAddress && claimable > 0 && (snap?.optedIn || !hasAsa);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 grid place-items-center rounded-xl bg-brand-gradient text-[#07210f]">
              <Coins className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-semibold text-ink dark:text-white leading-tight">
                {asset?.name || 'CarbonGero Reward'}{' '}
                <span className="text-xs font-mono text-gray-400">{asset?.unit || 'CGRO'}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-white/50">
                Voluntary platform reward · not a certified carbon credit
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => { loadLedger(); if (activeAddress) loadAccount(activeAddress); }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50 hover:text-ink dark:hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* balances */}
      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4">
          <p className="tag text-gray-400 dark:text-white/40">Earned (ledger)</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-white mt-1">
            {summary?.earnedCoins ?? 0} <span className="text-sm font-normal text-gray-400">{asset?.unit || 'CGRO'}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{claimable} claimable · {summary?.issued ?? 0} on-chain</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4">
          <p className="tag text-gray-400 dark:text-white/40">On-chain balance</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-white mt-1">
            {onChainBalance} <span className="text-sm font-normal text-gray-400">{asset?.unit || 'CGRO'}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
            {activeAddress ? (snap?.optedIn ? 'Opted in' : 'Not opted in') : 'Connect a wallet'}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4">
          <p className="tag text-gray-400 dark:text-white/40">Reward ASA</p>
          {hasAsa ? (
            <a href={asset!.explorer} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-sm text-forest dark:text-green-400 mt-1 hover:underline">
              #{asset!.asaId} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">Simulated mode</p>
          )}
          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
            {asset?.live ? 'Live issuance (TestNet)' : 'Treasury not funded yet'}
          </p>
        </div>
      </div>

      {/* freemium claim gate */}
      {!activeAddress && (
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
          <p className="text-sm text-ink dark:text-white/80">
            {claimable > 0 ? (
              <>You&apos;ve earned <b>{claimable} {asset?.unit || 'CGRO'}</b>. Connect &amp; log in with Pera (top-right) to claim them to your Algorand wallet.</>
            ) : (
              <>Submit activities to earn {asset?.unit || 'CGRO'} rewards — then connect a Pera wallet to claim them on-chain.</>
            )}
          </p>
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
            <Wallet className="w-4 h-4" /> Wallet required to claim
          </span>
        </div>
      )}
      {canClaim && (
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4">
          <p className="text-sm text-green-800 dark:text-green-300">
            <b>{claimable} {asset?.unit || 'CGRO'}</b> ready to claim to your wallet{asset?.live ? '' : ' (simulated until treasury is funded)'}.
          </p>
          <button onClick={handleClaim} disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
            {busy ? 'Claiming…' : `Claim ${claimable} ${asset?.unit || 'CGRO'}`}
          </button>
        </div>
      )}
      {needsOptIn && (
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Opt into <span className="font-mono">{asset?.unit}</span> once to let your wallet hold the reward token.
          </p>
          <button onClick={handleOptIn} disabled={busy}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
            {busy ? 'Opting in…' : `Opt into ${asset?.unit}`}
          </button>
        </div>
      )}
      {msg && (
        <p className={`mt-3 flex items-center gap-2 text-sm ${msg.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
        </p>
      )}

      {/* issuance history */}
      {rewards.length > 0 && (
        <div className="mt-5">
          <p className="tag text-gray-400 dark:text-white/40 mb-2">Recent reward issuances</p>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {rewards.slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-white truncate">
                    +{r.amount} {r.unit} <span className="text-gray-400 font-normal">· {r.proofId}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white/40">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status] || STATUS_STYLE.PENDING_WALLET}`}>
                    {r.status.replace(/_/g, ' ')}
                  </span>
                  {r.explorerUrl && (
                    <a href={r.explorerUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-forest dark:hover:text-green-400">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
