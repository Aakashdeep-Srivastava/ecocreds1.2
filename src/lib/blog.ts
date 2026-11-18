import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DIR = path.join(process.cwd(), 'src/content/blog');

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorRole?: string;
  category: string;
  tags: string[];
  keywords: string;
  readingTime: string;
};

export type Post = PostMeta & { content: string };

export function getSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPost(slug: string): Post | null {
  const fp = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const { data, content } = matter(fs.readFileSync(fp, 'utf8'));
  return { slug, content, ...(data as Omit<PostMeta, 'slug'>) } as Post;
}

export function getAllPosts(): Post[] {
  return (getSlugs().map(getPost).filter(Boolean) as Post[]).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}
