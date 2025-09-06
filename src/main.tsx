import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App-minimal.tsx'
import './index.css'
import { preloadCriticalResources, registerServiceWorker } from './utils/performance'

import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Preload critical resources immediately
preloadCriticalResources();

// Register service worker for caching
registerServiceWorker();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </HelmetProvider>
);
