const CACHE_NAME = 'halo-business-finance-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const IMAGE_CACHE = 'images-v2';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json'
];

// Resources to cache on demand
const CACHE_STRATEGIES = {
  images: { cacheName: IMAGE_CACHE, maxAge: 30 * 24 * 60 * 60 * 1000, maxItems: 100 },
  static: { cacheName: STATIC_CACHE, maxAge: 7 * 24 * 60 * 60 * 1000, maxItems: 50 },
  dynamic: { cacheName: DYNAMIC_CACHE, maxAge: 24 * 60 * 60 * 1000, maxItems: 30 }
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(CRITICAL_RESOURCES)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              !Object.values(CACHE_STRATEGIES).some(strategy => strategy.cacheName === cacheName) &&
              cacheName !== STATIC_CACHE
            )
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      self.clients.claim()
    ])
  );
});

// Advanced fetch handler with intelligent caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;

  // API requests - network first with fallback
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Images - cache first with network fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets - cache first
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // HTML pages - stale while revalidate
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Default strategy
  event.respondWith(networkFirstStrategy(request));
});

// Network first strategy (good for API calls)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache first strategy (good for images and static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
      await maintainCacheSize(cacheName);
    }
    
    return response;
  } catch (error) {
    return new Response('Resource unavailable', { status: 503 });
  }
}

// Stale while revalidate strategy (good for HTML pages)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || await fetchPromise || new Response('Offline', { status: 503 });
}

// Maintain cache size limits
async function maintainCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const strategy = Object.values(CACHE_STRATEGIES).find(s => s.cacheName === cacheName);
  
  if (strategy && keys.length > strategy.maxItems) {
    await cache.delete(keys[0]);
  }
}

// Background sync for offline forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Sync any offline form data when connection is restored
    const cache = await caches.open('offline-forms');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('Sync failed for:', request.url);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ],
    requireInteraction: true,
    renotify: true,
    tag: 'halo-notification'
  };

  event.waitUntil(
    self.registration.showNotification('Halo Business Finance', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});