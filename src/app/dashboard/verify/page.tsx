'use client';
import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Check, X, ExternalLink, Loader2, Hexagon } from 'lucide-react';

interface PendingProof {
  proofId: string; activityId: string; activityType: string; evidenceHash: string;
  impactValue: number; impactUnit: string; methodologyId: string; createdAt: string;
}

export default function VerifyPage() {
  const [pending, setPending] = useState<PendingProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/reviews').then((r) => r.json());
      setPending(Array.isArray(data?.pending) ? data.pending : []);
    } catch {
      setPending([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (proofId: string, decision: 'APPROVED' | 'REJECTED') => {
    setBusy(proofId);
    setMsg(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofId, decision }),
      }).then((r) => r.json());
      if (res?.proofId) {
        setMsg({ ok: true, text: `${proofId} ${decision.toLowerCase()} · attested ${res.live ? 'on-chain' : '(simulated)'}.` });
        setPending((p) => p.filter((x) => x.proofId !== proofId));
      } else {
        setMsg({ ok: false, text: res?.error || 'Review failed.' });
      }
    } catch {
      setMsg({ ok: false, text: 'Review failed.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-10 h-10 grid place-items-center rounded-xl bg-brand-gradient text-[#07210f]"><ShieldCheck className="w-5 h-5" /></span>
        <div>
          <h1 className="text-2xl font-bold">Verifier Queue</h1>
          <p className="text-gray-600 dark:text-white/50 text-sm">Independent human peer review — approve a proof before it can become a sellable carbon credit.</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-white/40 mb-5">
        AI assessment is advisory only (PRD §5.4). Approvals are attested on Algorand. Demo verifier role.
      </p>

      {msg && (
        <p className={`mb-4 text-sm ${msg.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{msg.text}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading queue…</div>
      ) : pending.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 p-10 text-center text-gray-500 dark:text-white/50">
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No proofs awaiting review. New submissions land here.
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.proofId} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-green-600" />
                  <span className="font-mono text-sm font-semibold text-ink dark:text-white">{p.proofId}</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">PENDING REVIEW</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                  {p.activityType} · <b>{p.impactValue} {p.impactUnit}</b> est. · {p.methodologyId || 'no methodology'}
                </p>
                <p className="text-xs text-gray-400 dark:text-white/40 font-mono mt-0.5 truncate">evidence {p.evidenceHash.slice(0, 24)}…</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => decide(p.proofId, 'REJECTED')} disabled={busy === p.proofId}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60">
                  <X className="w-4 h-4" /> Reject
                </button>
                <button onClick={() => decide(p.proofId, 'APPROVED')} disabled={busy === p.proofId}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold disabled:opacity-60">
                  {busy === p.proofId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
