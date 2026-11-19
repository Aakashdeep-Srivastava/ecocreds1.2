'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PublicNav, PublicFooter } from '@/components/PublicChrome';
import { Gauge, Home, Car, Plane, Utensils, ArrowRight, TrendingDown, ShoppingCart, BookOpen } from 'lucide-react';

// Rough annual kgCO2e factors — illustrative, labelled as an estimate.
const HOME = { low: 1000, medium: 2500, high: 4500 };
const DIET = { vegan: 1000, vegetarian: 1500, mixed: 2500, heavy: 3300 };
const CAR_PER_KM = 0.17; // kg/km
const SHORT_FLIGHT = 250;
const LONG_FLIGHT = 1100;

// Benchmarks (annual kgCO2e).
const BENCH = [
  { label: 'Paris-aligned (~2030)', kg: 2300, color: 'bg-forest' },
  { label: 'India average', kg: 1900, color: 'bg-lime' },
  { label: 'Global average', kg: 4700, color: 'bg-clay' },
];

export default function Calculator() {
  const [home, setHome] = useState<keyof typeof HOME>('medium');
  const [diet, setDiet] = useState<keyof typeof DIET>('mixed');
  const [kmWeek, setKmWeek] = useState(80);
  const [shortF, setShortF] = useState(2);
  const [longF, setLongF] = useState(0);

  const parts = useMemo(() => {
    const homeKg = HOME[home];
    const carKg = kmWeek * CAR_PER_KM * 52;
    const flightKg = shortF * SHORT_FLIGHT + longF * LONG_FLIGHT;
    const dietKg = DIET[diet];
    return { homeKg, carKg, flightKg, dietKg };
  }, [home, diet, kmWeek, shortF, longF]);

  const total = parts.homeKg + parts.carKg + parts.flightKg + parts.dietKg;

  const actions = useMemo(() => {
    const list: { icon: typeof Car; text: string; save: number }[] = [];
    if (diet === 'heavy' || diet === 'mixed') list.push({ icon: Utensils, text: 'Go plant-forward 3 days/week', save: Math.round((DIET[diet] - DIET.vegetarian) * 0.6) });
    if (parts.carKg > 800) list.push({ icon: Car, text: 'Swap 2 car trips/week for transit or cycling', save: Math.round(parts.carKg * 0.25) });
    if (parts.flightKg > 0) list.push({ icon: Plane, text: 'Replace one flight with rail / virtual', save: longF > 0 ? LONG_FLIGHT : SHORT_FLIGHT });
    if (home === 'high' || home === 'medium') list.push({ icon: Home, text: 'Switch to a green tariff + efficient appliances', save: Math.round(HOME[home] * 0.2) });
    return list.sort((a, b) => b.save - a.save).slice(0, 3);
  }, [diet, home, parts, longF]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const tonnes = (total / 1000).toFixed(1);

  const Opt = <T extends string>({ val, cur, set, label }: { val: T; cur: T; set: (v: T) => void; label: string }) => (
    <button onClick={() => set(val)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${cur === val ? 'bg-forest-deep text-paper border-forest-deep' : 'border-ink/15 text-ink-soft hover:bg-[#faf8f1]'}`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />

      <section className="max-w-5xl mx-auto px-5 pt-12 pb-16">
        <p className="tag text-clay inline-flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> 60-second check</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">What&apos;s <span className="text-gradient">your</span> footprint?</h1>
        <p className="mt-3 max-w-xl text-ink-soft">A quick estimate — then the two or three changes that matter most for <em>you</em>, not a generic list.</p>

        <div className="mt-8 grid lg:grid-cols-5 gap-6">
          {/* inputs */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <p className="tag text-ink-faint mb-2 flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> Home energy</p>
              <div className="flex gap-2 flex-wrap">
                <Opt val="low" cur={home} set={setHome} label="Low" /><Opt val="medium" cur={home} set={setHome} label="Medium" /><Opt val="high" cur={home} set={setHome} label="High" />
              </div>
            </div>
            <div>
              <p className="tag text-ink-faint mb-2 flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" /> Diet</p>
              <div className="flex gap-2 flex-wrap">
                <Opt val="vegan" cur={diet} set={setDiet} label="Vegan" /><Opt val="vegetarian" cur={diet} set={setDiet} label="Vegetarian" /><Opt val="mixed" cur={diet} set={setDiet} label="Mixed" /><Opt val="heavy" cur={diet} set={setDiet} label="Heavy meat" />
              </div>
            </div>
            <div>
              <p className="tag text-ink-faint mb-2 flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Car travel — <b className="text-ink">{kmWeek} km/week</b></p>
              <input type="range" min="0" max="500" step="10" value={kmWeek} onChange={(e) => setKmWeek(+e.target.value)} className="w-full accent-forest" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="tag text-ink-faint mb-2 flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> Short flights/yr</p>
                <input type="number" min="0" value={shortF} onChange={(e) => setShortF(Math.max(0, +e.target.value))} className="w-full px-4 py-2.5 rounded-lg bg-[#faf8f1] border border-ink/15 focus:border-forest outline-none" />
              </div>
              <div>
                <p className="tag text-ink-faint mb-2">Long flights/yr</p>
                <input type="number" min="0" value={longF} onChange={(e) => setLongF(Math.max(0, +e.target.value))} className="w-full px-4 py-2.5 rounded-lg bg-[#faf8f1] border border-ink/15 focus:border-forest outline-none" />
              </div>
            </div>
          </div>

          {/* result */}
          <div className="lg:col-span-2 rounded-2xl border border-ink/10 bg-white p-6 h-fit">
            <p className="tag text-ink-faint">Your estimate</p>
            <p className="mt-1 font-display text-5xl font-bold text-forest">{tonnes}<span className="text-xl text-ink-faint"> t/yr</span></p>
            <p className="text-sm text-ink-faint">{fmt(total)} kg CO₂e per year</p>

            <div className="mt-5 space-y-2">
              {BENCH.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-ink-soft mb-0.5"><span>{b.label}</span><span>{(b.kg / 1000).toFixed(1)} t</span></div>
                  <div className="h-2 rounded-full bg-ink/10 overflow-hidden"><div className={`h-full ${b.color}`} style={{ width: `${Math.min(100, (b.kg / Math.max(total, b.kg)) * 100)}%` }} /></div>
                </div>
              ))}
              <div>
                <div className="flex justify-between text-xs text-ink mb-0.5"><span className="font-semibold">You</span><span className="font-semibold">{tonnes} t</span></div>
                <div className="h-2.5 rounded-full bg-ink/10 overflow-hidden"><div className="h-full bg-brand-gradient" style={{ width: '100%' }} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* personalized actions */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold flex items-center gap-2"><TrendingDown className="w-5 h-5 text-forest" /> Your highest-leverage changes</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="rounded-xl border border-ink/10 bg-white p-4">
                  <Icon className="w-5 h-5 text-forest" />
                  <p className="mt-2 text-sm font-medium">{a.text}</p>
                  <p className="mt-1 text-xs text-forest font-semibold">≈ save {fmt(a.save)} kg/yr</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/get-involved" className="btn-primary !py-3 !rounded-lg">Pledge a change <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/marketplace" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-ink/15 text-ink font-medium hover:bg-[#faf8f1]"><ShoppingCart className="w-4 h-4" /> Offset the rest</Link>
          <Link href="/learn" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-ink/15 text-ink font-medium hover:bg-[#faf8f1]"><BookOpen className="w-4 h-4" /> How removal works</Link>
        </div>
        <p className="mt-3 text-xs text-ink-faint">Estimate only, using illustrative emission factors. Your Proof of Sustainability records use audited methodologies.</p>
      </section>

      <PublicFooter />
    </div>
  );
}
