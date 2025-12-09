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
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom')) return 'vendor-react';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          
          // Radix UI components - separate chunk
          if (id.includes('@radix-ui')) return 'vendor-radix';
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform')) return 'vendor-forms';
          
          // Animation/carousel
          if (id.includes('embla-carousel') || id.includes('framer-motion')) return 'vendor-animation';
          
          // Supabase
          if (id.includes('@supabase')) return 'vendor-supabase';
          
          // Let recharts and d3 be handled automatically to avoid circular deps
        },
      },
    },
  },
  css: {
    devSourcemap: mode === 'development',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react-helmet-async",
      "@tanstack/react-query",
      "react-router-dom",
      "embla-carousel-react",
      "recharts",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-helmet-async",
      "@tanstack/react-query",
      "embla-carousel-react",
    ],
    force: true,
  },
}));
