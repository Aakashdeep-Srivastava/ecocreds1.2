'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Mail, Lock, ArrowRight, Building, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AlgoWalletProvider } from '@/components/wallet-provider';
import { WalletLoginButton } from './WalletLoginButton';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'individual' | 'corporate'>('individual');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    router.push(loginType === 'corporate' ? '/dashboard/corporate' : '/dashboard');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper text-ink">
      {/* ---- Feature panel ---- */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 text-paper overflow-hidden">
        <img src="/auth-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/85 via-forest-deep/65 to-forest-dark/90" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full border border-white/10 animate-spin-slow" />
        <Link href="/" className="relative flex items-center gap-2 w-fit">
          <img src="/logo-mark.png" alt="" className="w-8 h-8 object-contain" />
          <span className="font-display text-2xl font-semibold">CarbonGero</span>
        </Link>

        <div className="relative max-w-md">
          <p className="tag text-lime">Welcome back</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-balance">
            Every action,<br /><span className="text-gradient">accounted for.</span>
          </h2>
          <p className="mt-6 text-paper/80 leading-relaxed">
            Pick up where you left off. Your footprint, credits and rewards —
            all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
            {[['−18%', 'Footprint'], ['5,000', 'Credits'], ['A+', 'Tier']].map(([a, b]) => (
              <div key={b} className="bg-white/5 backdrop-blur-sm p-4">
                <p className="font-display text-2xl stat-num">{a}</p>
                <p className="tag text-paper/55 mt-1">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative tag text-paper/40">Built on Algorand · sustainable ledger</p>
      </aside>

      {/* ---- Form ---- */}
      <main className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 tag text-ink-faint mb-8">
            <ArrowLeft className="w-4 h-4" /> CarbonGero
          </Link>

          <p className="tag text-clay">Sign in</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Welcome back.</h1>
          <p className="mt-2 text-ink-soft">Enter anything — this is an open demo.</p>

          {/* type toggle */}
          <div className="mt-8 grid grid-cols-2 border border-ink/15">
            {(['individual', 'corporate'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setLoginType(t)}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  loginType === t ? 'bg-forest-deep text-paper' : 'text-ink-soft hover:bg-[#faf8f1]'
                }`}>
                {t === 'individual' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                {t === 'individual' ? 'Individual' : 'Corporate'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="tag text-ink-faint">{loginType === 'corporate' ? 'Corporate email' : 'Email'}</span>
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-soft cursor-pointer">
                <input type="checkbox" className="accent-forest w-4 h-4" /> Remember me
              </label>
              <a href="#" className="link-wipe text-ink-soft">Forgot password?</a>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-4">
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{loginType === 'corporate' ? 'Access dashboard' : 'Sign in'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="tag text-ink-faint">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <AlgoWalletProvider>
            <WalletLoginButton />
          </AlgoWalletProvider>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="link-wipe font-semibold text-forest">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
