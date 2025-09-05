import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, registerServiceWorker } from './utils/performance'
import { ProductionSecurityProvider } from './components/security/ProductionSecurityProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { HardenedSecurityProvider } from '@/components/security/HardenedSecurityProvider'
import { EnhancedEncryptionProvider } from '@/components/security/EnhancedEncryptionProvider'
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
      <ProductionSecurityProvider>
        <EnhancedEncryptionProvider>
          <AuthProvider>
            <HardenedSecurityProvider>
              <App />
              <Toaster />
            </HardenedSecurityProvider>
          </AuthProvider>
        </EnhancedEncryptionProvider>
      </ProductionSecurityProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
