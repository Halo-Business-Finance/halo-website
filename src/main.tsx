import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create query client with minimal config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Get root element
const rootElement = document.getElementById("root");

// Initialize app
if (rootElement) {
  try {
    // Clear the loading fallback
    rootElement.innerHTML = '';
    
    createRoot(rootElement).render(
      <React.StrictMode>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </HelmetProvider>
      </React.StrictMode>
    );
  } catch (error) {
    // Show error to user if React fails to mount
    console.error('Failed to mount React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: -apple-system, sans-serif;">
        <h1 style="color: #1e40af; margin-bottom: 16px;">Halo Business Finance</h1>
        <p style="color: #666; margin-bottom: 24px;">We're experiencing technical difficulties. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Refresh Page
        </button>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
