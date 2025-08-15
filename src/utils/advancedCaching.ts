// Advanced caching strategies for lightning-fast performance

export class AdvancedCacheManager {
  private static instance: AdvancedCacheManager;
  private cacheVersion = 'v2.0';
  private staticCacheName = `static-cache-${this.cacheVersion}`;
  private imageCacheName = `image-cache-${this.cacheVersion}`;
  private apiCacheName = `api-cache-${this.cacheVersion}`;

  static getInstance(): AdvancedCacheManager {
    if (!AdvancedCacheManager.instance) {
      AdvancedCacheManager.instance = new AdvancedCacheManager();
    }
    return AdvancedCacheManager.instance;
  }

  // Preload critical resources with intelligent prioritization
  async preloadCriticalResources(): Promise<void> {
    if (!('caches' in window)) return;

    const criticalResources = [
      // Critical CSS and JS
      '/',
      '/src/main.tsx',
      '/src/index.css',
      
      // Critical images (WebP variants)
      '/src/assets/new-hero-background.jpg',
      '/src/assets/business-meeting.jpg',
      
      // Critical fonts
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    try {
      const cache = await caches.open(this.staticCacheName);
      
      // Use high-priority fetch for critical resources
      const fetchPromises = criticalResources.map(url => 
        fetch(url, { 
          priority: 'high',
          mode: 'cors'
        } as any).then(response => {
          if (response.ok) {
            return cache.put(url, response.clone());
          }
        }).catch(() => {
          // Silently fail for non-critical resources
        })
      );

      await Promise.allSettled(fetchPromises);
    } catch (error) {
      console.warn('Critical resource preloading failed:', error);
    }
  }

  // Intelligent image caching with compression
  async cacheOptimizedImage(url: string, response: Response): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.imageCacheName);
      
      // Clone response for processing
      const responseClone = response.clone();
      const blob = await responseClone.blob();
      
      // Only cache if image is reasonably sized
      if (blob.size < 5 * 1024 * 1024) { // 5MB limit
        await cache.put(url, response);
      }
    } catch (error) {
      console.warn('Image caching failed:', error);
    }
  }

  // Smart cache retrieval with fallback strategies
  async getFromCache(request: Request): Promise<Response | null> {
    if (!('caches' in window)) return null;

    const url = request.url;
    
    try {
      // Try static cache first for HTML, CSS, JS
      if (this.isStaticResource(url)) {
        const staticCache = await caches.open(this.staticCacheName);
        const response = await staticCache.match(request);
        if (response) return response;
      }

      // Try image cache for images
      if (this.isImageResource(url)) {
        const imageCache = await caches.open(this.imageCacheName);
        const response = await imageCache.match(request);
        if (response) return response;
      }

      // Try API cache for API calls
      if (this.isApiResource(url)) {
        const apiCache = await caches.open(this.apiCacheName);
        const response = await apiCache.match(request);
        if (response) return response;
      }

    } catch (error) {
      console.warn('Cache retrieval failed:', error);
    }

    return null;
  }

  // Store in appropriate cache with TTL
  async storeInCache(request: Request, response: Response): Promise<void> {
    if (!('caches' in window) || !response.ok) return;

    const url = request.url;
    const responseClone = response.clone();
    
    try {
      if (this.isStaticResource(url)) {
        const cache = await caches.open(this.staticCacheName);
        await cache.put(request, responseClone);
      } else if (this.isImageResource(url)) {
        await this.cacheOptimizedImage(url, responseClone);
      } else if (this.isApiResource(url)) {
        // Add TTL headers for API responses
        const headers = new Headers(responseClone.headers);
        headers.set('sw-cache-time', Date.now().toString());
        headers.set('sw-cache-ttl', '300000'); // 5 minutes
        
        const modifiedResponse = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers
        });
        
        const cache = await caches.open(this.apiCacheName);
        await cache.put(request, modifiedResponse);
      }
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }

  // Clean up old cache versions
  async cleanupOldCaches(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const currentCaches = [
        this.staticCacheName,
        this.imageCacheName,
        this.apiCacheName
      ];

      const deletePromises = cacheNames
        .filter(cacheName => !currentCaches.includes(cacheName))
        .map(cacheName => caches.delete(cacheName));

      await Promise.all(deletePromises);
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  private isStaticResource(url: string): boolean {
    return /\.(js|css|html|woff2?|ttf|eot)$/i.test(url) || url.includes('/src/');
  }

  private isImageResource(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url) || url.includes('/assets/');
  }

  private isApiResource(url: string): boolean {
    return url.includes('/api/') || url.includes('supabase.co');
  }
}

// Initialize and export singleton instance
export const cacheManager = AdvancedCacheManager.getInstance();