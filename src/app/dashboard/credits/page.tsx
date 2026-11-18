'use client';
import Link from 'next/link';
import { ArrowLeft, Coins, Gift, Clock, Car, Hotel, Recycle, PartyPopper, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { DashChart } from '../components/charts/DashChart';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EARNED = [320, 410, 380, 520, 610, 560, 720, 810, 760, 940, 890, 1080];

const breakdown = [
  { label: 'Transport', value: 2140, icon: <Car /> },
  { label: 'Hotels', value: 1320, icon: <Hotel /> },
  { label: 'Recycling', value: 880, icon: <Recycle /> },
  { label: 'Events', value: 660, icon: <PartyPopper /> },
];

const tx = [
  { date: 'Nov 16', activity: 'EV ride · Rapido', type: 'earn', amount: 120 },
  { date: 'Nov 14', activity: 'Reward · Hotel upgrade', type: 'spend', amount: 800 },
  { date: 'Nov 12', activity: 'Recycling · Smart bin', type: 'earn', amount: 60 },
  { date: 'Nov 09', activity: 'Eco-hotel stay · Goa', type: 'earn', amount: 240 },
  { date: 'Nov 05', activity: 'Zero-Emission Week streak', type: 'earn', amount: 180 },
  { date: 'Nov 01', activity: 'Reward · Spa voucher', type: 'spend', amount: 500 },
];

export default function CreditsPage() {
  return (
    <div className="max-w-[1100px] mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 tag text-gray-400 hover:text-ink dark:hover:text-white transition-colors mb-5">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <p className="tag text-clay">Wallet</p>
          <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold tracking-tight">Carbon Credits</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-white/60">Your verified sustainability rewards balance and history.</p>
        </div>
        <div className="rounded-xl bg-brand-gradient text-[#07210f] px-5 py-4 shadow-brand">
          <p className="tag opacity-70">Available balance</p>
          <p className="font-display text-3xl font-bold stat-num flex items-center gap-2"><Coins className="w-6 h-6" /> 5,000</p>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { l: 'Earned (lifetime)', v: '12,480', i: <ArrowDownLeft className="text-green-600" /> },
          { l: 'Redeemed', v: '7,480', i: <Gift className="text-clay" /> },
          { l: 'Pending', v: '320', i: <Clock className="text-warning" /> },
          { l: 'This month', v: '+200', i: <ArrowUpRight className="text-green-600" /> },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4">
            <span className="w-8 h-8 grid place-items-center rounded-lg bg-gray-50 dark:bg-white/5 [&>svg]:w-4 [&>svg]:h-4">{s.i}</span>
            <p className="mt-3 tag text-gray-400 dark:text-white/40">{s.l}</p>
            <p className="font-display text-xl font-bold stat-num mt-0.5">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* earned over time */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
          <h2 className="font-display font-semibold mb-2">Credits earned</h2>
          <DashChart
            type="area"
            height={280}
            series={[{ name: 'Credits', data: EARNED }]}
            makeOptions={() => ({
              colors: ['#00C853'],
              stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
              fill: { type: 'gradient', gradient: { shade: 'light', gradientToColors: ['#A8FF00'], opacityFrom: 0.4, opacityTo: 0.02, stops: [0, 95] } },
              xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
              markers: { size: 0, hover: { size: 6 } },
            })}
          />
        </div>
        {/* breakdown donut */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
          <h2 className="font-display font-semibold mb-2">By activity</h2>
          <DashChart
            type="donut"
            height={260}
            series={breakdown.map((b) => b.value)}
            makeOptions={() => ({
              labels: breakdown.map((b) => b.label),
              colors: ['#00C853', '#00D1B2', '#A8FF00', '#9CA3AF'],
              legend: { position: 'bottom' },
              stroke: { width: 0 },
              plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Total', formatter: () => '5,000' } } } } },
            })}
          />
        </div>
      </div>

      {/* transactions */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5">
        <h2 className="font-display font-semibold mb-4">Recent activity</h2>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {tx.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 grid place-items-center rounded-lg ${t.type === 'earn' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-clay/10 text-clay'}`}>
                  {t.type === 'earn' ? <ArrowDownLeft className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                </span>
                <div>
                  <p className="text-sm font-medium">{t.activity}</p>
                  <p className="tag text-gray-400 dark:text-white/40">{t.date}</p>
                </div>
              </div>
              <span className={`font-display font-bold stat-num text-sm ${t.type === 'earn' ? 'text-green-600 dark:text-green-400' : 'text-clay'}`}>
                {t.type === 'earn' ? '+' : '−'}{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
