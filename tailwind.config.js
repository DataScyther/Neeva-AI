/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        'hero': ['var(--text-hero)', { lineHeight: 'var(--text-hero-line-height)', letterSpacing: 'var(--text-hero-letter-spacing)', fontWeight: 'var(--text-hero-weight)' }],
        'page-title': ['var(--text-page-title)', { lineHeight: 'var(--text-page-title-line-height)', letterSpacing: 'var(--text-page-title-letter-spacing)', fontWeight: 'var(--text-page-title-weight)' }],
        'section-title': ['var(--text-section-title)', { lineHeight: 'var(--text-section-title-line-height)', letterSpacing: 'var(--text-section-title-letter-spacing)', fontWeight: 'var(--text-section-title-weight)' }],
        'card-title': ['var(--text-card-title)', { lineHeight: 'var(--text-card-title-line-height)', fontWeight: 'var(--text-card-title-weight)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--text-body-lg-line-height)', fontWeight: 'var(--text-body-lg-weight)' }],
        'body': ['var(--text-body)', { lineHeight: 'var(--text-body-line-height)', fontWeight: 'var(--text-body-weight)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--text-body-sm-line-height)', fontWeight: 'var(--text-body-sm-weight)' }],
        'caption': ['var(--text-caption)', { lineHeight: 'var(--text-caption-line-height)', fontWeight: 'var(--text-caption-weight)' }],
        'label': ['var(--text-label)', { lineHeight: 'var(--text-label-line-height)', fontWeight: 'var(--text-label-weight)' }],
      }
    },
  },
  plugins: [],
}
