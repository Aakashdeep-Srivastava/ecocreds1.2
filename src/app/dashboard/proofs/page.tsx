'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hexagon, ExternalLink, Loader2, ShieldCheck, Plus, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Proof = {
  id: string; activityType: string; evidenceHash: string; verificationStatus: string;
  impactValue: number; impactUnit: string; impactStatus: string; methodologyId: string;
  blockchainStatus: string; blockchainNetwork: string; blockchainTx: string; explorerUrl: string;
  createdAt: string;
};

export default function ProofsPage() {
  const [proofs, setProofs] = useState<Proof[] | null>(null);
  const [stats, setStats] = useState<{ totalProofs: number; totalOffsetKg: number; anchored: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/proofs').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ])
      .then(([p, s]) => { setProofs(p.proofs || []); setStats(s); })
      .catch(() => setError('Could not reach the registry API.'));
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="tag text-clay">Registry</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-white">Proof of Sustainability</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-white/60">Every verified activity, its impact, and its on-chain anchor — straight from the Go API + Postgres.</p>
        </div>
        <Button asChild variant="brand"><Link href="/dashboard/submit"><Plus className="w-4 h-4" /> New proof</Link></Button>
      </div>

      {/* stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { l: 'Total proofs', v: String(stats.totalProofs), i: <Database /> },
            { l: 'CO₂ offset', v: `${stats.totalOffsetKg.toFixed(1)} kg`, i: <ShieldCheck /> },
            { l: 'Anchored', v: String(stats.anchored), i: <Hexagon /> },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4 flex items-center justify-between">
              <div>
                <p className="tag text-gray-400 dark:text-white/40">{s.l}</p>
                <p className="font-display text-xl font-bold stat-num mt-0.5">{s.v}</p>
              </div>
              <span className="w-9 h-9 grid place-items-center rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 [&>svg]:w-4 [&>svg]:h-4">{s.i}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] overflow-hidden">
        {error && <p className="p-6 text-sm text-error">{error}</p>}
        {!proofs && !error && (
          <div className="p-10 grid place-items-center text-ink-soft dark:text-white/60">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        )}
        {proofs && proofs.length === 0 && (
          <div className="p-10 text-center text-ink-soft dark:text-white/60">
            <p className="text-sm">No proofs yet.</p>
            <Button asChild variant="brand" className="mt-4"><Link href="/dashboard/submit">Create the first one</Link></Button>
          </div>
        )}
        {proofs && proofs.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {proofs.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-10 h-10 grid place-items-center rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 shrink-0">
                    <Hexagon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm text-ink dark:text-white">{p.id}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 capitalize">{p.activityType.toLowerCase()} · {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="font-display font-bold stat-num text-sm text-ink dark:text-white">{p.impactValue.toFixed(2)} <span className="text-xs text-gray-400">{p.impactUnit}</span></p>
                    <p className="text-[0.65rem] uppercase tracking-wide text-gray-400 dark:text-white/40">{p.impactStatus}</p>
                  </div>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                    {p.verificationStatus}
                  </span>
                  {p.explorerUrl ? (
                    <a href={p.explorerUrl} target="_blank" rel="noopener noreferrer" title="Live on Algorand TestNet"
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 hover:underline">
                      <span className="font-mono hidden md:inline">{p.blockchainTx.slice(0, 8)}…</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-500" title="Simulated anchor">
                      <span className="font-mono hidden md:inline">sim</span>
                      <Hexagon className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
