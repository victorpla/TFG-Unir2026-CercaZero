/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Verde bosque — color de marca principal (acción, disponibilidad, confianza)
        primary: {
          50: "#F0F7F3",
          100: "#DCEEE2",
          200: "#B9DDC6",
          300: "#8CC6A2",
          400: "#5BA97C",
          500: "#38875C",
          600: "#2A6C48",
          700: "#21563A",
          800: "#1B452F",
          900: "#163A27",
        },
        // Tierra / arcilla — color secundario, cálido y cercano
        earth: {
          50: "#FBF6F1",
          100: "#F3E6D8",
          200: "#E5C9AD",
          300: "#D4A87C",
          400: "#C08A54",
          500: "#A8703C",
          600: "#8B5A2E",
          700: "#6F4726",
          800: "#593A22",
          900: "#49301E",
        },
        // Estados del ciclo de vida de una donación
        status: {
          available: "#38875C",
          reserved: "#D9A441",
          delivered: "#7A8577",
        },
        background: "#F6F8F4",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px -2px rgba(22, 58, 39, 0.08), 0 1px 2px -1px rgba(22, 58, 39, 0.06)",
        floating: "0 8px 24px -4px rgba(22, 58, 39, 0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
