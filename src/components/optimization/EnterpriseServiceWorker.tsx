import { useEffect } from 'react';

const EnterpriseServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerEnterpriseServiceWorker();
    }
  }, []);

  const registerEnterpriseServiceWorker = async () => {
    try {
      // First, unregister any existing service workers to prevent conflicts
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));

      // Clear existing caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Register new enhanced service worker
      const registration = await navigator.serviceWorker.register('/enterprise-sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      if (import.meta.env.DEV) {
        console.log('✅ Service Worker registered:', registration.scope);
      }

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, reload page
              window.location.reload();
            }
          });
        }
      });

      // Force immediate activation if no controller exists
      if (!navigator.serviceWorker.controller) {
        registration.update();
      }

    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  };

  return null;
};

export default EnterpriseServiceWorker;