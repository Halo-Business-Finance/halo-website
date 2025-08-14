import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async"
import { secureLogger, replaceConsole } from './utils/secureLogger'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, addResourceHints, injectCriticalCSS } from './utils/performance'

// Replace console methods with secure logging in production
if (import.meta.env.PROD) {
  replaceConsole();
}

// Initialize critical performance optimizations immediately
injectCriticalCSS();
addResourceHints();
preloadCriticalResources();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
