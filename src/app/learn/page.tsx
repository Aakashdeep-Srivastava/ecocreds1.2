import Link from 'next/link';
import { PublicNav, PublicFooter } from '@/components/PublicChrome';
import { TreePine, Flame, Wind, ShieldCheck, ArrowRight, Scale, Gauge, ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'Carbon removal, explained — CarbonGero',
  description: 'Avoiding vs removing emissions, and how reforestation, biochar and direct air capture actually work — in plain language.',
};

const METHODS = [
  {
    icon: TreePine, name: 'Reforestation & nature',
    what: 'Trees, soils and ecosystems pull CO₂ from the air as they grow.',
    permanence: 'Lower — carbon can return if forests burn or are cleared.',
    cost: '~$5–50 / tonne', note: 'Big co-benefits for biodiversity and communities.',
  },
  {
    icon: Flame, name: 'Biochar',
    what: 'Plant waste is heated without oxygen into a stable charcoal that locks carbon into soil for centuries.',
    permanence: 'High — durable for 100s of years. Already delivered at scale (Microsoft, Google are buyers).',
    cost: '~€100–210 / tonne', note: 'The workhorse of durable removal today.',
  },
  {
    icon: Wind, name: 'Direct Air Capture (DAC)',
    what: 'Machines chemically scrub CO₂ straight out of the air and store it underground.',
    permanence: 'Highest — measurable and permanent.',
    cost: 'Pricier today', note: 'Considered among the highest-integrity credits.',
  },
];

export default function Learn() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />

      <section className="max-w-4xl mx-auto px-5 pt-12 pb-6">
        <p className="tag text-clay">Learn</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
          Carbon removal, <span className="text-gradient">explained.</span>
        </h1>
        <p className="mt-4 text-ink-soft leading-relaxed max-w-2xl">
          Before you offset, it&apos;s worth knowing where the money goes. Here&apos;s the honest, plain-language version —
          so every credit you buy is a choice you understand.
        </p>
      </section>

      {/* avoid vs remove */}
      <section className="max-w-4xl mx-auto px-5 py-6">
        <div className="rounded-2xl border border-ink/10 bg-white p-6 flex items-start gap-4">
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-brand-gradient text-[#07210f] shrink-0"><Scale className="w-5 h-5" /></span>
          <div>
            <h2 className="font-display text-xl font-bold">Avoiding ≠ removing</h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              <b>Avoiding</b> emissions means not releasing CO₂ in the first place — cycling instead of driving, recycling, clean energy.
              <b> Removing</b> means pulling CO₂ already in the air back out and storing it. Both matter, but they&apos;re not the same thing —
              and a credit should be clear about which it is. CarbonGero labels every record as an estimate, a verified avoidance, or a removal.
            </p>
          </div>
        </div>
      </section>

      {/* methods */}
      <section className="max-w-4xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl font-bold mb-4">Three ways carbon gets removed</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.name} className="rounded-2xl border border-ink/10 bg-white p-5">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-lime/30 text-forest"><Icon className="w-5 h-5" /></span>
                <h3 className="mt-3 font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{m.what}</p>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div><dt className="tag text-ink-faint">Permanence</dt><dd className="text-ink-soft">{m.permanence}</dd></div>
                  <div><dt className="tag text-ink-faint">Typical cost</dt><dd className="text-ink-soft">{m.cost}</dd></div>
                </dl>
                <p className="mt-3 text-xs text-forest">{m.note}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-faint">Figures are indicative market ranges (2026), for orientation — not quotes.</p>
      </section>

      {/* integrity + how we verify */}
      <section className="max-w-4xl mx-auto px-5 py-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-bold">What makes a credit trustworthy</h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            A good credit is <b>measured, third-party verified, registered, and permanent</b>. Independent registries like
            <b> Puro.earth</b> and <b>Isometric</b> set rigorous, science-based standards for durable removal. Cheap, vague credits
            are where greenwashing hides — so transparency is the whole game.
          </p>
        </div>
        <div className="rounded-2xl border border-forest/20 bg-forest-deep text-paper p-6">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-lime" /><h2 className="font-display text-lg font-bold">How CarbonGero verifies</h2></div>
          <ol className="mt-3 space-y-2 text-sm text-paper/85">
            <li>1 · Evidence (photo/data) uploaded with a sustainability activity</li>
            <li>2 · AI gives an instant assessment (advisory only)</li>
            <li>3 · An independent human verifier approves or rejects</li>
            <li>4 · A Proof of Sustainability is anchored on Algorand</li>
            <li>5 · Only approved proofs become tradable credits</li>
          </ol>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-4xl mx-auto px-5 py-10 text-center">
        <h2 className="font-display text-2xl font-bold">Ready to act?</h2>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-ink/15 text-ink font-medium hover:bg-white"><Gauge className="w-4 h-4" /> Check your footprint</Link>
          <Link href="/marketplace" className="btn-primary !py-3 !rounded-lg"><ShoppingCart className="w-4 h-4" /> Buy verified credits</Link>
          <Link href="/get-involved" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-ink/15 text-ink font-medium hover:bg-white">Make a pledge <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
