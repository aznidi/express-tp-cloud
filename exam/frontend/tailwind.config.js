/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        segoe: ["Segoe UI", "sans-serif"],
      },
      fontSize: {
        'xxl': ['2rem', { lineHeight: '1.2', fontWeight: '700' }], // Titre principal
        'xl': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // Sous-titre
        'base': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // Paragraphe
        'sm': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }], // Texte secondaire
        'xs': ['0.75rem', { lineHeight: '1.3', fontStyle: 'italic' }], // Notes
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "32px",
      },
      colors: {
        // Light mode
        primary: "#1144DE",
        secondary: "#789CB4",
        background: "#EEF2F1",
        surface: "#FFFFFF",
        textPrimary: "#1B1F3B",
        textSecondary: "#4A5B6A",
        border: "rgba(120, 156, 180, 0.5)",
        shadow: "rgba(17, 68, 222, 0.2)",

        // Dark mode (adapté à la structure demandée)
        primaryDark: "#8caeff",        // Variante douce du bleu
        secondaryDark: "#5a7387",      // Variante du gris bleuté
        darkDark: "#141414",           // Fond sombre principal
        lightDark: "#E0E0E0",          // Texte clair sur fond sombre
        blackDark: "#121212",          // Surface noire (cartes etc.)
      },
      boxShadow: {
        card: "0 4px 8px rgba(17, 68, 222, 0.1)",
        button: "0 2px 4px rgba(17, 68, 222, 0.2)",
      },
    },
  },
  plugins: [],
}; 