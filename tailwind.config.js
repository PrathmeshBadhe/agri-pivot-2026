/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                emerald: {
                    600: '#059669', // Primary Growth/Profit
                },
                slate: {
                    900: '#0f172a', // Deep Contrast
                    50: '#f8fafc',  // Lab-Like Background
                },
                amber: {
                    500: '#f59e0b', // Alerts
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
