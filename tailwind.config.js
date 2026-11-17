/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-hanken)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Signature Carbon Almanac palette
        paper: {
          DEFAULT: '#F2EEE1',
          soft: '#E9E2CF',
          deep: '#DED6C0',
        },
        ink: {
          DEFAULT: '#15120B',
          soft: '#4B463A',
          faint: '#7C755F',
        },
        forest: {
          DEFAULT: '#1E3A27',
          deep: '#12241A',
          dark: '#0C1911',
        },
        lime: {
          DEFAULT: '#CBF24A',
          deep: '#A9D62E',
          dim: '#8FB824',
        },
        clay: {
          DEFAULT: '#C9603A',
          soft: '#DD8A62',
        },
        sky: {
          DEFAULT: '#3E7C8C',
        },
        // Re-map Tailwind's default greens to a refined forest ramp so that
        // every existing component instantly adopts the new system.
        green: {
          50: '#EEF2EA',
          100: '#DCE5D3',
          200: '#BFD1B1',
          300: '#99B386',
          400: '#6E8E5B',
          500: '#45663A',
          600: '#1E3A27',
          700: '#16301D',
          800: '#102417',
          900: '#0B1A11',
        },
        // Warm the neutral ramp into "ink on paper" rather than cold grey.
        gray: {
          50: '#F6F3EA',
          100: '#ECE7D9',
          200: '#DED8C6',
          300: '#C4BCA4',
          400: '#9B9378',
          500: '#726B55',
          600: '#514B3A',
          700: '#3A3527',
          800: '#26221A',
          900: '#161309',
        },
        eco: {
          50: '#EEF2EA',
          100: '#DCE5D3',
          200: '#BFD1B1',
          500: '#45663A',
          600: '#1E3A27',
          700: '#16301D',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 0 0 rgba(21,18,11,0.04), 0 18px 40px -24px rgba(21,18,11,0.28)',
        'lift': '0 24px 60px -28px rgba(12,25,17,0.45)',
        'inset-line': 'inset 0 0 0 1px rgba(21,18,11,0.1)',
      },
      letterSpacing: {
        'ultra': '0.32em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'marquee': 'marquee 38s linear infinite',
        'floaty': 'floaty 7s ease-in-out infinite',
        'grow-w': 'growW 1.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow': 'spin 22s linear infinite',
        'blink': 'blink 1.3s steps(2) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(26px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        growW: { '0%': { width: '0%' }, '100%': { width: 'var(--to, 100%)' } },
        blink: { '0%': { opacity: '1' }, '100%': { opacity: '0.2' } },
      },
    },
  },
  plugins: [],
}
