/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Contoh font Y2K/Retro. Anda mungkin perlu mengimpor font ini via Google Fonts atau local.
        // Misalnya: 'Press Start 2P', 'VT323', 'Electrolize', 'Orbitron'
        retro: ['"Press Start 2P"', 'cursive'], // Ganti dengan font retro pilihan Anda
        cyberpunk: ['Orbitron', 'sans-serif'], // Ganti dengan font cyberpunk pilihan Anda
        arcade: ['"VT323"', 'monospace'], // Ganti dengan font arcade pilihan Anda
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 79.999%, 82%, 99.999%': {
            opacity: '0.9',
            textShadow: '0 0 5px rgba(255,255,0,0.5), 0 0 10px rgba(255,255,0,0.4), 0 0 15px rgba(255,255,0,0.3)',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%, 80%, 81.999%': {
            opacity: '1',
            textShadow: '0 0 8px rgba(255,255,0,0.8), 0 0 15px rgba(255,255,0,0.6), 0 0 25px rgba(255,255,0,0.4)',
          },
        },
        fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        }
      },
      animation: {
        flicker: 'flicker 3s infinite alternate',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 0, 0.7), 0 0 30px rgba(255, 165, 0, 0.5)',
        'glow-lg': '0 0 25px rgba(255, 255, 0, 0.8), 0 0 50px rgba(255, 165, 0, 0.6)',
        'inner-neon-purple': 'inset 0 0 10px rgba(160, 32, 240, 0.6), inset 0 0 20px rgba(160, 32, 240, 0.4)',

        // Neon shadows for buttons
        'neon-yellow': '0 0 5px rgba(255,255,0,0.6), 0 0 10px rgba(255,255,0,0.4)',
        'neon-green': '0 0 5px rgba(0,255,0,0.6), 0 0 10px rgba(0,255,0,0.4)',
        'neon-red': '0 0 5px rgba(255,0,0,0.6), 0 0 10px rgba(255,0,0,0.4)',
        'neon-blue': '0 0 5px rgba(0,0,255,0.6), 0 0 10px rgba(0,0,255,0.4)',
        'neon-purple': '0 0 5px rgba(160,32,240,0.6), 0 0 10px rgba(160,32,240,0.4)',
        'neon-gray': '0 0 5px rgba(100,100,100,0.6), 0 0 10px rgba(100,100,100,0.4)',
        'neon-green-sm': '0 0 3px rgba(0,255,0,0.5), 0 0 6px rgba(0,255,0,0.3)',

        // Text Shadows for Neon text
        'neon-text-yellow': '0 0 5px #FFFF00, 0 0 10px #FFD700',
      },
      dropShadow: {
        'neon-yellow': '0 0 5px rgba(255,255,0,0.8), 0 0 10px rgba(255,255,0,0.6)',
      }
    },
  },
  plugins: [],
}