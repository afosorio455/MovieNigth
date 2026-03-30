// tailwind.config.js
module.exports = {
    // REVISA ESTO BIEN:
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",      // La carpeta app es vital en Expo Router
        "./components/**/*.{js,jsx,ts,tsx}", // Tus componentes compartidos
        "./src/**/*.{js,jsx,ts,tsx}",        // Si usas carpeta src
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
    },
    plugins: [],
};