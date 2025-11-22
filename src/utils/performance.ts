// Advanced Performance optimization utilities
import newHeroBackground from "@/assets/new-hero-background.jpg";
import heroBackground from "@/assets/hero-background.jpg";

// Critical resource preloading with priority hints
export const preloadCriticalResources = () => {
  const criticalImages = [
    newHeroBackground,
    heroBackground,
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload critical fonts with optimal loading
  const fonts = [
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
  ];

  fonts.forEach(href => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.href = href;
    fontLink.crossOrigin = 'anonymous';
    fontLink.fetchPriority = 'high';
    document.head.appendChild(fontLink);
  });

  // Preload critical CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Critical above-the-fold CSS */
    .hero-section { min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; }
    .btn-primary { background: hsl(var(--primary)); }
  `;
  document.head.appendChild(style);
};

// Advanced script loading with error handling and retries
export const loadScript = (src: string, retries = 2): Promise<void> => {
  return new Promise((resolve, reject) => {
    const attemptLoad = (attemptsLeft: number) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => {
        if (attemptsLeft > 0) {
          setTimeout(() => attemptLoad(attemptsLeft - 1), 1000);
        } else {
          reject(new Error(`Failed to load script after retries: ${src}`));
        }
      };
      
      document.head.appendChild(script);
    };
    
    attemptLoad(retries);
  });
};

// High-performance intersection observer with optimizations
export const createLazyLoadObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const defaultOptions = {
    threshold: [0, 0.1, 0.5],
    rootMargin: '100px 0px 100px 0px', // Increased for better preloading
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Optimized debounce with immediate execution option
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;
  
  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    
    if (callNow) func(...args);
  };
};

// Enhanced throttle with leading and trailing execution
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  const { leading = true, trailing = true } = options;
  let inThrottle: boolean;
  let lastArgs: Parameters<T> | null;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      if (leading) func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (trailing && lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else if (trailing) {
      lastArgs = args;
    }
  };
};

// Advanced image optimization with WebP support and responsive sizing
export const getOptimizedImageSrc = (
  src: string, 
  width: number, 
  quality = 80,
  format?: 'webp' | 'avif' | 'auto'
) => {
  // Check for modern format support
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();
  
  const supportsAvif = (() => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  })();
  
  // Determine optimal format
  const optimalFormat = format === 'auto' 
    ? (supportsAvif ? 'avif' : supportsWebP ? 'webp' : 'jpg')
    : format;
  
  // For development, return original src
  return src;
};

// Comprehensive resource hints with priority-based loading
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const externalDomains = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//zwqtewpycdbvjgkntejd.supabase.co',
    '//cdn.jsdelivr.net'
  ];

  externalDomains.forEach(domain => {
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
  });

  // Preconnect to critical origins with credentials
  const criticalOrigins = [
    { url: 'https://fonts.gstatic.com', crossorigin: true },
    { url: 'https://zwqtewpycdbvjgkntejd.supabase.co', crossorigin: true }
  ];

  criticalOrigins.forEach(({ url, crossorigin }) => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = url;
    if (crossorigin) preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
  
  // Prefetch next likely pages
  const nextPages = ['/auth', '/sba-loans', '/commercial-loans'];
  nextPages.forEach(page => {
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = page;
    document.head.appendChild(prefetch);
  });
};

// Bundle size optimization utilities
export const importWithRetry = async <T>(
  importFn: () => Promise<T>,
  retries = 3
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Import failed after retries');
};

// Performance monitoring and metrics
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
  }
};

// Service Worker registration with update handling
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, refresh to update
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }
};

// Memory optimization utilities
export const cleanupResources = () => {
  // Clean up blob URLs
  const blobUrls = (window as any).__blobUrls || [];
  blobUrls.forEach((url: string) => URL.revokeObjectURL(url));
  (window as any).__blobUrls = [];
  
  // Force garbage collection if available
  if (window.gc && typeof window.gc === 'function') {
    window.gc();
  }
};

// Network optimization utilities
export const preloadRoute = (path: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
};

// Critical CSS injection
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Critical path CSS for immediate render */
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, sans-serif; }
    .animate-fade-in { animation: fade-in 0.3s ease-out; }
    .animate-scale-in { animation: scale-in 0.2s ease-out; }
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};