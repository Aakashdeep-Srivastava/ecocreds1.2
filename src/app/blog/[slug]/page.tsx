import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPost, getSlugs, getAllPosts } from '@/lib/blog';
import { MarkdownArticle } from '@/components/MarkdownArticle';

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — CarbonGero`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.keywords,
    author: { '@type': 'Person', name: post.author, jobTitle: post.authorRole },
    publisher: { '@type': 'Organization', name: 'CarbonGero', url: 'https://xecocreds.vercel.app' },
    mainEntityOfPage: `https://xecocreds.vercel.app/blog/${post.slug}`,
  };

  return (
    <main className="max-w-[760px] mx-auto px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="inline-flex items-center gap-2 tag text-ink-faint dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> All posts
      </Link>

      <span className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-full px-2.5 py-0.5">
        {post.category}
      </span>
      <h1 className="mt-4 font-display text-3xl md:text-[2.4rem] font-bold tracking-tight leading-[1.12]">{post.title}</h1>
      <p className="mt-4 text-lg text-ink-soft dark:text-white/60">{post.description}</p>

      <div className="mt-6 flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-white/10">
        <span className="w-11 h-11 grid place-items-center rounded-full bg-brand-gradient text-[#07210f] font-display font-bold text-sm shrink-0">
          {initials(post.author)}
        </span>
        <div>
          <p className="font-semibold text-sm text-ink dark:text-white">{post.author}</p>
          <p className="text-xs text-ink-faint dark:text-white/40">
            {post.authorRole ? `${post.authorRole} · ` : ''}
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readingTime}
          </p>
        </div>
      </div>

      <article className="mt-6">
        <MarkdownArticle content={post.content} />
      </article>

      <div className="mt-12 flex flex-wrap gap-2">
        {post.tags?.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-ink-soft dark:text-white/50">#{t}</span>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <p className="tag text-green-600 mb-4">Keep reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161b19] p-4 hover:border-green-400 transition-colors">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">{r.category}</p>
                <p className="mt-1 font-display font-semibold text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{r.title}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink-faint dark:text-white/40">Read <ArrowRight className="w-3 h-3" /></span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
