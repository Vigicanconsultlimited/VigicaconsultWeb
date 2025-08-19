<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
=======
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60

export default defineConfig({
<<<<<<< HEAD
  plugins: [tailwindcss(), react()],
=======
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
>>>>>>> 1748a5e68d38906a8dfe30d72ef9dec426031c60
});
