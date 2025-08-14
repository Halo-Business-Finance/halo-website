import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, addResourceHints, injectCriticalCSS } from './utils/performance'

// Initialize critical performance optimizations immediately
injectCriticalCSS();
addResourceHints();
preloadCriticalResources();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
