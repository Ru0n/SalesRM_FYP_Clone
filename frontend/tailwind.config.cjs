/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(229 231 235)", // gray-200
        input: "rgb(229 231 235)", // gray-200
        ring: "rgb(59 130 246)", // blue-500
        background: "rgb(249 250 251)", // gray-50
        foreground: "rgb(17 24 39)", // gray-900
        primary: {
          DEFAULT: "rgb(59 130 246)", // blue-500
          foreground: "rgb(255 255 255)", // white
        },
        secondary: {
          DEFAULT: "rgb(243 244 246)", // gray-100
          foreground: "rgb(17 24 39)", // gray-900
        },
        destructive: {
          DEFAULT: "rgb(239 68 68)", // red-500
          foreground: "rgb(255 255 255)", // white
        },
        muted: {
          DEFAULT: "rgb(243 244 246)", // gray-100
          foreground: "rgb(107 114 128)", // gray-500
        },
        accent: {
          DEFAULT: "rgb(243 244 246)", // gray-100
          foreground: "rgb(17 24 39)", // gray-900
        },
        popover: {
          DEFAULT: "rgb(255 255 255)", // white
          foreground: "rgb(17 24 39)", // gray-900
        },
        card: {
          DEFAULT: "rgb(255 255 255)", // white
          foreground: "rgb(17 24 39)", // gray-900
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}