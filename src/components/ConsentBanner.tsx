'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'cg_consent';

// Privacy-preserving: non-essential analytics stay OFF until the user opts in.
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* storage unavailable */ }
  }, []);

  const choose = (v: 'all' | 'essential') => {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto rounded-xl border border-ink/15 bg-white shadow-lift p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm text-ink-soft flex-1">
          We use essential cookies to run the site. With your consent we also use analytics to improve it. See our{' '}
          <Link href="/privacy" className="text-forest underline">Privacy Policy</Link>.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => choose('essential')} className="px-3 py-2 rounded-lg text-sm font-medium border border-ink/15 text-ink-soft hover:bg-[#faf8f1]">Essential only</button>
          <button onClick={() => choose('all')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-gradient text-[#07210f]">Accept all</button>
        </div>
      </div>
    </div>
  );
}
