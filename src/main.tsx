import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources } from './utils/performance'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Preload critical resources immediately
preloadCriticalResources();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
