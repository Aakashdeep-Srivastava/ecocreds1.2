import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-[#0B0D0C] dark:text-white">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0B0D0C]/85 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="" className="w-7 h-7 object-contain" />
            <span className="font-display text-lg font-bold">Carbon<span className="text-green-600">Gero</span></span>
            <span className="tag text-ink-faint dark:text-white/40 hidden sm:inline ml-1">/ blog</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-ink-soft dark:text-white/60 hover:text-ink dark:hover:text-white hidden sm:inline">Home</Link>
            <Button asChild variant="brand" size="sm"><Link href="/dashboard">Open app</Link></Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-gray-200 dark:border-white/10 mt-16">
        <div className="max-w-[1100px] mx-auto px-5 py-8 text-xs text-ink-faint dark:text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CarbonGero · Xphora AI Technology Pvt. Ltd.</span>
          <span className="tag">AI · Sustainability · Blockchain</span>
        </div>
      </footer>
    </div>
  );
}
