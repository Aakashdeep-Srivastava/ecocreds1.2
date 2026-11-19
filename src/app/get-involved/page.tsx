'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicNav, PublicFooter } from '@/components/PublicChrome';
import { Globe2, HandHeart, Users, Sprout, Check, Loader2, ArrowRight } from 'lucide-react';

interface PledgeItem { name: string; message: string; targetKg: number; createdAt: string }
interface Meter {
  avoidedKg: number; pledgedKg: number; participants: number; pledges: number;
  waitlist: number; credits: number; recentPledges: PledgeItem[];
}

const ROLES = [
  { v: 'individual', l: 'Individual' },
  { v: 'smb', l: 'Small business' },
  { v: 'verifier', l: 'Verifier' },
  { v: 'project', l: 'Project developer' },
];

export default function GetInvolved() {
  const [meter, setMeter] = useState<Meter | null>(null);
  const [pledge, setPledge] = useState({ name: '', message: '', targetKg: '' });
  const [wait, setWait] = useState({ name: '', email: '', role: 'individual' });
  const [busy, setBusy] = useState<'' | 'pledge' | 'wait'>('');
  const [done, setDone] = useState<'' | 'pledge' | 'wait'>('');

  const load = useCallback(async () => {
    try {
      const d = await fetch('/api/community').then((r) => r.json());
      setMeter(d?.meter ?? null);
    } catch { /* keep */ }
  }, []);
  useEffect(() => { load(); }, [load]);

  const submitPledge = async () => {
    if (!pledge.name.trim() || !pledge.message.trim()) return;
    setBusy('pledge');
    try {
      await fetch('/api/community', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'PLEDGE', name: pledge.name, message: pledge.message, targetKg: parseFloat(pledge.targetKg) || 0 }),
      });
      setDone('pledge'); setPledge({ name: '', message: '', targetKg: '' }); await load();
    } finally { setBusy(''); }
  };

  const submitWait = async () => {
    if (!wait.name.trim() || !wait.email.trim()) return;
    setBusy('wait');
    try {
      await fetch('/api/community', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'WAITLIST', name: wait.name, email: wait.email, role: wait.role }),
      });
      setDone('wait'); setWait({ name: '', email: '', role: 'individual' }); await load();
    } finally { setBusy(''); }
  };

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />

      {/* Global Meter */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-6 text-center">
        <p className="tag text-clay inline-flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5" /> Our collective impact</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
          Small actions, <span className="text-gradient">big arithmetic.</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-ink-soft">
          Every verified action adds up. Make a pledge, or book your place for what&apos;s coming — and be part of the number.
        </p>

        <div className="mt-9 grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {[
            [`${fmt(meter?.avoidedKg ?? 0)} kg`, 'CO₂e verified-avoided', true],
            [`${fmt(meter?.pledgedKg ?? 0)} kg`, 'CO₂e pledged ahead', false],
            [`${fmt(meter?.participants ?? 0)}`, 'People involved', false],
            [`${fmt(meter?.credits ?? 0)}`, 'Credits issued', false],
          ].map(([a, b, hot]) => (
            <div key={b as string} className="bg-paper p-5">
              <p className={`font-display text-2xl md:text-3xl stat-num ${hot ? 'text-forest' : ''}`}>{a}</p>
              <p className="tag text-ink-faint mt-1">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">Verified-avoided is real, from on-chain Proofs of Sustainability. Pledged is a forward commitment.</p>
      </section>

      {/* Pledge + Waitlist */}
      <section className="max-w-6xl mx-auto px-5 py-8 grid lg:grid-cols-2 gap-6">
        {/* Pledge */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2"><HandHeart className="w-5 h-5 text-forest" /><h2 className="font-display text-xl font-bold">Make a pledge</h2></div>
          <p className="mt-1 text-sm text-ink-soft">Commit publicly to a change. It joins the pledged-ahead meter.</p>
          {done === 'pledge' ? (
            <div className="mt-5 flex items-center gap-2 text-forest"><Check className="w-5 h-5" /> Pledge added — thank you.</div>
          ) : (
            <div className="mt-4 space-y-3">
              <input value={pledge.name} onChange={(e) => setPledge({ ...pledge, name: e.target.value })} placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg bg-[#faf8f1] border border-ink/15 focus:border-forest outline-none focus:ring-2 focus:ring-lime/50" />
              <input value={pledge.message} onChange={(e) => setPledge({ ...pledge, message: e.target.value })} placeholder="I pledge to… (e.g. cycle to work, go meat-free on weekdays)"
                className="w-full px-4 py-2.5 rounded-lg bg-[#faf8f1] border border-ink/15 focus:border-forest outline-none focus:ring-2 focus:ring-lime/50" />
              <input type="number" min="0" value={pledge.targetKg} onChange={(e) => setPledge({ ...pledge, targetKg: e.target.value })} placeholder="Est. kg CO₂e avoided per year (optional)"
                className="w-full px-4 py-2.5 rounded-lg bg-[#faf8f1] border border-ink/15 focus:border-forest outline-none focus:ring-2 focus:ring-lime/50" />
              <button onClick={submitPledge} disabled={busy === 'pledge' || !pledge.name.trim() || !pledge.message.trim()} className="btn-primary w-full !py-3 !rounded-lg disabled:opacity-60">
                {busy === 'pledge' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Add my pledge <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-ink-faint">Not sure of your number? <Link href="/calculator" className="text-forest link-wipe">Use the calculator</Link>.</p>
            </div>
          )}
        </div>

        {/* Waitlist */}
        <div className="rounded-2xl border border-ink/10 bg-forest-deep text-paper p-6">
          <div className="flex items-center gap-2"><Users className="w-5 h-5 text-lime" /><h2 className="font-display text-xl font-bold">Book your place</h2></div>
          <p className="mt-1 text-sm text-paper/70">Get early access as we roll out — segmented by how you want to take part.</p>
          {done === 'wait' ? (
            <div className="mt-5 flex items-center gap-2 text-lime"><Check className="w-5 h-5" /> You&apos;re on the list — we&apos;ll be in touch.</div>
          ) : (
            <div className="mt-4 space-y-3">
              <input value={wait.name} onChange={(e) => setWait({ ...wait, name: e.target.value })} placeholder="Your name or organisation"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-paper placeholder:text-paper/50 focus:border-lime outline-none" />
              <input type="email" value={wait.email} onChange={(e) => setWait({ ...wait, email: e.target.value })} placeholder="Email"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-paper placeholder:text-paper/50 focus:border-lime outline-none" />
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button key={r.v} onClick={() => setWait({ ...wait, role: r.v })}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${wait.role === r.v ? 'bg-lime text-ink border-lime' : 'border-white/20 text-paper/80 hover:bg-white/10'}`}>
                    {r.l}
                  </button>
                ))}
              </div>
              <button onClick={submitWait} disabled={busy === 'wait' || !wait.name.trim() || !wait.email.trim()} className="w-full bg-lime text-ink font-semibold py-3 rounded-lg hover:brightness-105 disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {busy === 'wait' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join the waitlist <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pledge wall */}
      {meter && meter.recentPledges.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <p className="tag text-ink-faint mb-3 flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5" /> Recent pledges</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {meter.recentPledges.map((p, i) => (
              <div key={i} className="rounded-xl border border-ink/10 bg-white p-4">
                <p className="text-sm text-ink">&ldquo;{p.message}&rdquo;</p>
                <p className="mt-2 text-xs text-ink-faint">— {p.name}{p.targetKg ? ` · ${Math.round(p.targetKg)} kg/yr` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
