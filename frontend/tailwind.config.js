// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: 'class',
//   content: [
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // ChatGPT dark mode palette
//         chatgpt: {
//           bg: '#343541',         // main background
//           panel: '#202123',      // sidebar/panel
//           input: '#40414f',      // input background
//           text: '#ececf1',       // main text
//           textSecondary: '#acacbe', // secondary text
//           accent: '#10a37f',     // accent (green)
//         },
//         primary: "#0070f3",
//         secondary: "#1a1a1a",
//         accent: "#f2f2f2",
//       },

//        animation: {
//         'fade-in': 'fadeIn 0.5s ease-in',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        'chatgpt-bg': '#343541',
        'chatgpt-panel': '#202123',
        'chatgpt-input': '#40414f',
        'chatgpt-text': '#ececf1',
        'chatgpt-textSecondary': '#acacbe',
        'chatgpt-accent': '#10a37f',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};