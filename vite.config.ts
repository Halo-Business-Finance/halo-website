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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core dependencies - always needed
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          
          // Router - needed on most pages
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          
          // UI components - used across the app
          if (id.includes('@radix-ui')) {
            return 'ui';
          }
          
          // Charts - only load when needed (lazy loaded)
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Forms - only on specific pages
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms';
          }
          
          // Split out large chart components
          if (id.includes('src/components/charts/')) {
            return 'chart-components';
          }
          
          // Split out optimization utilities
          if (id.includes('src/components/optimization/')) {
            return 'optimization';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
  },
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
