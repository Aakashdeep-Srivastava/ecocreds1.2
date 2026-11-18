'use client';
import { useEffect } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

const STEPS: DriveStep[] = [
  {
    popover: {
      title: '👋 Welcome to CarbonGero',
      description:
        'A 30-second tour of how you turn real climate action into verifiable, on-chain proof. Use Next / Back to move through it.',
    },
  },
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: 'Your navigation',
      description:
        'Everything lives here — the dashboard, submitting activities, the proof registry, challenges and rewards.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="nav-submit"]',
    popover: {
      title: 'Start here → Submit Activity',
      description:
        'Log a sustainable action (e.g. recycling). We assess the evidence, calculate the CO₂ impact, and mint a Proof of Sustainability anchored on Algorand.',
      side: 'right',
    },
  },
  {
    element: '[data-tour="kpis"]',
    popover: {
      title: 'Your impact at a glance',
      description:
        'Carbon credits, sustainability score and CO₂ offset. Click any card to drill into the full details.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="credits"]',
    popover: {
      title: 'What credits do',
      description:
        'Carbon credits are earned from verified activities and are redeemable for rewards — hotel upgrades, discounts, offsets.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="wallet"]',
    popover: {
      title: 'Connect your wallet',
      description:
        'Link an Algorand wallet (Pera) to receive on-chain rewards. MetaMask isn’t supported on Algorand — Pera is the standard.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="theme"]',
    popover: { title: 'Light / dark', description: 'Switch the theme whenever you like.', side: 'bottom' },
  },
  {
    element: '[data-tour="notifications"]',
    popover: {
      title: 'Notifications',
      description: 'Credit earnings, tier unlocks and weekly reports land here.',
      side: 'bottom',
    },
  },
  {
    popover: {
      title: '🌱 You’re all set!',
      description: 'Head to “Submit Activity” to create your first Proof of Sustainability.',
    },
  },
];

export function startDashboardTour() {
  if (typeof document === 'undefined') return;
  const steps = STEPS.filter((s) => !s.element || document.querySelector(s.element as string));
  const d = driver({
    showProgress: true,
    allowClose: true,
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Finish',
    popoverClass: 'cg-tour',
    steps,
    onDestroyed: () => {
      try {
        localStorage.setItem('cg_tour_done', '1');
      } catch {}
    },
  });
  d.drive();
}

/** Mount once in the shell — runs the tour automatically for first-time users. */
export function DashboardTour() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem('cg_tour_done')) return;
    } catch {
      return;
    }
    const t = setTimeout(startDashboardTour, 800); // let the layout settle
    return () => clearTimeout(t);
  }, []);
  return null;
}
