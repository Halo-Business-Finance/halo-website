// Enterprise-Level Service Worker
// Provides advanced caching, background sync, and performance optimizations

const CACHE_VERSION = 'v2024.3.22';
const STATIC_CACHE = `halo-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `halo-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `halo-images-${CACHE_VERSION}`;
const API_CACHE = `halo-api-${CACHE_VERSION}`;

// Advanced cache configuration
const CACHE_CONFIG = {
  static: {
    maxItems: 100,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  dynamic: {
    maxItems: 50,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  images: {
    maxItems: 200,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  api: {
    maxItems: 25,
    maxAge: 5 * 60 * 1000, // 5 minutes
  }
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/src/assets/new-hero-background.jpg',
  '/src/assets/business-meeting.jpg',
  '/src/assets/sba-logo.jpg',
  '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🚀 Enterprise SW: Installing...');
  
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      
      try {
        await staticCache.addAll(CRITICAL_RESOURCES);
        console.log('✅ Enterprise SW: Critical resources cached');
      } catch (error) {
        console.warn('⚠️ Enterprise SW: Failed to cache some critical resources:', error);
        // Cache resources individually to avoid failure if one fails
        for (const resource of CRITICAL_RESOURCES) {
          try {
            await staticCache.add(resource);
          } catch (e) {
            console.warn(`Failed to cache ${resource}:`, e);
          }
        }
      }
      
      // Skip waiting to activate immediately
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Enterprise SW: Activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
      
      await Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log(`🗑️ Enterprise SW: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Take control of all pages immediately
      await self.clients.claim();
      console.log('✅ Enterprise SW: Activated and claimed clients');
    })()
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except for known CDNs)
  if (url.origin !== self.location.origin && !isTrustedOrigin(url.origin)) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Intelligent request handling
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // API requests - network first with short cache
    if (pathname.startsWith('/api/') || pathname.includes('supabase')) {
      return await networkFirstStrategy(request, API_CACHE, CACHE_CONFIG.api);
    }
    
    // Images - cache first with long expiry
    if (isImageRequest(request)) {
      return await cacheFirstStrategy(request, IMAGE_CACHE, CACHE_CONFIG.images);
    }
    
    // Static assets - cache first
    if (isStaticAsset(pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE, CACHE_CONFIG.static);
    }
    
    // HTML pages - stale while revalidate
    if (isHTMLRequest(request)) {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE, CACHE_CONFIG.dynamic);
    }
    
    // Default - network first
    return await networkFirstStrategy(request, DYNAMIC_CACHE, CACHE_CONFIG.dynamic);
    
  } catch (error) {
    console.warn('Enterprise SW: Request failed:', error);
    return await handleOfflineResponse(request);
  }
}

// Network first strategy (for API calls)
async function networkFirstStrategy(request, cacheName, config) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await maintainCacheSize(cacheName, config.maxItems);
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache first strategy (for images and static assets)
async function cacheFirstStrategy(request, cacheName, config) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh
    const cacheTime = await getCacheTime(request, cacheName);
    if (Date.now() - cacheTime < config.maxAge) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await maintainCacheSize(cacheName, config.maxItems);
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate strategy (for HTML pages)
async function staleWhileRevalidateStrategy(request, cacheName, config) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await maintainCacheSize(cacheName, config.maxItems);
      
      // Notify clients of cache update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            url: request.url
          });
        });
      });
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await networkPromise;
}

// Offline response handler
async function handleOfflineResponse(request) {
  if (isHTMLRequest(request)) {
    const cachedHome = await caches.match('/');
    if (cachedHome) return cachedHome;
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Utility functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot|ico)$/i.test(pathname);
}

function isHTMLRequest(request) {
  return request.destination === 'document' || 
         request.headers.get('Accept')?.includes('text/html');
}

function isTrustedOrigin(origin) {
  const trustedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  return trustedOrigins.includes(origin);
}

// Cache maintenance
async function maintainCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

async function getCacheTime(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    return response ? new Date(response.headers.get('sw-cached-at') || 0).getTime() : 0;
  } catch {
    return 0;
  }
}

// Background sync for offline forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('📡 Enterprise SW: Background sync triggered');
  // Handle offline form submissions, data sync, etc.
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    performance.mark(event.data.name);
  }
});

console.log('🎯 Enterprise Service Worker loaded and ready!');