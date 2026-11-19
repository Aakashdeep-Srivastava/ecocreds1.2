'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Leaf, ShoppingCart, BadgeCheck, ExternalLink, Check, Loader2, Building2, X, TreePine, ShieldCheck,
} from 'lucide-react';

interface Credit {
  id: string; serial: string; projectId: string; registry: string; methodologyId: string;
  vintage: number; quantity: number; unit: string; status: string; priceUsdc: number | null;
  anchorNetwork: string; explorerUrl: string; createdAt: string;
}

const PROJECT_LABEL: Record<string, string> = {
  'PRJ-RECYCLING': 'Recycling & waste recovery',
  'PRJ-TRANSPORT': 'Sustainable transport',
  'PRJ-ENERGY': 'Renewable energy',
};

export default function PublicMarketplace() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<null | { mode: 'single' | 'bulk'; ids: string[] }>(null);
  const [buyer, setBuyer] = useState('');
  const [wallet, setWallet] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { count: number; kg: number; usdc: number }>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/market?resource=credits&scope=marketplace').then((r) => r.json());
      setCredits(Array.isArray(data?.credits) ? data.credits : []);
    } catch {
      setCredits([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const totals = useMemo(() => {
    const kg = credits.reduce((a, c) => a + c.quantity, 0);
    const value = credits.reduce((a, c) => a + (c.priceUsdc || 0), 0);
    return { count: credits.length, kg, value };
  }, [credits]);

  const selTotals = useMemo(() => {
    const chosen = credits.filter((c) => selected.has(c.id));
    return {
      kg: chosen.reduce((a, c) => a + c.quantity, 0),
      usdc: chosen.reduce((a, c) => a + (c.priceUsdc || 0), 0),
    };
  }, [credits, selected]);

  const confirmBuy = async () => {
    if (!modal || !buyer.trim()) return;
    setBusy(true);
    try {
      if (modal.mode === 'bulk') {
        const res = await fetch('/api/market', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'buy-bulk', creditIds: modal.ids, buyer, buyerAddress: wallet }),
        }).then((r) => r.json());
        setDone({ count: res?.bought ?? 0, kg: res?.totalKg ?? 0, usdc: res?.totalUsdc ?? 0 });
      } else {
        const res = await fetch('/api/market', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'buy', creditId: modal.ids[0], buyer, buyerAddress: wallet }),
        }).then((r) => r.json());
        setDone({ count: res?.id ? 1 : 0, kg: res?.quantity ?? 0, usdc: res?.priceUsdc ?? 0 });
      }
      setSelected(new Set());
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
      setModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* header */}
      <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="" className="w-8 h-8 object-contain" />
            <span className="font-display text-xl font-bold">Carbon<span className="text-forest">Gero</span></span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/" className="link-wipe text-ink-soft hidden sm:inline">Home</Link>
            <Link href="/blog" className="link-wipe text-ink-soft hidden sm:inline">Blog</Link>
            <Link href="/dashboard/marketplace" className="link-wipe text-ink-soft">Sell / List</Link>
            <Link href="/login" className="btn-primary !py-2 !px-4 !rounded-lg text-sm">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-5 pt-12 pb-6">
        <p className="tag text-clay">Carbon marketplace</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
          Buy verified <span className="text-gradient">carbon credits.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft leading-relaxed">
          Every credit here is issued from an evidence-backed, human-reviewed Proof of Sustainability and
          anchored on Algorand. Buy one, or purchase in bulk for your organisation&apos;s offset programme.
        </p>
        <p className="mt-3 inline-block text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
          Voluntary-market credits · not a registry-accredited credit · payment is settled off-platform (invoice / USDC).
        </p>

        <div className="mt-8 grid grid-cols-3 gap-px bg-ink/10 border border-ink/10 rounded-xl overflow-hidden max-w-lg">
          {[
            [totals.count, 'Listed'],
            [`${Math.round(totals.kg).toLocaleString()} kg`, 'CO₂e available'],
            [`$${Math.round(totals.value).toLocaleString()}`, 'Total value'],
          ].map(([a, b]) => (
            <div key={b as string} className="bg-paper p-4">
              <p className="font-display text-2xl stat-num">{a}</p>
              <p className="tag text-ink-faint mt-1">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* listings */}
      <section className="max-w-6xl mx-auto px-5 pb-32">
        {loading ? (
          <div className="flex items-center gap-2 text-ink-soft py-16"><Loader2 className="w-4 h-4 animate-spin" /> Loading credits…</div>
        ) : credits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-16 text-center text-ink-soft">
            <TreePine className="w-10 h-10 mx-auto mb-3 opacity-40" />
            No credits are listed for sale right now. Check back soon — or{' '}
            <Link href="/dashboard/marketplace" className="text-forest font-semibold link-wipe">list yours</Link>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {credits.map((c) => {
              const sel = selected.has(c.id);
              return (
                <div key={c.id}
                  className={`rounded-2xl border bg-white p-5 transition-shadow hover:shadow-lift ${sel ? 'border-forest ring-2 ring-lime/50' : 'border-ink/10'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 grid place-items-center rounded-xl bg-brand-gradient text-[#07210f]"><Leaf className="w-5 h-5" /></span>
                      <div>
                        <p className="font-semibold leading-tight">{PROJECT_LABEL[c.projectId] || c.projectId}</p>
                        <p className="text-xs text-ink-faint font-mono">{c.serial}</p>
                      </div>
                    </div>
                    <label className="shrink-0 cursor-pointer">
                      <input type="checkbox" checked={sel} onChange={() => toggle(c.id)} className="sr-only" />
                      <span className={`w-6 h-6 grid place-items-center rounded-md border ${sel ? 'bg-forest border-forest text-white' : 'border-ink/25'}`}>
                        {sel && <Check className="w-4 h-4" />}
                      </span>
                    </label>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="font-display text-3xl font-bold">{c.quantity}<span className="text-base font-normal text-ink-faint"> {c.unit}</span></p>
                      <p className="text-xs text-ink-faint mt-0.5">Vintage {c.vintage} · {c.registry}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-forest">${c.priceUsdc ?? '—'}</p>
                      <p className="tag text-ink-faint">USDC</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-forest"><ShieldCheck className="w-3.5 h-3.5" /> Human-verified</span>
                    {c.explorerUrl ? (
                      <a href={c.explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-soft hover:text-forest">
                        On-chain <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-ink-faint">Anchor: {c.anchorNetwork}</span>
                    )}
                  </div>

                  <button onClick={() => { setModal({ mode: 'single', ids: [c.id] }); setDone(null); }}
                    className="mt-4 w-full btn-primary !py-2.5 !rounded-lg text-sm">
                    <ShoppingCart className="w-4 h-4" /> Buy this credit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* sticky bulk bar */}
      {selected.size > 0 && !modal && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-forest-deep text-paper">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-lime" />
              <p className="text-sm">
                <b>{selected.size}</b> selected · <b>{Math.round(selTotals.kg).toLocaleString()} kg</b> CO₂e · <b>${Math.round(selTotals.usdc).toLocaleString()}</b> USDC
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(new Set())} className="text-sm text-paper/70 hover:text-paper px-3 py-2">Clear</button>
              <button onClick={() => { setModal({ mode: 'bulk', ids: [...selected] }); setDone(null); }}
                className="inline-flex items-center gap-2 bg-lime text-ink font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-105">
                <ShoppingCart className="w-4 h-4" /> Buy in bulk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* buy modal */}
      {modal && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/50 backdrop-blur-sm p-4" onClick={() => !busy && setModal(null)}>
          <div className="w-full max-w-md bg-paper rounded-2xl border border-ink/10 shadow-lift p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {modal.mode === 'bulk' ? `Buy ${modal.ids.length} credits` : 'Buy carbon credit'}
              </h2>
              <button onClick={() => !busy && setModal(null)} className="text-ink-faint hover:text-ink"><X className="w-5 h-5" /></button>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {modal.mode === 'bulk'
                ? `${Math.round(selTotals.kg).toLocaleString()} kg CO₂e · $${Math.round(selTotals.usdc).toLocaleString()} USDC total`
                : 'Reserve this credit. Our team settles payment off-platform (invoice or USDC) and transfers ownership to you.'}
            </p>

            <label className="block mt-5">
              <span className="tag text-ink-faint">Your name or organisation *</span>
              <input value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder="Acme Corp"
                className="mt-1.5 w-full px-4 py-2.5 rounded-lg bg-white border border-ink/15 focus:border-forest outline-none focus:ring-2 focus:ring-lime/50" />
            </label>
            <label className="block mt-3">
              <span className="tag text-ink-faint">Algorand wallet (optional)</span>
              <input value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="For on-chain delivery when live"
                className="mt-1.5 w-full px-4 py-2.5 rounded-lg bg-white border border-ink/15 focus:border-forest outline-none focus:ring-2 focus:ring-lime/50 font-mono text-sm" />
            </label>

            <button onClick={confirmBuy} disabled={busy || !buyer.trim()} className="mt-5 w-full btn-primary !py-3 !rounded-lg disabled:opacity-60">
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <><BadgeCheck className="w-4 h-4" /> Confirm purchase</>}
            </button>
            <p className="mt-2 text-[0.7rem] text-ink-faint text-center">
              Voluntary-market credit. Retirement (offset claim) is separate from purchase.
            </p>
          </div>
        </div>
      )}

      {/* success toast */}
      {done && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/50 backdrop-blur-sm p-4" onClick={() => setDone(null)}>
          <div className="w-full max-w-sm bg-paper rounded-2xl border border-ink/10 shadow-lift p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="w-14 h-14 grid place-items-center rounded-full bg-lime/30 text-forest mx-auto"><Check className="w-7 h-7" /></span>
            <h2 className="mt-4 font-display text-xl font-bold">Purchase confirmed</h2>
            <p className="mt-2 text-sm text-ink-soft">
              You acquired <b>{done.count}</b> credit{done.count === 1 ? '' : 's'} · <b>{Math.round(done.kg).toLocaleString()} kg</b> CO₂e
              {done.usdc ? <> · <b>${Math.round(done.usdc).toLocaleString()}</b> USDC</> : null}. Our team will reach out to settle payment.
            </p>
            <button onClick={() => setDone(null)} className="mt-5 btn-primary !py-2.5 !rounded-lg w-full">Done</button>
          </div>
        </div>
      )}

      {/* footer */}
      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink-faint">
        <p>CarbonGero · Proof of Sustainability on Algorand</p>
        <p className="mt-1">Credits shown are voluntary-market and not registry-accredited.</p>
      </footer>
    </div>
  );
}
