'use client';
import Link from 'next/link';
import { ArrowLeft, Award, Car, Zap, Recycle, Droplets, Utensils, Sprout, TreeDeciduous, Trees } from 'lucide-react';
import { DashChart } from '../components/charts/DashChart';

const factors = [
  { label: 'Transport', score: 88, icon: <Car /> },
  { label: 'Energy', score: 76, icon: <Zap /> },
  { label: 'Waste', score: 92, icon: <Recycle /> },
  { label: 'Water', score: 70, icon: <Droplets /> },
  { label: 'Food', score: 81, icon: <Utensils /> },
];

const tiers = [
  { name: 'Seedling', at: 0, icon: <Sprout /> },
  { name: 'Sapling', at: 400, icon: <TreeDeciduous /> },
  { name: 'EcoChampion', at: 800, icon: <Award /> },
  { name: 'Mighty Oak', at: 900, icon: <Trees /> },
];

export default function ScorePage() {
  const score = 842;
  return (
    <div className="max-w-[1100px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 tag text-gray-400 hover:text-ink dark:hover:text-white transition-colors mb-5">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="mb-7">
        <p className="tag text-clay">Standing</p>
        <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold tracking-tight">Sustainability Score</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-white/60">A weighted measure of your verified climate behaviour across five factors.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* gauge */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5 flex flex-col items-center justify-center">
          <DashChart
            type="radialBar"
            height={260}
            series={[Math.round((score / 1000) * 100)]}
            makeOptions={(dark) => ({
              colors: ['#00C853'],
              labels: ['EcoChampion'],
              fill: { type: 'gradient', gradient: { shade: 'light', gradientToColors: ['#A8FF00'], stops: [0, 100] } },
              stroke: { lineCap: 'round' },
              plotOptions: {
                radialBar: {
                  hollow: { size: '64%' },
                  track: { background: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
                  dataLabels: {
                    name: { offsetY: 22, color: dark ? '#9CA3AF' : '#6B7280', fontSize: '13px' },
                    value: { offsetY: -14, fontSize: '30px', fontWeight: 700, color: dark ? '#fff' : '#0B0D0C', formatter: () => `${score}` },
                  },
                },
              },
            })}
          />
          <p className="text-sm text-ink-soft dark:text-white/60">out of 1000 · top 8% of users</p>
        </div>

        {/* factor bars */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
          <h2 className="font-display font-semibold mb-4">Factor breakdown</h2>
          <div className="space-y-4">
            {factors.map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <span className="text-green-600 dark:text-green-400 [&>svg]:w-4 [&>svg]:h-4">{f.icon}</span>{f.label}
                  </span>
                  <span className="font-display font-bold stat-num text-sm">{f.score}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ ['--to' as string]: `${f.score}%`, animation: 'growW 1.1s cubic-bezier(0.16,1,0.3,1) forwards' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tier ladder */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold">Loyalty tier</h2>
          <span className="tag text-green-600 dark:text-green-400">58 pts to Mighty Oak</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {tiers.map((t) => {
            const reached = score >= t.at;
            const current = t.name === 'EcoChampion';
            return (
              <div key={t.name} className={`rounded-xl border p-4 text-center ${current ? 'border-green-400 bg-green-50 dark:bg-green-500/10' : reached ? 'border-gray-200 dark:border-white/10' : 'border-dashed border-gray-200 dark:border-white/10 opacity-60'}`}>
                <span className={`inline-grid place-items-center w-10 h-10 rounded-lg mb-2 [&>svg]:w-5 [&>svg]:h-5 ${reached ? 'bg-brand-gradient text-[#07210f]' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>{t.icon}</span>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="tag text-gray-400 dark:text-white/40">{t.at}+</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* tips */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-gradient dark:bg-[#161b19] p-5">
        <h2 className="font-display font-semibold mb-3">Raise your score</h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm text-ink-soft dark:text-white/70">
          {['Switch 3 more commutes to EV or public transit (+12)', 'Choose a low-energy room on your next stay (+8)', 'Log a plant-based week to boost Food (+9)', 'Recycle via a smart bin twice more (+6)'].map((t) => (
            <li key={t} className="flex items-start gap-2"><Sprout className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
