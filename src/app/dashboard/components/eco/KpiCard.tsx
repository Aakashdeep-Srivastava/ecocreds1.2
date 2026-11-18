'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function KpiCard({
  href, label, value, unit, delta, icon,
}: {
  href: string;
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] px-3.5 py-3 hover:border-green-400 dark:hover:border-green-500/50 hover:shadow-card transition-all"
    >
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/40 truncate">
          {label}
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-display text-lg font-bold stat-num leading-none text-ink dark:text-white">{value}</span>
          {unit && <span className="text-[0.7rem] text-gray-400 dark:text-white/40">{unit}</span>}
        </div>
        {delta && <p className="mt-1 text-[0.7rem] font-medium text-green-600 dark:text-green-400 truncate">{delta}</p>}
      </div>
      <span className="shrink-0 w-8 h-8 grid place-items-center rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 [&>svg]:w-4 [&>svg]:h-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
        {icon}
      </span>
    </Link>
  );
}
