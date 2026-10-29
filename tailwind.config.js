/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            screens: {
                xs: '480px',
            },
            colors: {
                // Nordic pastel background tones
                sand: { DEFAULT: '#F5F0E8', dark: '#EAE3D6', light: '#FAF7F2' },
                birch: { DEFAULT: '#FFFFFF' },
                // Nordic pastel accents
                fjord: { DEFAULT: '#5B89A8', light: '#7AAEC9', dark: '#3D6B88' },
                moss: { DEFAULT: '#7A9E7E', light: '#9ABE9E', dark: '#5A7E5E' },
                heather: { DEFAULT: '#A87B8E', light: '#C49BAD', dark: '#8A5B6E' },
                amber: { DEFAULT: '#C9A06A', light: '#E0BC8C', dark: '#A8804A' },
                // Text
                ink: { DEFAULT: '#1A1612', 50: '#F5F3F0', 100: '#E8E3DC', 200: '#C9BFB4', 300: '#A89F94', 400: '#7D756C', 500: '#5C564F', 600: '#3E3A35', 700: '#2A2520' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 2px 12px rgba(26,22,18,0.07), 0 1px 3px rgba(26,22,18,0.05)',
                'card-md': '0 4px 24px rgba(26,22,18,0.10), 0 1px 6px rgba(26,22,18,0.06)',
                'card-lg': '0 8px 40px rgba(26,22,18,0.12), 0 2px 8px rgba(26,22,18,0.06)',
                'nav': '0 1px 0 rgba(26,22,18,0.08), 0 2px 12px rgba(26,22,18,0.04)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease forwards',
                'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
                'sway': 'sway 8s ease-in-out infinite',
                'marquee-left': 'marqueeLeft 120s linear infinite',
                'marquee-right': 'marqueeRight 120s linear infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                sway: {
                    '0%, 100%': { transform: 'rotate(-1deg)' },
                    '50%': { transform: 'rotate(1deg)' },
                },
                marqueeLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                marqueeRight: {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
};
