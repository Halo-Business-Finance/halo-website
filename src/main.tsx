import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SimpleErrorBoundary } from './components/SimpleErrorBoundary'

// Aggressive service worker cleanup - runs immediately
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

// Basic global error logging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SimpleErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </SimpleErrorBoundary>
  </React.StrictMode>
)
