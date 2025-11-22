import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CriticalResourceOptimizer from './components/optimization/CriticalResourceOptimizer'
import { applyCSPMeta } from './utils/cspConfig'

console.log('🚀 Main.tsx executing...');

// Apply Content Security Policy for XSS protection
applyCSPMeta();

console.log('✅ CSP applied');

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

console.log('📦 Creating React root...');
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, mounting React app...');
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CriticalResourceOptimizer />
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  console.log('✅ React app mounted successfully!');
}
