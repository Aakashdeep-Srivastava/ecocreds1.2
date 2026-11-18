'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type MakeOptions = (dark: boolean) => ApexCharts.ApexOptions;

export function DashChart({
  type,
  series,
  makeOptions,
  height = 300,
}: {
  type: 'area' | 'line' | 'bar' | 'donut' | 'radialBar';
  series: any;
  makeOptions: MakeOptions;
  height?: number;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === 'dark';

  if (!mounted) {
    return (
      <div style={{ height }} className="grid place-items-center">
        <span className="tag text-gray-400">Loading…</span>
      </div>
    );
  }

  const user = makeOptions(dark);
  const options: ApexCharts.ApexOptions = {
    ...user,
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'var(--font-inter), sans-serif',
      foreColor: dark ? '#9CA3AF' : '#6B7280',
      ...(user.chart || {}),
    },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      strokeDashArray: 4,
      ...(user.grid || {}),
    },
    tooltip: { theme: dark ? 'dark' : 'light', ...(user.tooltip || {}) },
    dataLabels: { enabled: false, ...(user.dataLabels || {}) },
  };

  return <ReactApexChart type={type} series={series} options={options} height={height} />;
}
