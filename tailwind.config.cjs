/** Configuration Tailwind — couleurs et police de Faso Équipement Paalga */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Montserrat', 'system-ui', 'sans-serif'] },
      colors: {
        bleu: { DEFAULT: '#408FC8', fonce: '#1F5F8F', nuit: '#0E2A40' },
        jaune: { DEFAULT: '#F3B73F', fonce: '#D99A1E' }
      }
    }
  }
};
