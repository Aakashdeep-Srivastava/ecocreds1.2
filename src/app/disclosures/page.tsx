import Link from 'next/link';
import { PublicNav, PublicFooter } from '@/components/PublicChrome';
import { Info, Layers, ShieldAlert, Scale } from 'lucide-react';

export const metadata = {
  title: 'Disclosures & how to read our claims — CarbonGero',
  description: 'What CarbonGero records are and are not: voluntary proof tokens vs recognised carbon credits, estimates vs verified figures, and the limits of our claims.',
};

export default function Disclosures() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicNav />
      <section className="max-w-3xl mx-auto px-5 pt-12 pb-16">
        <p className="tag text-clay inline-flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Transparency</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">How to read our claims</h1>
        <p className="mt-4 text-ink-soft leading-relaxed">
          We take honest labelling seriously. This page explains exactly what CarbonGero records are — and
          are not — so you can make informed decisions.
        </p>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-forest" /><h2 className="font-display text-xl font-bold">Two distinct tiers — never confused</h2></div>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-ink/10 p-4">
              <p className="font-semibold">1 · CarbonGero Reward / Proof token (CGRO)</p>
              <p className="mt-2 text-sm text-ink-soft">A <b>voluntary platform reward</b> for an evidence-backed, verified sustainability action. It is a utility/recognition token — <b>not</b> a certified carbon credit, <b>not</b> a financial investment, and <b>not</b> a claim that a specific tonne of CO₂ was offset.</p>
            </div>
            <div className="rounded-xl border border-ink/10 p-4">
              <p className="font-semibold">2 · Recognised carbon credit</p>
              <p className="mt-2 text-sm text-ink-soft">Where offered, a credit issued or sourced under a recognised standard (e.g. Verra, Gold Standard, Puro.earth, Isometric). These are clearly marked as such. Credits issued by CarbonGero today are <b>voluntary-market and not registry-accredited</b>.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2"><Scale className="w-5 h-5 text-forest" /><h2 className="font-display text-xl font-bold">Estimated vs verified</h2></div>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>• <b>Estimated impact</b> — a platform calculation using documented emission factors. Always labelled "estimated".</li>
            <li>• <b>Verified</b> — assessed through our AI + independent human review process and anchored on Algorand.</li>
            <li>• We do <b>not</b> describe any product as making a person or company "carbon neutral", "net zero" or "climate neutral".</li>
            <li>• A token transfer or purchase does <b>not</b> by itself establish a valid offset claim; retirement is explicit and separate.</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-700" /><h2 className="font-display text-xl font-bold text-amber-900">Important limitations</h2></div>
          <ul className="mt-3 space-y-2 text-sm text-amber-900/90">
            <li>• CarbonGero is <b>not</b> a regulated financial service, exchange, or accredited carbon registry.</li>
            <li>• Reward tokens are earned, not sold as investments; we make <b>no</b> promise of value or appreciation.</li>
            <li>• Where real payments or fiat settlement occur, they are handled by licensed third-party providers who perform identity (KYC) checks.</li>
            <li>• Figures and market ranges shown in education content are indicative, not quotes or guarantees.</li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          Questions? See our <Link href="/terms" className="text-forest link-wipe">Terms</Link> and{' '}
          <Link href="/privacy" className="text-forest link-wipe">Privacy Policy</Link>, or learn more about{' '}
          <Link href="/learn" className="text-forest link-wipe">how carbon removal works</Link>.
        </p>
        <p className="mt-2 text-xs text-ink-faint">CarbonGero is operated by Xphora AI Technology Pvt. Ltd. Last updated: 20 November 2026.</p>
      </section>
      <PublicFooter />
    </div>
  );
}
