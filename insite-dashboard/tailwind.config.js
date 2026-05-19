import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors with aliases
        'primary': '#083791',       // Primary brand color (insite-blue)
        'secondary': '#18c8ff',     // Secondary accent (insite-cyan)
        'accent': '#FF8E32',        // Call-to-action color (insite-orange)
        'insite': {
          'blue': '#083791',        // Primary brand color
          'cyan': '#18c8ff',        // Secondary accent  
          'light-blue': '#4fc1f0',  // Light blue variant
          'orange': '#FF8E32',      // Call-to-action color
          'warning': '#ffc107',     // Warning color from original
        },
        'neutral': {
          50: '#ffffff',
          100: '#f7f7f7',
          200: '#f1f1f1',  
          300: '#e5e5e5',
          400: '#848e9f',
          500: '#555555',
          600: '#17161a',
          700: '#151616',
          800: '#1b1a1a',
          900: '#000000',
        },
        'background': {
          'light': '#fafcfe',
          'gray': '#fbf9f9',
          'section': '#f7f8ff',
        },
        // Redesign dark palette
        'ink':   '#0a0f1e',
        'slate-dark': '#1c2438',
        'pulse': '#00d9a6',
        'mist':  '#8898b4',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'bricolage': ['Bricolage Grotesque', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'hero-lg': ['3.5rem', { lineHeight: '1.1' }],
        'hero-md': ['2.5rem', { lineHeight: '1.2' }],
        'hero-sm': ['1.875rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'counter': 'counter 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        counter: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
}