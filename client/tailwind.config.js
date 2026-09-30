/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0c2340',
          blue: '#133b70',
          darkBlue: '#0a192f',
          lightBlue: '#1e5bb0',
          sky: '#e0f2fe',
          accent: '#2563eb',
          saffron: '#ff9933',
          saffronDark: '#d97706',
          green: '#138808',
          greenDark: '#15803d',
          ash: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 4px 20px -2px rgba(12, 35, 64, 0.08), 0 2px 6px -1px rgba(12, 35, 64, 0.04)',
        'gov-lg': '0 10px 25px -3px rgba(12, 35, 64, 0.12), 0 4px 10px -2px rgba(12, 35, 64, 0.06)',
      }
    },
  },
  plugins: [],
}
