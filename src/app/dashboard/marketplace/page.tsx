'use client';
import { useCallback, useEffect, useState } from 'react';
import { Store, BadgeCheck, Tag, ShoppingCart, Flame, ExternalLink, Loader2, Plus, History } from 'lucide-react';

interface Credit {
  id: string; proofId: string; serial: string; ownerUser: string; ownerAddress: string;
  projectId: string; registry: string; methodologyId: string; vintage: number;
  quantity: number; unit: string; status: string; priceUsdc: number | null; asaId: number;
  anchorNetwork: string; anchorTx: string; explorerUrl: string; createdAt: string;
}
interface Issuable {
  proofId: string; activityType: string; impactValue: number; impactUnit: string;
}
interface Summary { issued: number; listed: number; sold: number; retired: number; totalKg: number; issuable: number }
interface CreditEvent { kind: string; actor: string; counterparty: string; priceUsdc: number | null; network: string; tx: string; explorerUrl: string; createdAt: string }

const DEMO_USER = 'USR-DEMO';
const STATUS_STYLE: Record<string, string> = {
  ISSUED: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/70',
  LISTED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  SOLD: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  RETIRED: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
};

export default function MarketplacePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [issuable, setIssuable] = useState<Issuable[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [buyer, setBuyer] = useState('Acme Corp');
  const [events, setEvents] = useState<Record<string, CreditEvent[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/market?resource=credits').then((r) => r.json());
      setSummary(data?.summary ?? null);
      setCredits(Array.isArray(data?.credits) ? data.credits : []);
      setIssuable(Array.isArray(data?.issuable) ? data.issuable : []);
    } catch {
      /* keep */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (fn: () => Promise<Response>, okText: string, key: string) => {
    setBusy(key);
    setMsg(null);
    try {
      const res = await fn().then((r) => r.json());
      if (res?.id || res?.proofId || res?.credit) setMsg({ ok: true, text: okText });
      else setMsg({ ok: false, text: res?.error || 'Action failed.' });
      await load();
    } catch {
      setMsg({ ok: false, text: 'Action failed.' });
    } finally {
      setBusy(null);
    }
  };

  const issue = (proofId: string) =>
    act(() => fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'issue', proofId }) }),
      `Certificate issued from ${proofId}.`, proofId);

  const listForSale = (creditId: string) => {
    const price = parseFloat(prices[creditId] || '');
    if (!price || price <= 0) { setMsg({ ok: false, text: 'Enter a price (USDC) first.' }); return; }
    return act(() => fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'list', creditId, price }) }),
      `${creditId} listed at ${price} USDC.`, creditId);
  };

  const buy = (creditId: string) =>
    act(() => fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'buy', creditId, buyer }) }),
      `${creditId} sold to ${buyer}.`, creditId);

  const retire = (creditId: string) =>
    act(() => fetch('/api/market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'retire', creditId }) }),
      `${creditId} retired — offset claimed.`, creditId);

  const toggleHistory = async (creditId: string) => {
    if (events[creditId]) { setEvents((e) => { const n = { ...e }; delete n[creditId]; return n; }); return; }
    const data = await fetch(`/api/market?resource=credits&id=${encodeURIComponent(creditId)}`).then((r) => r.json());
    setEvents((e) => ({ ...e, [creditId]: data?.events || [] }));
  };

  const marketplace = credits.filter((c) => c.status === 'LISTED');
  const mine = credits.filter((c) => c.ownerUser === DEMO_USER);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-10 h-10 grid place-items-center rounded-xl bg-brand-gradient text-[#07210f]"><Store className="w-5 h-5" /></span>
        <div>
          <h1 className="text-2xl font-bold">Carbon Exchange</h1>
          <p className="text-gray-600 dark:text-white/50 text-sm">Issue verified carbon-credit certificates and trade them with corporates.</p>
        </div>
      </div>
      <p className="text-xs text-amber-700 dark:text-amber-400/80 mb-5 bg-amber-50 dark:bg-amber-500/10 inline-block px-3 py-1.5 rounded-lg">
        Voluntary-market demo. Credits are issued only from human-approved proofs. Payment settles off-platform (USDC via a licensed ramp) — not a registry-accredited credit.
      </p>

      {/* summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            ['Issued', summary.issued], ['Listed', summary.listed], ['Sold', summary.sold],
            ['Retired', summary.retired], ['Total kgCO₂e', Math.round(summary.totalKg)],
          ].map(([label, val]) => (
            <div key={label} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-3">
              <p className="tag text-gray-400 dark:text-white/40">{label}</p>
              <p className="font-display text-xl font-bold text-ink dark:text-white">{val}</p>
            </div>
          ))}
        </div>
      )}

      {msg && <p className={`mb-4 text-sm ${msg.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{msg.text}</p>}

      {loading && <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}

      {/* issue new from approved proofs */}
      {issuable.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Issue certificate from approved proof</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {issuable.map((p) => (
              <div key={p.proofId} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4">
                <p className="font-mono text-sm font-semibold text-ink dark:text-white">{p.proofId}</p>
                <p className="text-sm text-gray-600 dark:text-white/60 mt-1">{p.activityType} · {p.impactValue} {p.impactUnit}</p>
                <button onClick={() => issue(p.proofId)} disabled={busy === p.proofId}
                  className="mt-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold disabled:opacity-60">
                  {busy === p.proofId ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />} Issue credit
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* marketplace listings */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Marketplace</h2>
          <label className="text-sm text-gray-500 dark:text-white/50 flex items-center gap-2">
            Buy as
            <input value={buyer} onChange={(e) => setBuyer(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm w-36" />
          </label>
        </div>
        {marketplace.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-white/50">No credits listed for sale yet. Issue one, then list it below.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplace.map((c) => <CreditCard key={c.id} c={c} busy={busy} onBuy={() => buy(c.id)} onHistory={() => toggleHistory(c.id)} events={events[c.id]} />)}
          </div>
        )}
      </section>

      {/* my credits */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> My certificates</h2>
        {mine.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-white/50">No certificates yet. Issue one from an approved proof above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mine.map((c) => (
              <div key={c.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4">
                <CreditHeader c={c} />
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {c.status === 'ISSUED' && (
                    <>
                      <input type="number" min="0" placeholder="USDC" value={prices[c.id] || ''}
                        onChange={(e) => setPrices((p) => ({ ...p, [c.id]: e.target.value }))}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm" />
                      <button onClick={() => listForSale(c.id)} disabled={busy === c.id}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60">
                        <Tag className="w-3.5 h-3.5" /> List
                      </button>
                    </>
                  )}
                  {c.status !== 'RETIRED' && (
                    <button onClick={() => retire(c.id)} disabled={busy === c.id}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-500/10 disabled:opacity-60">
                      <Flame className="w-3.5 h-3.5" /> Retire
                    </button>
                  )}
                  <button onClick={() => toggleHistory(c.id)} className="inline-flex items-center gap-1 h-8 px-2 text-sm text-gray-500 dark:text-white/50 hover:text-ink dark:hover:text-white">
                    <History className="w-3.5 h-3.5" /> History
                  </button>
                </div>
                {events[c.id] && <EventList events={events[c.id]} />}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CreditHeader({ c }: { c: Credit }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-ink dark:text-white">{c.id}</span>
        <span className={`text-[0.65rem] px-2 py-0.5 rounded-full ${STATUS_STYLE[c.status] || STATUS_STYLE.ISSUED}`}>{c.status}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-white/40 font-mono mt-0.5">{c.serial}</p>
      <p className="text-sm text-gray-600 dark:text-white/60 mt-2">
        <b>{c.quantity} {c.unit}</b> · {c.projectId} · vintage {c.vintage}
      </p>
      <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{c.registry}</p>
      {c.priceUsdc != null && <p className="text-sm font-semibold text-green-700 dark:text-green-400 mt-1">{c.priceUsdc} USDC</p>}
      {c.explorerUrl ? (
        <a href={c.explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-forest dark:text-green-400 mt-1 hover:underline">
          Certificate anchor <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <p className="text-xs text-gray-400 dark:text-white/40 mt-1">Anchor: {c.anchorNetwork}</p>
      )}
    </>
  );
}

function CreditCard({ c, busy, onBuy, onHistory, events }: { c: Credit; busy: string | null; onBuy: () => void; onHistory: () => void; events?: CreditEvent[] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4">
      <CreditHeader c={c} />
      <div className="mt-3 flex items-center gap-2">
        <button onClick={onBuy} disabled={busy === c.id}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-gradient text-[#07210f] text-sm font-semibold disabled:opacity-60">
          {busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />} Buy
        </button>
        <button onClick={onHistory} className="inline-flex items-center gap-1 h-9 px-2 text-sm text-gray-500 dark:text-white/50 hover:text-ink dark:hover:text-white">
          <History className="w-3.5 h-3.5" /> History
        </button>
      </div>
      {events && <EventList events={events} />}
    </div>
  );
}

function EventList({ events }: { events: CreditEvent[] }) {
  return (
    <div className="mt-3 border-t border-gray-100 dark:border-white/5 pt-2 space-y-1.5">
      {events.length === 0 && <p className="text-xs text-gray-400">No events.</p>}
      {events.map((e, i) => (
        <div key={i} className="flex items-center justify-between gap-2 text-xs">
          <span className="text-gray-600 dark:text-white/60">
            <b>{e.kind}</b>{e.counterparty ? ` → ${e.counterparty}` : ''}{e.priceUsdc != null ? ` · ${e.priceUsdc} USDC` : ''}
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            {new Date(e.createdAt).toLocaleDateString()}
            {e.explorerUrl && <a href={e.explorerUrl} target="_blank" rel="noreferrer" className="hover:text-forest"><ExternalLink className="w-3 h-3" /></a>}
          </span>
        </div>
      ))}
    </div>
  );
}
