'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState('');

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
          lineColor: dark ? '#4b5563' : '#9ca3af',
          secondaryColor: dark ? '#1a2a22' : '#f1f5f9',
          tertiaryColor: dark ? '#161b19' : '#ffffff',
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '14px',
        },
      });
      try {
        const { svg } = await mermaid.render(`mmd-${counter++}`, chart.trim());
        if (active) setSvg(svg);
      } catch {
        if (active) setSvg(`<pre class="text-xs text-red-500">diagram error</pre>`);
      }
    })();
    return () => {
      active = false;
    };
  }, [chart, theme]);

  return (
    <div
      className="my-7 flex justify-center overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.03] p-4 [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
