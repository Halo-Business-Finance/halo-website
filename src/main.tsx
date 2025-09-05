import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, registerServiceWorker } from './utils/performance'
import { ProductionSecurityProvider } from './components/security/ProductionSecurityProvider'

// Preload critical resources immediately
preloadCriticalResources();

// Register service worker for caching
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ProductionSecurityProvider>
      <App />
    </ProductionSecurityProvider>
  </HelmetProvider>
);
