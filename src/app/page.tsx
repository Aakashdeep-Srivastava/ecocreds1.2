'use client';
import {
  Leaf, Users, ArrowRight, ArrowUpRight, Check, LineChart,
  TrendingUp, Globe, Building, Star, Sparkles, Plus, Menu, X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/* ---- rotating almanac seal ------------------------------- */
function Seal() {
  return (
    <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="seal" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-[#f2eee1]" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: 6 }}>
          <textPath href="#seal" startOffset="0%">
            · CARBON ALMANAC · EST. 2024 · SMART FOR BUSINESS · GREAT FOR PLANET
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Leaf className="w-10 h-10 text-lime" strokeWidth={1.4} />
      </div>
    </div>
  );
}

const TICKER = [
  'CO₂ TRACKED · 48.2kt', 'EV RIDES LOGGED · 12,904', 'TREES EQUIVALENT · 61,300',
  'ACTIVE CHANGEMAKERS · 8,412', 'CHALLENGES RUNNING · 37', 'WATER SAVED · 2.1M L',
];

export default function Home() {
  const [menu, setMenu] = useState(false);

  const stats = [
    { n: '48.2kt', l: 'CO₂ accounted' },
    { n: '8,412', l: 'Changemakers' },
    { n: '37', l: 'Live challenges' },
    { n: '61.3k', l: 'Trees equiv.' },
  ];

  const features = [
    {
      k: '01', title: 'Connect & Track',
      body: 'Join a community making sustainability simple and rewarding. Log daily activity, join challenges, earn real rewards.',
      tags: ['Activity tracking', 'Community challenges', 'Digital rewards'], icon: <Users />,
    },
    {
      k: '02', title: 'Measure & Report',
      body: 'Turn complex sustainability data into clear insight and reports that prove your environmental impact.',
      tags: ['Impact analytics', 'Progress reports', 'Performance tracking'], icon: <LineChart />,
    },
    {
      k: '03', title: 'Grow & Share',
      body: 'Be part of a movement. Share your journey, inspire others, and compound small actions into measurable change.',
      tags: ['Success stories', 'Community impact', 'Knowledge sharing'], icon: <Sparkles />,
    },
  ];

  const individual = [
    { s: 'Start', t: 'Track your impact', d: 'Connect daily activity to sustainability metrics.', icon: <Leaf /> },
    { s: 'Engage', t: 'Join challenges', d: 'Take part in community initiatives and earn rewards.', icon: <Users /> },
    { s: 'Grow', t: 'Lead change', d: 'Inspire others and widen your positive impact.', icon: <Star /> },
  ];
  const business = [
    { s: 'Start', t: 'Measure & report', d: 'Stand up your sustainability tracking framework.', icon: <LineChart /> },
    { s: 'Optimize', t: 'Improve & adapt', d: 'Use insight to sharpen sustainability practices.', icon: <TrendingUp /> },
    { s: 'Scale', t: 'Expand impact', d: 'Grow initiatives across every operation.', icon: <Globe /> },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden">
      {/* ===================== NAV ===================== */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-paper/85 backdrop-blur-md border-b border-ink/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight">CarbonGero</span>
            <span className="tag text-ink-faint hidden sm:inline">/ index</span>
          </Link>
          <div className="hidden md:flex items-center gap-9 text-sm font-medium">
            <a href="#features" className="link-wipe">Features</a>
            <a href="#journey" className="link-wipe">Journey</a>
            <a href="#community" className="link-wipe">Community</a>
            <Link href="/login" className="link-wipe">Login</Link>
            <Link href="/signup" className="btn-primary !px-5 !py-2.5 text-sm">
              Join the movement <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <button onClick={() => setMenu(!menu)} className="md:hidden p-2 -mr-2" aria-label="Menu">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <div className="md:hidden border-t border-ink/10 bg-paper px-5 py-4 flex flex-col gap-4 text-sm font-medium">
            <a href="#features" onClick={() => setMenu(false)}>Features</a>
            <a href="#journey" onClick={() => setMenu(false)}>Journey</a>
            <a href="#community" onClick={() => setMenu(false)}>Community</a>
            <Link href="/login" onClick={() => setMenu(false)}>Login</Link>
            <Link href="/signup" className="btn-primary text-sm" onClick={() => setMenu(false)}>
              Join the movement <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </nav>

      {/* ===================== TICKER ===================== */}
      <div className="fixed top-16 inset-x-0 z-40 bg-forest-deep text-paper/90 border-b border-black/20 overflow-hidden marquee-mask">
        <div className="marquee-track py-2">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="tag flex items-center gap-4 px-6 whitespace-nowrap text-paper/70">
              <span className="w-1.5 h-1.5 rounded-full bg-lime" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ===================== HERO ===================== */}
      <header className="pt-40 md:pt-48 pb-16 px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <p className="tag text-ink-faint reveal" style={{ animationDelay: '.05s' }}>
              № 01 — The sustainability index
            </p>
            <h1 className="mt-6 font-display font-semibold leading-[0.92] tracking-tight text-[clamp(2.9rem,8vw,6.4rem)] text-balance">
              <span className="reveal block" style={{ animationDelay: '.12s' }}>Smart for</span>
              <span className="reveal block" style={{ animationDelay: '.2s' }}>
                Business, <span className="italic font-normal text-forest">great</span>
              </span>
              <span className="reveal block" style={{ animationDelay: '.28s' }}>for Planet.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-ink-soft reveal text-pretty" style={{ animationDelay: '.36s' }}>
              A field guide to real climate action. Track, measure and reward
              sustainability — for people and the organisations they move.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 reveal" style={{ animationDelay: '.44s' }}>
              <Link href="/signup" className="btn-primary">
                Start your journey <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-ghost">Read the almanac</a>
            </div>
          </div>

          {/* forest readout panel */}
          <div className="lg:col-span-5 reveal-slow" style={{ animationDelay: '.3s' }}>
            <div className="relative bg-forest-deep text-paper p-7 md:p-9 bg-dots">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="tag text-lime">Live carbon index</p>
                  <p className="mt-3 font-display text-6xl font-semibold stat-num">428<span className="text-lime">.6</span></p>
                  <p className="tag text-paper/60 mt-2">ppm · global · trending</p>
                </div>
                <Seal />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-px bg-white/10 border border-white/10">
                {[['−18%', 'Footprint'], ['+240', 'This week'], ['A+', 'Eco tier']].map(([a, b]) => (
                  <div key={b} className="bg-forest-deep p-4">
                    <p className="font-display text-2xl stat-num">{a}</p>
                    <p className="tag text-paper/55 mt-1">{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-paper/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-lime animate-blink" />
                <span className="tag">Built on Algorand · sustainable ledger</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== STAT BAND ===================== */}
      <section className="px-5 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 border-y border-ink/15">
          {stats.map((s, i) => (
            <div key={s.l}
              className={`py-8 px-6 ${i !== 0 ? 'border-l border-ink/15' : ''} ${i === 2 ? 'border-l-0 lg:border-l' : ''} ${i >= 2 ? 'border-t border-ink/15 lg:border-t-0' : ''}`}>
              <p className="font-display text-4xl md:text-5xl font-semibold stat-num">{s.n}</p>
              <p className="tag text-ink-faint mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="tag text-clay">Chapter I — The Platform</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                Sustainability,<br />made legible.
              </h2>
            </div>
            <p className="max-w-sm text-ink-soft md:text-right">
              Track, measure and improve environmental impact with tools designed for
              everyone — from individuals to enterprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border-t border-ink/15">
            {features.map((f) => (
              <article key={f.k}
                className="group relative p-8 md:p-9 border-b border-ink/15 md:border-b-0 md:border-r md:last:border-r-0 border-ink/15 hover:bg-[#faf8f1] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-ink-faint">{f.k}</span>
                  <span className="text-forest group-hover:text-clay transition-colors [&>svg]:w-6 [&>svg]:h-6">{f.icon}</span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{f.body}</p>
                <ul className="mt-6 space-y-2">
                  {f.tags.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-ink-soft">
                      <Plus className="w-3.5 h-3.5 text-lime-deep" /> {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== JOURNEY ===================== */}
      <section id="journey" className="px-5 md:px-8 py-24 md:py-28 bg-forest-deep text-paper">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="tag text-lime">Chapter II — Your Path</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight">Choose your journey</h2>
            <p className="mt-4 text-paper/70 max-w-xl mx-auto">
              Whether you move as an individual or an organisation, there is a route to measurable impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {[{ h: 'For Individuals', s: 'Make every action count', icon: <Users />, steps: individual },
              { h: 'For Businesses', s: 'Lead the change', icon: <Building />, steps: business }].map((col) => (
              <div key={col.h} className="bg-forest-deep p-8 md:p-10">
                <div className="flex items-center gap-4 pb-8 border-b border-white/10">
                  <span className="text-lime [&>svg]:w-8 [&>svg]:h-8">{col.icon}</span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{col.h}</h3>
                    <p className="text-paper/60 text-sm">{col.s}</p>
                  </div>
                </div>
                <div className="mt-8 space-y-8">
                  {col.steps.map((st, i) => (
                    <div key={st.t} className="flex gap-5">
                      <div className="shrink-0 w-12 text-center">
                        <span className="tag text-lime">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="flex-1 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                        <p className="tag text-paper/50">{st.s}</p>
                        <p className="mt-1 font-display text-xl">{st.t}</p>
                        <p className="text-paper/65 text-sm mt-1">{st.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CAPABILITIES ===================== */}
      <section className="px-5 md:px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="tag text-clay">Chapter III — How it works</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              Simple tools for real impact.
            </h2>
            <div className="mt-10 space-y-8">
              {[
                { t: 'Activity Tracking', d: 'Connect daily actions to meaningful sustainability metrics.', icon: <LineChart /> },
                { t: 'Community Platform', d: 'Join challenges and share with like-minded people and orgs.', icon: <Users /> },
                { t: 'Impact Analytics', d: 'Understand and improve your footprint with clear insight.', icon: <Globe /> },
              ].map((c) => (
                <div key={c.t} className="flex gap-5 group">
                  <div className="shrink-0 w-12 h-12 grid place-items-center border border-ink/15 bg-[#faf8f1] group-hover:bg-forest group-hover:text-lime transition-colors [&>svg]:w-5 [&>svg]:h-5">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{c.t}</h3>
                    <p className="text-ink-soft mt-1">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-paper p-8 md:p-10">
            <p className="tag text-ink-faint">Platform features</p>
            <div className="mt-8 space-y-7">
              {[['Personal impact tracking', 100], ['Community challenges', 100], ['Business analytics', 100]].map(([t, v]) => (
                <div key={t as string}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-ink-soft">{t}</span>
                    <span className="tag text-forest">Available now</span>
                  </div>
                  <div className="h-2 bg-ink/10 overflow-hidden">
                    <div className="h-full bg-forest" style={{ ['--to' as string]: `${v}%`, animation: 'growW 1.4s cubic-bezier(0.16,1,0.3,1) forwards' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-ink/15 flex items-center justify-between">
              <span className="font-display text-lg">Ready in minutes.</span>
              <Link href="/signup" className="link-wipe font-medium inline-flex items-center gap-1">
                Get started <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== COMMUNITY ===================== */}
      <section id="community" className="px-5 md:px-8 pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <p className="tag text-clay">Chapter IV — Join us</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight">Be part of the change</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Users />, t: 'Community Challenges', d: 'Join monthly challenges and compete to create positive change.' },
              { icon: <Star />, t: 'Recognition Program', d: 'Earn badges and rewards as you progress on your journey.' },
              { icon: <Globe />, t: 'Global Impact', d: 'See how your actions contribute to global sustainability goals.' },
            ].map((c) => (
              <article key={c.t} className="card-paper p-8 group hover:-translate-y-1 transition-transform duration-500">
                <span className="text-forest group-hover:text-clay transition-colors [&>svg]:w-9 [&>svg]:h-9">{c.icon}</span>
                <h3 className="mt-7 font-display text-xl font-semibold">{c.t}</h3>
                <p className="mt-2 text-ink-soft">{c.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="px-5 md:px-8 pb-24">
        <div className="max-w-[1400px] mx-auto bg-lime text-ink p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full border border-ink/20 animate-spin-slow" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="tag text-ink/60">Colophon</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                Ready to start your journey?
              </h2>
            </div>
            <div className="lg:text-right">
              <p className="text-ink/80 text-lg mb-7">
                Join a community of changemakers and start making a measurable difference today.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/signup" className="btn-ghost !border-ink/80 bg-ink text-paper hover:bg-forest-deep">
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn-ghost">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer id="contact" className="bg-forest-dark text-paper/70">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-1">
              <span className="font-display text-3xl font-semibold text-paper">CarbonGero</span>
              <p className="mt-4 text-sm leading-relaxed">
                The Carbon Almanac. Smart for Business, Great for Planet — making sustainability accessible and rewarding.
              </p>
            </div>
            {[
              { h: 'Platform', links: ['Features', 'Community', 'Resources', 'Documentation'] },
              { h: 'Resources', links: ['Getting started', 'Guide', 'Blog', 'Support'] },
              { h: 'Contact', links: ['hello@carbongero.com', 'Bangalore, India'] },
            ].map((col) => (
              <div key={col.h}>
                <p className="tag text-lime">{col.h}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="link-wipe">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tag text-paper/50">
            <span>© 2025 CarbonGero · Vol. I</span>
            <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime" /> Great for Planet</span>
            <div className="flex gap-6">
              <a href="#" className="link-wipe">Privacy</a>
              <a href="#" className="link-wipe">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
