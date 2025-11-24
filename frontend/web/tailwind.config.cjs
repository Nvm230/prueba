module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #9333EA)',
          50: 'var(--color-primary-50, #faf5ff)',
          100: 'var(--color-primary-100, #f3e8ff)',
          200: 'var(--color-primary-200, #e9d5ff)',
          300: 'var(--color-primary-300, #d8b4fe)',
          400: 'var(--color-primary-400, #c084fc)',
          500: 'var(--color-primary-500, #9333EA)',
          600: 'var(--color-primary-600, #7e22ce)',
          700: 'var(--color-primary-700, #6b21a8)',
          800: 'var(--color-primary-800, #581c87)',
          900: 'var(--color-primary-900, #3b0764)'
        },
        accent: {
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490'
          },
          amber: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309'
          },
          rose: {
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c'
          }
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D'
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0F172A'
        },
        slate: {
          925: '#0a0f1e',
          950: '#020617'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(79, 70, 229, 0.25)',
        'soft-lg': '0 20px 40px -15px rgba(79, 70, 229, 0.3)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-primary': '0 0 30px rgba(147, 51, 234, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(147, 51, 234, 0.1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
