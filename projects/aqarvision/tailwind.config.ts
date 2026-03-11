import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette AqarVision — Premium
        'bleu-nuit': '#0c1b2a',
        'or': '#b8963e',
        'blanc-casse': '#fafbfc',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input, var(--border)))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive, 0 84% 60%))',
          foreground: 'hsl(var(--destructive-foreground, 0 0% 100%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 210 20% 96%))',
          foreground: 'hsl(var(--muted-foreground, 215 16% 47%))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover, 0 0% 100%))',
          foreground: 'hsl(var(--popover-foreground, 210 40% 8%))',
        },
        card: {
          DEFAULT: 'hsl(var(--card, 0 0% 100%))',
          foreground: 'hsl(var(--card-foreground, 210 40% 8%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary, 210 20% 96%))',
          foreground: 'hsl(var(--secondary-foreground, 210 40% 8%))',
        },
        primary: {
          50:  '#F2F8FC',
          100: '#E0EFF7',
          200: '#B3D4E8',
          300: '#7AB0D4',
          400: '#4A89B5',
          500: '#2D6187',
          600: '#234E6F',
          700: '#1A3F5C',
          800: '#132D46',
          900: '#0C1B2A',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#0A0A0B',
        },
        accent: {
          100: '#FAF3DB',
          300: '#E5CC6E',
          400: '#D4AF37',
          500: '#B8962F',
          600: '#92702A',
        },
        success: {
          100: '#DCFCE7',
          600: '#16A34A',
        },
        error: {
          100: '#FEE2E2',
          600: '#DC2626',
        },
        warning: {
          100: '#FEF3C7',
          600: '#D97706',
        },
        info: {
          100: '#DBEAFE',
          600: '#2563EB',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['var(--font-mono)', 'SF Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display':    ['3.75rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'heading-1':  ['3rem',     { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-2':  ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'heading-3':  ['1.5rem',   { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'heading-4':  ['1.25rem',  { lineHeight: '1.4' }],
        'heading-lg': ['1.75rem',  { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
        'body':       ['1rem',     { lineHeight: '1.6' }],
        'body-md':    ['0.9375rem',{ lineHeight: '1.6'  }],
        'body-sm':    ['0.875rem', { lineHeight: '1.5' }],
        'caption':    ['0.75rem',  { lineHeight: '1.4' }],
        'price':      ['1.625rem', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'price-sm':   ['1.125rem', { lineHeight: '1.2',  letterSpacing: '-0.005em', fontWeight: '600' }],
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        full: '9999px',
      },
      boxShadow: {
        xs:           '0 1px 2px rgba(0,0,0,0.04)',
        sm:           '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md:           '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
        lg:           '0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)',
        xl:           '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)',
        card:         '0 2px 8px -2px rgba(0,0,0,0.05), 0 4px 16px -4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.08)',
        soft:         '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
        elevated:     '0 8px 30px -8px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.04)',
        float:        '0 20px 60px -12px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.06)',
      },
      spacing: {
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '20px',
        6:  '24px',
        8:  '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
      },
      screens: {
        sm:  '640px',
        md:  '1024px',
        lg:  '1280px',
        xl:  '1536px',
      },
      maxWidth: {
        content:    '1200px',
        'content-lg': '1320px',
        'content-xl': '1440px',
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        'heart-bounce': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Keep existing luxury animations
        'luxury-fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'luxury-scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(10px)' },
        },
        'luxury-line-grow': {
          from: { width: '0' },
          to:   { width: '80px' },
        },
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
        'heart-bounce':   'heart-bounce 0.3s ease',
        'toast-in':       'toast-in 200ms ease-out',
        'fade-in':        'fade-in 200ms ease-out',
        'slide-up':       'slide-up 250ms ease-out',
        'luxury-fade-in-up':       'luxury-fade-in-up 0.8s ease-out forwards',
        'luxury-scroll-bounce':    'luxury-scroll-bounce 2s ease-in-out infinite',
        'luxury-line-grow':        'luxury-line-grow 1s ease-out 0.5s forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
