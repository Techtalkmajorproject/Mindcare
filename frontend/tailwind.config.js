/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1d4ed8",
                secondary: "#64748b",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
                background: "#f8fafc",
                surface: "#ffffff"
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
