'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Renders an ApexCharts chart from a JSON config embedded in a ```chart fence.
export function BlogChart({ config }: { config: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === 'dark';

  let cfg: any = {};
  try {
    cfg = JSON.parse(config);
  } catch {
    return <p className="my-6 text-xs text-red-500">chart config error</p>;
  }

  const { type = 'bar', height = 340, title, caption, series = [], categories, colors, horizontal, options = {} } = cfg;

  const merged: ApexCharts.ApexOptions = {
    chart: {
      type,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'var(--font-inter), sans-serif',
      foreColor: dark ? '#9CA3AF' : '#6B7280',
      animations: { easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 120 } },
      ...(options.chart || {}),
    },
    colors: colors || ['#00C853', '#00D1B2', '#A8FF00', '#0EA5E9', '#9CA3AF'],
    grid: { borderColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', strokeDashArray: 4, ...(options.grid || {}) },
    tooltip: { theme: dark ? 'dark' : 'light', ...(options.tooltip || {}) },
    dataLabels: { enabled: type === 'donut' || type === 'pie' || type === 'radialBar', ...(options.dataLabels || {}) },
    plotOptions: {
      bar: { borderRadius: 6, horizontal: !!horizontal, columnWidth: '58%', distributed: !!cfg.distributed, ...(options.plotOptions?.bar || {}) },
      ...(options.plotOptions || {}),
    },
    stroke: type === 'area' || type === 'line' ? { curve: 'smooth', width: 3, lineCap: 'round', ...(options.stroke || {}) } : options.stroke,
    fill:
      type === 'area'
        ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.03, stops: [0, 95] }, ...(options.fill || {}) }
        : options.fill,
    legend: { position: 'top', horizontalAlign: 'left', fontWeight: 600, markers: { size: 6 }, ...(options.legend || {}) },
    ...(categories ? { xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false }, ...(options.xaxis || {}) } } : {}),
    ...(options.labels ? { labels: options.labels } : {}),
    ...(options.yaxis ? { yaxis: options.yaxis } : {}),
    ...(options.annotations ? { annotations: options.annotations } : {}),
  };

  return (
    <figure className="my-7 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-5 shadow-card">
      {title && <figcaption className="font-display text-base font-bold text-ink dark:text-white mb-1">{title}</figcaption>}
      {caption && <p className="text-xs text-ink-faint dark:text-white/40 mb-3">{caption}</p>}
      {mounted ? (
        <ReactApexChart type={type} series={series} options={merged} height={height} />
      ) : (
        <div style={{ height }} className="grid place-items-center">
          <span className="tag text-gray-400">Loading chart…</span>
        </div>
      )}
    </figure>
  );
}
