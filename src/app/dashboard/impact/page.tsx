'use client';
import Link from 'next/link';
import { ArrowLeft, Sprout, TreePine, Car, Plane, Factory, Droplets, Zap, Trash2 } from 'lucide-react';
import { DashChart } from '../components/charts/DashChart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const OFFSET = [62, 78, 71, 96, 112, 103, 128, 141, 134, 163, 156, 188]; // kg CO2e / month

const equivalences = [
  { label: 'Trees planted', value: '20', icon: <TreePine /> },
  { label: 'Km not driven', value: '5,200', icon: <Car /> },
  { label: 'Short-haul flights', value: '1.4', icon: <Plane /> },
];

const sources = [
  { label: 'Transport', value: 540, icon: <Car /> },
  { label: 'Energy', value: 320, icon: <Zap /> },
  { label: 'Waste', value: 210, icon: <Trash2 /> },
  { label: 'Water', value: 170, icon: <Droplets /> },
];

export default function ImpactPage() {
  return (
    <div className="max-w-[1100px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 tag text-gray-400 hover:text-ink dark:hover:text-white transition-colors mb-5">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <p className="tag text-clay">Environmental impact</p>
          <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold tracking-tight">CO₂ Offset</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-white/60">Estimated emissions avoided through your verified sustainable actions.</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] px-5 py-4">
          <p className="tag text-gray-400 dark:text-white/40">Total offset</p>
          <p className="font-display text-3xl font-bold stat-num text-green-600 dark:text-green-400">1.24<span className="text-lg text-ink-soft dark:text-white/50"> tCO₂e</span></p>
        </div>
      </div>

      {/* equivalences */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {equivalences.map((e) => (
          <div key={e.label} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4 flex items-center gap-4">
            <span className="w-11 h-11 grid place-items-center rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 [&>svg]:w-5 [&>svg]:h-5">{e.icon}</span>
            <div>
              <p className="font-display text-xl font-bold stat-num">{e.value}</p>
              <p className="tag text-gray-400 dark:text-white/40">{e.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
          <h2 className="font-display font-semibold mb-2">Monthly offset</h2>
          <DashChart
            type="bar"
            height={280}
            series={[{ name: 'CO₂ offset', data: OFFSET }]}
            makeOptions={() => ({
              colors: ['#00C853'],
              plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
              fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', gradientToColors: ['#A8FF00'], opacityFrom: 1, opacityTo: 0.85 } },
              xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
              yaxis: { labels: { formatter: (v) => `${Math.round(Number(v))}` } },
              tooltip: { y: { formatter: (v) => `${Math.round(Number(v))} kgCO₂e` } },
            })}
          />
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
          <h2 className="font-display font-semibold mb-4">By source</h2>
          <div className="space-y-4">
            {sources.map((s) => {
              const pct = Math.round((s.value / 1240) * 100);
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="text-green-600 dark:text-green-400 [&>svg]:w-4 [&>svg]:h-4">{s.icon}</span>{s.label}
                    </span>
                    <span className="font-display font-bold stat-num">{s.value} kg</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ ['--to' as string]: `${pct}%`, animation: 'growW 1.1s cubic-bezier(0.16,1,0.3,1) forwards' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-gradient dark:bg-[#161b19] p-5 flex items-start gap-3">
        <Factory className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
        <p className="text-sm text-ink-soft dark:text-white/70">
          Figures are <strong>estimated impact</strong> from your logged activity using documented emission factors — distinct from independently verified carbon credits. See the <Link href="/dashboard/credits" className="text-green-600 dark:text-green-400 font-medium link-wipe">credits ledger</Link> for issued rewards.
        </p>
      </div>
    </div>
  );
}
