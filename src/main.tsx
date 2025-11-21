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
console.log('Starting to preload critical resources...');
preloadCriticalResources();

// Basic global error logging (to surface issues in preview)
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Proactively unregister any old service workers and clear stale caches to prevent white screens after updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length) {
      console.log('Unregistering existing service workers and clearing caches...');
      registrations.forEach((reg) => reg.unregister());
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
    }
  }).catch((err) => console.warn('Service Worker check failed:', err));
}

const queryClient = new QueryClient();

console.log('Initializing React app...');

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
