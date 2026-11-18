'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Maximize2, X } from 'lucide-react';

let counter = 0;

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState('');
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mermaid = (await import('mermaid')).default;
      const dark = theme === 'dark';
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'base',
        themeVariables: {
          primaryColor: dark ? '#13241b' : '#edfcf2',
          primaryBorderColor: '#00c853',
          primaryTextColor: dark ? '#f5f7f6' : '#0b0d0c',
          lineColor: dark ? '#5b6b63' : '#94a3b8',
          secondaryColor: dark ? '#1a2a22' : '#e8fdf0',
          tertiaryColor: dark ? '#161b19' : '#ffffff',
          fontSize: '16px',
        },
        flowchart: { htmlLabels: true, padding: 16, nodeSpacing: 48, rankSpacing: 60, useMaxWidth: true, curve: 'basis' },
      });
      try {
        const { svg } = await mermaid.render(`mmd-${counter++}`, chart.trim());
        if (active) setSvg(svg);
      } catch {
        if (active) setSvg('<pre class="text-xs text-red-500">diagram error</pre>');
      }
    })();
    return () => {
      active = false;
    };
  }, [chart, theme]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom]);

  return (
    <>
      <figure
        onClick={() => setSvg((s) => (s ? (setZoom(true), s) : s))}
        className="group relative my-7 cursor-zoom-in rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-b from-green-50/40 to-white dark:from-white/[0.04] dark:to-[#0f1512] p-5 md:p-7"
      >
        <div
          className="flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-[640px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <button
          type="button"
          aria-label="Enlarge diagram"
          className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-ink-soft dark:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <figcaption className="mt-3 text-center text-xs text-ink-faint dark:text-white/40">
          {caption || 'Diagram'} · tap to enlarge
        </figcaption>
      </figure>

      {zoom && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm p-4 md:p-10" onClick={() => setZoom(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 grid place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] overflow-auto rounded-2xl bg-white dark:bg-[#161b19] p-6 md:p-10 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}
    </>
  );
}
