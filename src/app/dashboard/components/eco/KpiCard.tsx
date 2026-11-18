'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
      className="group block rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4 hover:border-green-400 dark:hover:border-green-500/50 hover:shadow-card transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="w-8 h-8 grid place-items-center rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-white/30 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
      <p className="mt-3 tag text-gray-400 dark:text-white/40">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-display text-xl font-bold stat-num text-ink dark:text-white">{value}</span>
        {unit && <span className="text-xs text-gray-400 dark:text-white/40">{unit}</span>}
      </div>
      {delta && <p className="mt-0.5 text-xs font-medium text-green-600 dark:text-green-400">{delta}</p>}
    </Link>
  );
}
