import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources } from './utils/performance'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CriticalResourceOptimizer from './components/optimization/CriticalResourceOptimizer'
import { applyCSPMeta } from './utils/cspConfig'

// Apply Content Security Policy for XSS protection
applyCSPMeta();

// Preload critical resources immediately
preloadCriticalResources();

// Global error logging for production monitoring
if (import.meta.env.PROD) {
  window.addEventListener('error', (e) => {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('Global error:', e.message);
  });
  window.addEventListener('unhandledrejection', (e) => {
    // Send to error tracking service
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// Service worker cleanup is now handled by inline script in index.html
// This prevents continuous unregistration that breaks the site

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CriticalResourceOptimizer />
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
