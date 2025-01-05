import { blackA, mauve, violet } from '@radix-ui/colors'
/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {
            ...mauve,
            ...violet,
            // ...green,
            ...blackA,
         },
         keyframes: {
            overlayShow: {
               from: { opacity: '0' },
               to: { opacity: '1' },
            },
            contentShow: {
               from: {
                  opacity: '0',
                  transform: 'translate(-50%, -48%) scale(0.96)',
               },
               to: {
                  opacity: '1',
                  transform: 'translate(-50%, -50%) scale(1)',
               },
            },
         },
         animation: {
            overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
         },
         screens: {
            'initial': '0px',
            'xs': '520px',
            'sm': '768px',
            'md': '1024px',
            'lg': '1280px',
            'xl': '1640px',
         },
      },
   },
   plugins: [
      function ({ addUtilities }) {
         addUtilities({
            '.scrollbar-hide': {
               '-ms-overflow-style': 'none',
               'scrollbar-width': 'none',
               '&::-webkit-scrollbar': {
                  display: 'none',
               },
            },
         })
      },
   ],
}
