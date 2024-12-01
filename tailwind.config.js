/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./views/**/*.ejs",
        "./public/**/*.html",
        "./public/js/**/*.js",
        "./*.ejs"
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#3B82F6',
                'brand-secondary': '#9333EA',
                'brand-accent': '#F59E0B',
                'brand-background': '#F3F4F6',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            }
        }
    },
    plugins: [
        require('flowbite/plugin')
    ],
}

