'use client';
import Link from 'next/link';

const LINKS = [
  { href: '/calculator', label: 'Calculator' },
  { href: '/learn', label: 'Learn' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/get-involved', label: 'Get Involved' },
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-mark.png" alt="" className="w-8 h-8 object-contain" />
          <span className="font-display text-xl font-bold">Carbon<span className="text-forest">Gero</span></span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5 text-sm">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="link-wipe text-ink-soft hidden sm:inline">{l.label}</Link>
          ))}
          <Link href="/login" className="btn-primary !py-2 !px-4 !rounded-lg text-sm">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink-faint">
      <div className="flex items-center justify-center gap-4 mb-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="link-wipe text-ink-soft">{l.label}</Link>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mb-2 text-xs">
        <Link href="/disclosures" className="link-wipe text-ink-soft">Disclosures</Link>
        <Link href="/terms" className="link-wipe text-ink-soft">Terms</Link>
        <Link href="/privacy" className="link-wipe text-ink-soft">Privacy</Link>
      </div>
      <p>CarbonGero · Proof of Sustainability on Algorand · operated by Xphora AI Technology Pvt. Ltd.</p>
      <p className="mt-1">Voluntary-market · estimates are labelled · not registry-accredited · not financial advice.</p>
    </footer>
  );
}
