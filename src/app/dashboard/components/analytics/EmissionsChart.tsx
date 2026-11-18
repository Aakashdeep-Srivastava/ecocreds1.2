'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EmissionsChartProps {
  current?: number;
  previous?: number;
  target?: number;
}

// Realistic, naturally-varying monthly data — reads like a real trend, not a straight line.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const THIS_YEAR = [142, 158, 149, 176, 192, 183, 205, 221, 214, 243, 236, 268];
const LAST_YEAR = [98, 112, 104, 121, 133, 127, 141, 152, 147, 163, 159, 178];
const TARGET = [130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];

export const EmissionsChart = (_props: EmissionsChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === 'dark';

  const series = [
    { name: 'CO₂ saved · this year', data: THIS_YEAR },
    { name: 'Last year', data: LAST_YEAR },
    { name: 'Target', data: TARGET },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 320,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'var(--font-inter), sans-serif',
      foreColor: dark ? '#9CA3AF' : '#6B7280',
      animations: { easing: 'easeinout', speed: 900, animateGradually: { enabled: true, delay: 120 } },
      dropShadow: { enabled: true, top: 6, left: 0, blur: 8, color: '#00C853', opacity: 0.12 },
    },
    colors: ['#00C853', '#9CA3AF', '#00D1B2'],
    stroke: { curve: 'smooth', width: [3, 2, 2], dashArray: [0, 0, 5], lineCap: 'round' },
    fill: {
      type: ['gradient', 'solid', 'solid'],
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 1,
        gradientToColors: ['#A8FF00'],
        opacityFrom: 0.45,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
      opacity: [1, 0, 0],
    },
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { size: 6 }, strokeWidth: 2, strokeColors: dark ? '#0B0D0C' : '#fff' },
    xaxis: {
      categories: MONTHS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: { labels: { formatter: (v) => `${Math.round(Number(v))}` }, tickAmount: 4 },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      strokeDashArray: 4,
      padding: { left: 4, right: 8 },
    },
    legend: { position: 'top', horizontalAlign: 'left', fontWeight: 600, markers: { size: 6, shape: 'circle' }, itemMargin: { horizontal: 12 } },
    tooltip: {
      theme: dark ? 'dark' : 'light',
      shared: true,
      intersect: false,
      y: { formatter: (v) => `${Math.round(Number(v))} kgCO₂e` },
    },
  };

  return (
    <div className="card-paper dark:bg-[#161b19] dark:border-white/10 p-4 md:p-5">
      {mounted ? (
        <ReactApexChart options={options} series={series} type="area" height={320} />
      ) : (
        <div className="h-[320px] grid place-items-center">
          <span className="tag text-gray-400">Loading chart…</span>
        </div>
      )}
    </div>
  );
};
