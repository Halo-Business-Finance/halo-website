import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure a single JSX runtime instance
      "react/jsx-runtime": "react/jsx-runtime",
      "react/jsx-dev-runtime": "react/jsx-dev-runtime",
    },
    dedupe: [
      "react",
      "react-dom",
      "react-helmet-async",
      "@tanstack/react-query",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-helmet-async",
      "@tanstack/react-query",
    ],
    force: true,
  },
}));
