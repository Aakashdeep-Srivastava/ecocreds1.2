'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Mail, Lock, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const perks = ['Personal impact dashboard', 'Community challenges & rewards', 'Carbon credits that count'];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper text-ink">
      {/* ---- Form ---- */}
      <main className="flex items-center justify-center p-6 md:p-10 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 tag text-ink-faint mb-8">
            <ArrowLeft className="w-4 h-4" /> CarbonGero
          </Link>

          <p className="tag text-clay">Create account</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Join CarbonGero.</h1>
          <p className="mt-2 text-ink-soft">Start your sustainable journey — open demo, no verification.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="tag text-ink-faint">Email address</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@planet.earth"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#faf8f1] border border-ink/15 focus:border-forest focus:bg-white outline-none focus:ring-2 focus:ring-lime/60 transition" />
              </div>
            </label>
            <label className="block">
              <span className="tag text-ink-faint">Password</span>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#faf8f1] border border-ink/15 focus:border-forest focus:bg-white outline-none focus:ring-2 focus:ring-lime/60 transition" />
              </div>
            </label>

            <button type="submit" className="btn-primary w-full !py-4">
              Create account <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link href="/login" className="link-wipe font-semibold text-forest">Sign in</Link>
          </p>
        </div>
      </main>

      {/* ---- Feature panel ---- */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 bg-forest-deep text-paper bg-dots overflow-hidden order-1 lg:order-2">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border border-white/10 animate-spin-slow" />
        <Link href="/" className="relative flex items-center gap-2 w-fit self-end">
          <span className="font-display text-2xl font-semibold">CarbonGero</span>
          <Leaf className="w-7 h-7 text-lime" strokeWidth={1.5} />
        </Link>

        <div className="relative max-w-md ml-auto text-right">
          <p className="tag text-lime">№ 02 — Begin</p>
          <h2 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance">
            Small actions,<br /><span className="italic font-normal">big arithmetic.</span>
          </h2>
          <ul className="mt-9 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center justify-end gap-3 text-paper/80">
                {p} <span className="w-6 h-6 grid place-items-center bg-lime text-ink shrink-0"><Check className="w-4 h-4" /></span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative tag text-paper/40 self-end">Vol. I · The Carbon Almanac</p>
      </aside>
    </div>
  );
}
