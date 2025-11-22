// Service Worker Cleanup Script
// This script runs once to unregister all service workers and clear caches
// to fix blank page issues caused by aggressive caching

(async function cleanupServiceWorkers() {
  if ('serviceWorker' in navigator) {
    try {
      // Get all service worker registrations
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length > 0) {
        console.log(`🧹 Cleaning up ${registrations.length} service worker(s)...`);
        
        // Unregister all service workers
        await Promise.all(
          registrations.map(async (registration) => {
            await registration.unregister();
            console.log('✅ Service worker unregistered:', registration.scope);
          })
        );
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        if (cacheNames.length > 0) {
          console.log(`🧹 Clearing ${cacheNames.length} cache(s)...`);
          await Promise.all(
            cacheNames.map(async (cacheName) => {
              await caches.delete(cacheName);
              console.log('✅ Cache cleared:', cacheName);
            })
          );
        }
      }
      
      console.log('✅ Service worker cleanup complete!');
    } catch (error) {
      console.warn('⚠️ Service worker cleanup failed:', error);
    }
  }
})();
