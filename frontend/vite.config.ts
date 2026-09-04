import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // alias "@" -> "src" para no encadenar "../../.." en los imports.
    // import.meta.dirname (no __dirname, que no existe en ESM puro) apunta
    // a la carpeta de este archivo.
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
