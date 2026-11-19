'use client';
import {
  Hexagon, ShieldCheck, BadgeCheck, Layers, Repeat, BarChart3,
  Landmark, Building2, Sprout, ClipboardCheck, Zap, Leaf, TrendingUp,
  ArrowRight, ArrowUpRight, Play, Menu, X, ChevronDown, Calendar, FileCheck,
  Chrome, Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MENUS: { label: string; items: { label: string; href: string; desc?: string }[] }[] = [
  {
    label: 'Product',
    items: [
      { label: 'Carbon Marketplace', href: '/marketplace', desc: 'Buy verified carbon credits — single or bulk' },
      { label: 'Footprint Calculator', href: '/calculator', desc: 'Your number + the changes that matter most' },
      { label: 'Platform overview', href: '#product', desc: 'End-to-end carbon credit infrastructure' },
      { label: 'How it works', href: '#how' },
      { label: 'Submit an activity', href: '/dashboard/submit' },
      { label: 'Proof registry', href: '/dashboard/proofs' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'For Governments', href: '#solutions' },
      { label: 'For Enterprises', href: '#solutions' },
      { label: 'For Project Developers', href: '#solutions' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Carbon removal, explained', href: '/learn', desc: 'Reforestation vs biochar vs direct air capture' },
      { label: 'Blog', href: '/blog', desc: 'India CCTS, CBAM & carbon markets' },
      { label: "India's CCTS, Decoded", href: '/blog/india-ccts-explained' },
      { label: 'CBAM & Indian Exporters', href: '/blog/cbam-india-exporters' },
      { label: 'The MSME Playbook', href: '/blog/msme-carbon-credits-import-export' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'Get Involved', href: '/get-involved', desc: 'Pledge a change or join the waitlist' },
      { label: 'About', href: '#why' },
      { label: 'Contact', href: '#contact' },
      { label: 'Open the app', href: '/dashboard' },
    ],
  },
];

function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-mark.png" alt="CarbonGero" className="w-8 h-8 object-contain" />
      <span className="font-display text-base font-bold tracking-tight">
        Carbon<span className="text-green-600">Gero</span>
      </span>
    </span>
  );
}

/* Floating product mockup in the hero */
function ImpactCard() {
  return (
    <div className="relative w-full max-w-lg card-paper p-4 md:p-5 shadow-lift">
      <div className="flex gap-4">
        <div className="hidden sm:flex flex-col gap-1 w-24 shrink-0 text-xs border-r border-gray-100 pr-3">
          <span className="inline-flex items-center gap-1.5 mb-3">
            <img src="/logo-mark.png" alt="" className="w-5 h-5 object-contain" />
            <span className="font-display text-xs font-bold">Carbon<span className="text-green-600">Gero</span></span>
          </span>
          {['Dashboard', 'Projects', 'Credits', 'Marketplace', 'Reports'].map((m, i) => (
            <span key={m} className={`px-2.5 py-1.5 rounded-md ${i === 0 ? 'bg-green-50 text-green-700 font-semibold' : 'text-ink-faint'}`}>{m}</span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-semibold text-sm">Impact Dashboard</span>
            <span className="tag text-[0.6rem] text-ink-faint border border-gray-200 rounded px-2 py-0.5">Last 12 Months</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[['124,560', 'Credits Issued'], ['98,320', 'Credits Traded'], ['27', 'Projects']].map(([v, l]) => (
              <div key={l} className="bg-surface-2 rounded-lg p-2.5">
                <p className="font-display font-bold text-sm stat-num">{v}</p>
                <p className="text-[0.6rem] text-ink-faint mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.65rem] text-ink-faint">Carbon Impact (tCO₂e)</span>
              <span className="text-xs font-bold text-green-600">+42%</span>
            </div>
            <svg viewBox="0 0 220 56" className="w-full h-14" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C853" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,46 L24,40 L48,43 L72,30 L96,34 L120,22 L144,26 L168,14 L192,18 L220,6 L220,56 L0,56 Z" fill="url(#spark)" />
              <path d="M0,46 L24,40 L48,43 L72,30 L96,34 L120,22 L144,26 L168,14 L192,18 L220,6" fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });
    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((grid) => {
      gsap.from(grid.children, {
        y: 34, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
      });
    });
    gsap.from('[data-hero]', { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.05 });
  }, { scope: root });

  const infra = [
    { icon: <BadgeCheck />, t: 'Create & Verify', d: 'Standardized, auditable carbon credit generation.' },
    { icon: <Hexagon />, t: 'Tokenize on Algorand', d: 'Immutable, low-cost and high-performance issuance.' },
    { icon: <Repeat />, t: 'Trade & Settle', d: 'A transparent marketplace for compliant credit trading.' },
    { icon: <BarChart3 />, t: 'Measure Impact', d: 'Real-time, verifiable climate impact reporting.' },
  ];

  const solutions = [
    { icon: <Landmark />, t: 'For Governments', d: 'Digitize, monitor and monetize state and city-level climate projects.', img: '/sol-government.webp' },
    { icon: <Building2 />, t: 'For Enterprises', d: 'Meet net-zero goals with verified, traceable carbon credits.', img: '/sol-enterprise.webp' },
    { icon: <Sprout />, t: 'For Project Developers', d: 'Turn your sustainability projects into high-integrity carbon assets.', img: '/sol-developer.webp' },
  ];

  const steps = [
    { icon: <Sprout />, t: 'Register Project', d: 'e.g. waste, forestry, renewables' },
    { icon: <ClipboardCheck />, t: 'Verify & Measure', d: 'using trusted methodologies' },
    { icon: <Hexagon />, t: 'Tokenize on Algorand', d: 'issue verifiable carbon credits' },
    { icon: <Repeat />, t: 'Trade & Retire', d: 'buy, sell or retire with full traceability' },
  ];

  const why = [
    { icon: <Zap />, t: 'Built on Algorand', d: 'Fast, secure and low-cost blockchain.' },
    { icon: <ShieldCheck />, t: 'Compliant & Auditable', d: 'Aligned with global carbon standards.' },
    { icon: <Layers />, t: 'Scalable & Modular', d: 'From pilots to nationwide programs.' },
    { icon: <Leaf />, t: 'Real-World Impact', d: 'Measurable, verifiable emissions reduction.' },
  ];

  const trust = ['Algorand', 'UN Environment', 'Gold Standard', 'VERRA', 'ICROA', 'GIM'];

  return (
    <div ref={root} className="min-h-screen bg-paper text-ink overflow-x-hidden">
      {/* ===================== NAV ===================== */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-[#0B0D0C]/80 backdrop-blur-md border-b border-gray-200' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link href="/"><Logo className={!scrolled ? 'text-white' : ''} /></Link>
          <div className={`hidden lg:flex items-center gap-1 text-sm font-medium ${scrolled ? 'text-ink-soft' : 'text-white/90'}`}>
            {MENUS.map((m) => (
              <div key={m.label} className="relative" onMouseEnter={() => setOpenMenu(m.label)} onMouseLeave={() => setOpenMenu(null)}>
                <button className="inline-flex items-center gap-1 px-3 py-2 hover:opacity-80 transition-opacity">
                  {m.label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === m.label ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === m.label && (
                  <div className="absolute left-0 top-full pt-3">
                    <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-lift p-2">
                      {m.items.map((it) => {
                        const cls = 'block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors';
                        const inner = (
                          <>
                            <span className="text-sm font-medium text-ink">{it.label}</span>
                            {it.desc && <span className="block text-xs text-ink-faint">{it.desc}</span>}
                          </>
                        );
                        return it.href.startsWith('/') ? (
                          <Link key={it.label} href={it.href} onClick={() => setOpenMenu(null)} className={cls}>{inner}</Link>
                        ) : (
                          <a key={it.label} href={it.href} onClick={() => setOpenMenu(null)} className={cls}>{inner}</a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/marketplace" className={`text-sm font-medium px-1 ${scrolled ? 'text-ink hover:text-forest' : 'text-white/90 hover:text-white'}`}>Marketplace</Link>
            <Button asChild variant="outline" size="sm" className={!scrolled ? 'border-white/40 text-white bg-transparent hover:bg-white/10' : ''}><Link href="/login">Log in</Link></Button>
            <Button asChild variant="brand" size="sm"><Link href="/signup">Get Started <ArrowRight className="w-4 h-4" /></Link></Button>
          </div>
          <button onClick={() => setMenu(!menu)} className={`lg:hidden p-2 -mr-2 ${scrolled ? 'text-ink' : 'text-white'}`} aria-label="Menu">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-5 py-4 flex flex-col gap-4 text-sm max-h-[72vh] overflow-y-auto">
            {MENUS.map((m) => (
              <div key={m.label}>
                <p className="tag text-ink-faint mb-2">{m.label}</p>
                <div className="flex flex-col gap-1.5 pl-1">
                  {m.items.map((it) =>
                    it.href.startsWith('/') ? (
                      <Link key={it.label} href={it.href} onClick={() => setMenu(false)} className="text-ink-soft hover:text-ink">{it.label}</Link>
                    ) : (
                      <a key={it.label} href={it.href} onClick={() => setMenu(false)} className="text-ink-soft hover:text-ink">{it.label}</a>
                    ),
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
              <Link href="/marketplace" onClick={() => setMenu(false)} className="font-medium text-forest">Carbon Marketplace</Link>
              <Link href="/login" onClick={() => setMenu(false)} className="font-medium">Log in</Link>
              <Button asChild variant="brand" className="w-full"><Link href="/signup" onClick={() => setMenu(false)}>Get Started <ArrowRight className="w-4 h-4" /></Link></Button>
            </div>
          </div>
        )}
      </nav>

      {/* ===================== HERO ===================== */}
      <header className="relative pt-16 overflow-hidden text-white rounded-b-[2rem] md:rounded-b-[3rem]">
        {/* video background + legibility overlays */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay loop muted playsInline preload="auto" poster="/hero-hills.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          >
            <source src="/video/home.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest-deep/75 to-forest-deep/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 via-transparent to-forest-dark/25" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <span data-hero className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-semibold">
              <Hexagon className="w-3.5 h-3.5 text-green-400" /> Built on Algorand
            </span>
            <h1 data-hero className="mt-6 font-display font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(1.9rem,4vw,3.1rem)]">
              Tokenize, Track and Trade <span className="text-gradient">Carbon Impact</span> with Trust.
            </h1>
            <p data-hero className="mt-6 max-w-xl text-base text-white/80">
              A transparent, compliant and scalable infrastructure for creating, verifying
              and trading carbon credits on the Algorand blockchain.
            </p>
            <div data-hero className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="brand" size="lg"><Link href="/signup">Start a Project <ArrowRight className="w-4 h-4" /></Link></Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20"><Link href="/login"><Play className="w-4 h-4" /> Book a Demo</Link></Button>
              </motion.div>
            </div>
            <div data-hero className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              {[['Blockchain Verified', <ShieldCheck key="s" />], ['Audit Ready', <FileCheck key="f" />], ['Impact at Scale', <Leaf key="l" />]].map(([t, ic]) => (
                <span key={t as string} className="inline-flex items-center gap-2">
                  <span className="text-green-400 [&>svg]:w-4 [&>svg]:h-4">{ic as ReactNode}</span>{t as string}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ===================== INFRASTRUCTURE ===================== */}
      <section id="product" className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-24 scroll-mt-16">
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-2xl md:text-[2.1rem] font-bold tracking-[-0.02em] leading-[1.12]">
            An End-to-End <span className="text-green-600">Carbon Credit</span> Infrastructure
          </h2>
          <p className="mt-4 text-ink-soft text-base">
            From project creation to credit trading — everything you need to turn climate action into verifiable value.
          </p>
        </div>
        <div data-stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {infra.map((f) => (
            <div key={f.t}>
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-green-50 text-green-600 [&>svg]:w-6 [&>svg]:h-6 mb-5">{f.icon}</div>
              <h3 className="font-display text-base font-semibold">{f.t}</h3>
              <p className="mt-2 text-ink-soft text-sm leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SOLUTIONS ===================== */}
      <section id="solutions" className="bg-surface-gradient py-20 md:py-24 scroll-mt-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div data-reveal className="max-w-2xl mb-12">
            <p className="tag text-green-600">Solutions</p>
            <h2 className="mt-3 font-display text-2xl md:text-[2.1rem] font-bold tracking-[-0.02em] leading-[1.12]">Built for Real-World Climate Action</h2>
            <p className="mt-4 text-ink-soft text-base">
              Flexible solutions for governments, enterprises and project developers to finance, manage and scale sustainability impact.
            </p>
          </div>
          <div data-stagger className="grid md:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <motion.article key={s.t} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="card-paper overflow-hidden group">
                <div className="h-40 relative overflow-hidden">
                  <img src={s.img} alt={s.t} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/55 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                    <span className="w-9 h-9 grid place-items-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><ArrowRight className="w-4 h-4" /></span>
                  </div>
                  <p className="mt-3 text-ink-soft">{s.d}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how" className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-24 scroll-mt-16">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div data-reveal>
            <p className="tag text-green-600">How it works</p>
            <h2 className="mt-3 font-display text-2xl md:text-[2.1rem] font-bold tracking-[-0.02em] leading-[1.12]">
              From Climate Action to <span className="text-green-600">Carbon Value</span>
            </h2>
            <p className="mt-4 text-ink-soft text-base">A simple, compliant and transparent flow from project to market.</p>
          </div>
          <div data-stagger className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.t} className="relative text-center">
                <div className="w-16 h-16 mx-auto grid place-items-center rounded-2xl border border-gray-200 bg-white text-green-600 [&>svg]:w-7 [&>svg]:h-7 shadow-sm">{s.icon}</div>
                <p className="mt-4 font-semibold text-sm">{s.t}</p>
                <p className="mt-1 text-xs text-ink-faint">{s.d}</p>
                {i < steps.length - 1 && <span className="hidden sm:block absolute top-8 -right-3 text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY ===================== */}
      <section id="why" className="bg-surface-2 py-20 md:py-24 scroll-mt-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <h2 data-reveal className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] mb-12">Why CarbonGero?</h2>
          <div data-stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {why.map((w) => (
              <div key={w.t} className="flex gap-4">
                <span className="shrink-0 w-11 h-11 grid place-items-center rounded-xl bg-white border border-gray-200 text-green-600 [&>svg]:w-5 [&>svg]:h-5">{w.icon}</span>
                <div>
                  <h3 className="font-semibold">{w.t}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRUST ===================== */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 text-center">
        <p data-reveal className="font-display text-xl font-semibold mb-8"><span className="text-green-600">Trusted</span> By Climate Innovators</p>
        <div data-reveal className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 text-ink-faint">
          {trust.map((t) => (
            <span key={t} className="font-display font-semibold text-base md:text-xl grayscale opacity-70 hover:opacity-100 transition-opacity">{t}</span>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pb-20">
        <div data-reveal className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-card p-10 md:p-16">
          <img src="/cta-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/60 to-white/10" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-[2.1rem] font-bold tracking-[-0.02em] leading-[1.12] text-ink">
                Turn Your Climate Projects into <span className="text-green-600">Verifiable Carbon Value</span>.
              </h2>
              <p className="mt-4 text-ink-soft text-base max-w-md">
                Join CarbonGero and build a more transparent, liquid and impactful carbon economy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button asChild variant="brand" size="lg"><Link href="/signup">Get Started <ArrowRight className="w-4 h-4" /></Link></Button>
              <Button asChild variant="secondary" size="lg"><Link href="/login"><Calendar className="w-4 h-4" /> Talk to Our Team</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer id="contact" className="bg-forest-dark text-white/70 scroll-mt-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16">
          <div className="grid md:grid-cols-6 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-2">
              <Logo className="[&_span]:text-white" />
              <p className="mt-4 text-sm leading-relaxed max-w-xs">
                Tokenize · Trade · Mitigate — a blockchain-powered carbon credit infrastructure for a net-zero world.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[['Chrome extension', <Chrome key="c" className="w-3.5 h-3.5" />], ['Mobile app', <Smartphone key="s" className="w-3.5 h-3.5" />]].map(([label, icon]) => (
                  <span key={label as string} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 bg-white/[0.06] border border-white/10 rounded-full pl-2.5 pr-2 py-1.5">
                    <span className="text-green-400">{icon as ReactNode}</span>
                    {label as string}
                    <span className="ml-0.5 text-[0.65rem] font-semibold text-green-400 bg-green-400/10 rounded-full px-1.5 py-0.5">SOON</span>
                  </span>
                ))}
              </div>
            </div>
            {[
              { h: 'Product', links: ['Platform', 'Marketplace', 'Verification', 'Analytics'] },
              { h: 'Solutions', links: ['Governments', 'Enterprises', 'Project Developers', 'Partners'] },
              { h: 'Resources', links: ['Docs', 'Guides', 'Case Studies', 'Blog'] },
              { h: 'Company', links: ['About', 'Team', 'Careers', 'Contact'] },
            ].map((col) => (
              <div key={col.h}>
                <p className="tag text-green-400">{col.h}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href={l === 'Blog' ? '/blog' : '#'} className="link-wipe">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <span>© 2026 CarbonGero. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="link-wipe">Privacy</a>
              <a href="#" className="link-wipe">Terms</a>
              <a href="#" className="link-wipe">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
