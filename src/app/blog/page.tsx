import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'CarbonGero Blog — India CCTS, EU CBAM & Carbon Markets',
  description:
    "Fact-based field notes on India's Carbon Credit Trading Scheme (CCTS), EU CBAM, MSME carbon credits, Article 6 exports and the circular carbon economy.",
  keywords:
    'India CCTS, EU CBAM, carbon credits India, MSME carbon credits, carbon market blog, Article 6, circular carbon economy',
  openGraph: {
    title: 'CarbonGero Blog — Carbon markets, decoded',
    description: "Fact-based analysis of India's carbon markets, CBAM, and the circular carbon economy.",
    type: 'website',
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <main className="max-w-[1100px] mx-auto px-5 py-12 md:py-16">
      <p className="tag text-green-600">The CarbonGero Brief</p>
      <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold tracking-tight">Carbon markets, decoded.</h1>
      <p className="mt-4 text-base md:text-lg text-ink-soft dark:text-white/60 max-w-2xl">
        Field notes on India&apos;s CCTS, the EU&apos;s CBAM, MSME carbon credits and the circular carbon economy —
        written for people who actually have to act on this, not just talk about it.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-6 hover:border-green-400 dark:hover:border-green-500/50 hover:shadow-card transition-all"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-full px-2.5 py-0.5">
                {p.category}
              </span>
              <span className="text-ink-faint dark:text-white/40">{p.readingTime}</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold tracking-tight group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
              {p.title}
            </h2>
            <p className="mt-2 text-sm text-ink-soft dark:text-white/60">{p.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-ink-faint dark:text-white/40">
                {p.author} ·{' '}
                {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-white/30 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
