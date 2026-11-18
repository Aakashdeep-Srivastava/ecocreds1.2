// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Coins, Award, Sprout, TrendingUp } from 'lucide-react';
import { EmissionsChart } from './components/analytics/EmissionsChart';
import { ChallengeCard } from './components/rewards/ChallengeCard';
import { QuickActions } from './components/shared/QuickActions';
import { KpiCard } from './components/eco/KpiCard';

const Dashboard = () => {
  const [activeChallenge, setActiveChallenge] = useState({
    id: 1,
    title: 'Zero Emission Week',
    progress: 3,
    target: 5,
    reward: 1000,
    type: 'EV rides'
  });

  const userMetrics = {
    carbonCredits: 5000,
    monthlyReduction: 200,
    rewardCoins: 5000,
    sustainabilityTier: 'EcoChampion',
    monthlyStats: {
      saved: 200,
      target: 300,
      previousMonth: 180
    }
  };

  const quickActions = [
    { title: 'Scan QR', icon: 'qr-code', action: () => {} },
    { title: 'Book Eco-Hotel', icon: 'hotel', action: () => {} },
    { title: 'Plan Trip', icon: 'map', action: () => {} }
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Section — ledger */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="tag text-clay">The ledger</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">This month at a glance</h2>
        </div>
        <span className="tag text-ink-faint hidden sm:block">Fig. 01 — 04</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KpiCard href="/dashboard/credits" label="Carbon Credits" value="5,000" delta="+200 this month" icon={<Coins />} />
        <KpiCard href="/dashboard/score" label="Sustainability Score" value="842" unit="/ 1000" delta="EcoChampion tier" icon={<Award />} />
        <KpiCard href="/dashboard/impact" label="CO₂ Offset" value="1.24" unit="tCO₂e" delta="+0.2 this month" icon={<Sprout />} />
        <KpiCard href="/dashboard/analytics" label="Monthly Progress" value="67%" unit="of target" delta="200 / 300 kg" icon={<TrendingUp />} />
      </div>

      {/* Section — trend */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="tag text-clay">The record</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Emissions trend</h2>
        </div>
      </div>
      <div className="mb-10">
        <EmissionsChart
          current={userMetrics.monthlyStats.saved}
          previous={userMetrics.monthlyStats.previousMonth}
          target={userMetrics.monthlyStats.target}
        />
      </div>

      {/* Section — field work */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="tag text-clay">Field work</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Act & earn</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <QuickActions actions={quickActions} />
        <ChallengeCard
          challenge={activeChallenge}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
};

export default Dashboard;