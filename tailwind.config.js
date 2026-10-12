import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                ink:    '#16263A',
                paper:  '#F5F7F9',
                harbor: { DEFAULT: '#1B6FA8', dark: '#14537F' },
                line:   '#D8DEE6',
            },
            fontFamily: {
                display: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
                sans:    ['"Public Sans"',         ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [forms],
};
