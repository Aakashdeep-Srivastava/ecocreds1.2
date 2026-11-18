import type { MetadataRoute } from 'next';
import { getSlugs } from '@/lib/blog';

const BASE = 'https://xecocreds.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSlugs().map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  const routes = ['', '/blog', '/login', '/signup'].map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.8,
  }));
  return [...routes, ...posts];
}
