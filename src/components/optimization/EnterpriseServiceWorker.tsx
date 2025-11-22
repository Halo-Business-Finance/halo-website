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

      console.log('✅ Enterprise Service Worker registered:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              console.log('🔄 New content available, page will refresh');
              window.location.reload();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('📦 Cache updated for:', event.data.url);
        }
      });

      // Force immediate activation if no controller exists
      if (!navigator.serviceWorker.controller) {
        registration.update();
      }

    } catch (error) {
      console.warn('❌ Service Worker registration failed:', error);
    }
  };

  return null;
};

export default EnterpriseServiceWorker;