import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF3FB',
          100: '#D7E3F6',
          200: '#B0C6ED',
          300: '#7FA2DF',
          400: '#4E7BCB',
          500: '#2A5CB0',
          600: '#1B4693',
          700: '#14367A',
          800: '#0F2A5E',
          900: '#0A1E44',
          950: '#06122A',
        },
        accent: {
          DEFAULT: '#1E63C4',
          hover: '#1854A8',
        },
        saffron: '#E8850C',
        trigreen: '#0E7A3C',
        chakra: '#0A1E44',
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        evidence: {
          DEFAULT: '#0E7A3C',
          bg: '#E8F5EE',
        },
        generated: {
          DEFAULT: '#6D28D9',
          bg: '#F3EEFD',
        },
        insufficient: {
          DEFAULT: '#B45309',
          bg: '#FEF3E2',
        },
        demo: {
          DEFAULT: '#B45309',
          bg: '#FEF3E2',
        },
        success: {
          DEFAULT: '#0E7A3C',
          bg: '#E8F5EE',
        },
        warning: {
          DEFAULT: '#B45309',
          bg: '#FEF3E2',
        },
        error: {
          DEFAULT: '#B3261E',
          bg: '#FDECEA',
        },
        info: {
          DEFAULT: '#1B4693',
          bg: '#EEF3FB',
        },
        processing: {
          DEFAULT: '#6D28D9',
          bg: '#F3EEFD',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        indic: ['var(--font-indic)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
      },
      spacing: {
        sidebar: '280px',
        'sidebar-collapsed': '72px',
        'source-panel': '380px',
        'chat-content': '820px',
      },
      maxWidth: {
        content: '1440px',
        chat: '820px',
        prose: '68ch',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(10, 30, 68, 0.06)',
        sm: '0 1px 3px rgba(10, 30, 68, 0.08), 0 1px 2px rgba(10, 30, 68, 0.04)',
        md: '0 4px 10px rgba(10, 30, 68, 0.08)',
        lg: '0 10px 24px rgba(10, 30, 68, 0.10)',
        focus: '0 0 0 3px rgba(30, 99, 196, 0.35)',
      },
      transitionDuration: {
        micro: '120ms',
        DEFAULT: '180ms',
        overlay: '240ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-in-right': 'slideInRight 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-in-left': 'slideInLeft 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-in-up': 'slideInUp 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
