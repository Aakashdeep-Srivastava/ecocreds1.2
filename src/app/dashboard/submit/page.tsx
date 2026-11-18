'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Recycle, Car, ArrowRight, ShieldCheck, Cpu, Leaf, Hexagon,
  ExternalLink, Loader2, CheckCircle2, FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Result = {
  activity: { id: string; category: string; quantity: number; unit: string; status: string };
  ai: { classification: string; confidence: number; recommendedAction: string; modelVersion: string };
  impact: { baselineEmissions: number; leakage: number; netReduction: number; unit: string };
  proof: {
    id: string; evidenceHash: string; impactValue: number; impactUnit: string; impactStatus: string;
    verificationStatus: string; methodologyId: string; blockchainStatus: string;
    blockchainNetwork: string; blockchainTx: string; explorerUrl: string;
  };
};

const categories = [
  { key: 'RECYCLING', label: 'Recycling', unit: 'kg', icon: <Recycle /> },
  { key: 'TRANSPORT', label: 'Sustainable transport', unit: 'km', icon: <Car /> },
];

export default function SubmitPage() {
  const [category, setCategory] = useState('RECYCLING');
  const [quantity, setQuantity] = useState('12');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const unit = categories.find((c) => c.key === category)?.unit || 'kg';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description, quantity: parseFloat(quantity), unit, location, evidence }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-5">
        <p className="tag text-clay">Proof of Sustainability</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-white">Submit an activity</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-white/60">
          Capture a sustainable action → AI assessment → carbon accounting → a traceable proof anchored on Algorand.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* form */}
        <form onSubmit={submit} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5 space-y-5">
          <div>
            <label className="tag text-gray-400 dark:text-white/40">Activity type</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button type="button" key={c.key} onClick={() => setCategory(c.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    category === c.key
                      ? 'border-green-400 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-white/10 text-ink-soft dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}>
                  <span className="[&>svg]:w-4 [&>svg]:h-4">{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="tag text-gray-400 dark:text-white/40">Quantity</label>
              <input type="number" step="0.1" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40" />
            </div>
            <div>
              <label className="tag text-gray-400 dark:text-white/40">Unit</label>
              <input disabled value={unit}
                className="mt-2 w-full px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-ink-soft dark:text-white/50" />
            </div>
          </div>

          <div>
            <label className="tag text-gray-400 dark:text-white/40">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Recycled PET bottles"
              className="mt-2 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40" />
          </div>

          <div>
            <label className="tag text-gray-400 dark:text-white/40">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru"
              className="mt-2 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40" />
          </div>

          <div>
            <label className="tag text-gray-400 dark:text-white/40">Evidence (photo name / note — hashed on submit)</label>
            <input value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="e.g. recycling-bin-photo.jpg"
              className="mt-2 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40" />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating proof…</> : <>Generate Proof of Sustainability <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>

        {/* result */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-5">
          {!result && !loading && (
            <div className="h-full grid place-items-center text-center text-ink-faint dark:text-white/40">
              <div>
                <Hexagon className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-white/20" />
                <p className="text-sm">Your Proof of Sustainability will appear here.</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="h-full grid place-items-center">
              <div className="text-center text-ink-soft dark:text-white/60">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-green-600" />
                <p className="text-sm">Assessing evidence, calculating impact, anchoring…</p>
              </div>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              {/* pipeline */}
              <div className="flex items-center gap-2 text-xs">
                {[['AI', <Cpu key="1" />], ['Carbon', <Leaf key="2" />], ['Proof', <FileCheck key="3" />], ['Anchor', <Hexagon key="4" />]].map(([l, ic], i) => (
                  <div key={l as string} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium [&>svg]:w-3.5 [&>svg]:h-3.5">{ic as React.ReactNode}{l as string}</span>
                    {i < 3 && <ArrowRight className="w-3 h-3 text-gray-300 dark:text-white/20" />}
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-brand-gradient text-[#07210f] p-4">
                <div className="flex items-center justify-between">
                  <span className="tag opacity-70">Proof of Sustainability</span>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="font-display text-xl font-bold stat-num mt-1">{result.proof.id}</p>
                <p className="text-sm font-medium mt-1">{result.proof.impactValue.toFixed(2)} {result.proof.impactUnit} offset · {result.proof.impactStatus}</p>
              </div>

              <dl className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                {[
                  ['Verification', result.proof.verificationStatus],
                  ['AI confidence', `${(result.ai.confidence * 100).toFixed(0)}% · ${result.ai.recommendedAction.replace(/_/g, ' ').toLowerCase()}`],
                  ['Baseline → net', `${result.impact.baselineEmissions.toFixed(1)} → ${result.impact.netReduction.toFixed(2)} ${result.impact.unit}`],
                  ['Methodology', result.proof.methodologyId],
                  ['Evidence hash', `${result.proof.evidenceHash.slice(0, 18)}…`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2">
                    <dt className="text-gray-500 dark:text-white/50">{k}</dt>
                    <dd className="font-medium text-ink dark:text-white text-right">{v}</dd>
                  </div>
                ))}
              </dl>

              <a href={result.proof.explorerUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-3 hover:border-green-400 transition-colors group">
                <div className="flex items-center gap-2 min-w-0">
                  <Hexagon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">Anchored · {result.proof.blockchainNetwork}</p>
                    <p className="text-[0.7rem] text-gray-500 dark:text-white/40 font-mono truncate">{result.proof.blockchainTx}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 shrink-0" />
              </a>

              <div className="flex gap-2">
                <Button asChild variant="secondary" className="flex-1"><Link href="/dashboard/proofs">View registry</Link></Button>
                <Button variant="brand" className="flex-1" onClick={() => setResult(null)}>Submit another</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-ink-faint dark:text-white/40 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Estimated impact from documented emission factors — distinct from independently verified carbon credits. AI assessment and Algorand anchor are MVP stubs per the PRD.
      </p>
    </div>
  );
}
