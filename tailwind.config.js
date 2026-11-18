/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sora)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-inter)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // ---- Official CarbonGero brand ----
        brand: {
          lime: '#A8FF00',
          emerald: '#00C853',
          teal: '#00D1B2',
        },
        charcoal: '#0B0D0C',
        surface: {
          DEFAULT: '#F8FAFC',
          2: '#F8FAFC',
          3: '#F1F5F9',
        },
        success: '#22C55E',
        info: '#0EA5E9',
        warning: '#F59E0B',
        error: '#EF4444',

        // ---- Repointed legacy tokens → official light system ----
        paper: { DEFAULT: '#FFFFFF', soft: '#F8FAFC', deep: '#F1F5F9' },
        ink: { DEFAULT: '#0B0D0C', soft: '#374151', faint: '#6B7280' },
        // forest.DEFAULT = emerald accent; forest.deep/dark = charcoal dark panels
        forest: { DEFAULT: '#00C853', deep: '#0B0D0C', dark: '#070908' },
        lime: { DEFAULT: '#A8FF00', deep: '#00CB53', dim: '#7ACC00' },
        clay: { DEFAULT: '#00D1B2', soft: '#5FE3D0' },
        sky: { DEFAULT: '#0EA5E9' },

        // Emerald-centered ramp so existing green-* classes adopt the brand
        green: {
          50: '#EDFCF2',
          100: '#D4F7E0',
          200: '#A6EFC2',
          300: '#5FE39A',
          400: '#16D16E',
          500: '#00C853',
          600: '#00B24A',
          700: '#009640',
          800: '#0A6E34',
          900: '#0C4C27',
        },
        // Official neutral ramp
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#0B0D0C',
        },
        eco: { 50: '#EDFCF2', 100: '#D4F7E0', 200: '#A6EFC2', 500: '#00C853', 600: '#00B24A', 700: '#009640' },

        // ---- shadcn/ui token bindings (map to CSS vars) ----
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #A8FF00 0%, #00CB53 55%, #00D1B2 100%)',
        'accent-gradient': 'linear-gradient(135deg, #00D1B2 0%, #A8FF00 100%)',
        'surface-gradient': 'linear-gradient(135deg, #F8FFF9 0%, #E8FDF0 50%, #D5FBE6 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 6px)',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0,200,83,0.08)',
        'lift': '0 16px 40px rgba(0,200,83,0.16)',
        'brand': '0 10px 30px -8px rgba(0,200,83,0.35)',
      },
      letterSpacing: { ultra: '0.28em' },
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
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(26px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.94)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        growW: { '0%': { width: '0%' }, '100%': { width: 'var(--to, 100%)' } },
        blink: { '0%': { opacity: '1' }, '100%': { opacity: '0.2' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
