'use client';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface EmissionsChartProps {
  current: number;
  previous: number;
  target: number;
}

export const EmissionsChart = ({ current, previous, target }: EmissionsChartProps) => {
  // Render the canvas only after mount to avoid SSR/hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Current month',
        data: [current * 0.25, current * 0.5, current * 0.75, current],
        borderColor: '#1E3A27',
        backgroundColor: 'rgba(30,58,39,0.08)',
        pointBackgroundColor: '#1E3A27',
        pointRadius: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Previous month',
        data: [previous * 0.25, previous * 0.5, previous * 0.75, previous],
        borderColor: '#9B9378',
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Target',
        data: [target * 0.25, target * 0.5, target * 0.75, target],
        borderColor: '#C9603A',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' as const },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#4B463A',
          font: { family: 'var(--font-mono), monospace', size: 11 },
          boxWidth: 14,
          boxHeight: 2,
          padding: 20,
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: '#12241A',
        titleColor: '#CBF24A',
        bodyColor: '#F2EEE1',
        padding: 12,
        cornerRadius: 0,
        titleFont: { family: 'var(--font-mono), monospace' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#7C755F', font: { family: 'var(--font-mono), monospace', size: 10 } },
        border: { color: 'rgba(21,18,11,0.15)' },
      },
      y: {
        grid: { color: 'rgba(21,18,11,0.07)' },
        ticks: { color: '#7C755F', font: { family: 'var(--font-mono), monospace', size: 10 } },
        border: { display: false },
      },
    },
  };

  return (
    <div className="card-paper p-6">
      <div className="h-72">
        {mounted ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full w-full grid place-items-center">
            <span className="tag text-ink-faint animate-pulse">Plotting the record…</span>
          </div>
        )}
      </div>
    </div>
  );
};
