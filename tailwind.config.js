/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), raised: v('raised'),
        ink: v('ink'), muted: v('muted'), line: v('line'),
        gold: v('gold'), gold2: v('gold2'), kiswah: v('kiswah'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Marcellus', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Figtree Variable', 'Figtree', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'Amiri', 'serif'],
      },
      maxWidth: { site: '1240px' },
      transitionTimingFunction: { silk: 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [],
};
