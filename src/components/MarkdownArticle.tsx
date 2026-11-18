'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Mermaid } from './Mermaid';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
}
function text(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(text).join('');
  return '';
}

export function MarkdownArticle({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={slugify(text(children))} className="font-display text-xl md:text-2xl font-bold tracking-tight text-ink dark:text-white mt-10 mb-3 scroll-mt-24">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(text(children))} className="font-display text-lg font-semibold text-ink dark:text-white mt-7 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-[0.95rem] leading-7 text-ink-soft dark:text-white/70 my-4">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium underline underline-offset-2 hover:text-green-700">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink dark:text-white">{children}</strong>,
          ul: ({ children }) => <ul className="my-4 space-y-2 pl-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 space-y-2 list-decimal pl-5 text-ink-soft dark:text-white/70">{children}</ol>,
          li: ({ children }) => (
            <li className="flex gap-2.5 text-[0.95rem] leading-7 text-ink-soft dark:text-white/70 [li>&]:block">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-green-500 bg-green-50/60 dark:bg-green-500/5 rounded-r-xl px-5 py-3 text-ink dark:text-white font-medium italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50 dark:bg-white/5">{children}</thead>,
          th: ({ children }) => <th className="text-left font-semibold text-ink dark:text-white px-4 py-2.5 border-b border-gray-200 dark:border-white/10">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 border-b border-gray-100 dark:border-white/5 text-ink-soft dark:text-white/70 align-top">{children}</td>,
          hr: () => <hr className="my-8 border-gray-200 dark:border-white/10" />,
          pre: ({ children }) => {
            const child: any = Array.isArray(children) ? children[0] : children;
            const cls: string = child?.props?.className || '';
            const code = child?.props?.children;
            if (/language-mermaid/.test(cls)) return <Mermaid chart={text(code)} />;
            return <pre className="my-5 overflow-x-auto rounded-xl bg-[#0b0d0c] text-green-200 p-4 text-xs">{children}</pre>;
          },
          code: ({ className, children }) => {
            if (/language-/.test(className || '')) return <code className={className}>{children}</code>;
            return <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[0.85em] text-ink dark:text-white font-mono">{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
