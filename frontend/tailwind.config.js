/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: '#ffffff',
        canvas:  '#f5f4f2',
        sidebar: '#18181b',
        primario: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e264a',
        },
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs:    ['12px', '16px'],
        sm:    ['13px', '20px'],
        base:  ['14px', '22px'],
        lg:    ['16px', '24px'],
        xl:    ['18px', '28px'],
        '2xl': ['22px', '32px'],
        '3xl': ['28px', '36px'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm:  '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '10px',
        '2xl': '14px',
      },
    },
  },
  plugins: [],
}
