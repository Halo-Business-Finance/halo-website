import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// TODO: Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only load in production and if consent is granted
    if (!import.meta.env.PROD) return;
    
    const consent = localStorage.getItem('cookie-consent');
    if (consent !== 'accepted') return;

    // Load Google Analytics script
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // We'll track manually
      });
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
