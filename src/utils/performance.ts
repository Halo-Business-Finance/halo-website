// Performance optimization utilities

// Preload only critical above-the-fold resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/src/assets/new-hero-background.jpg', // Hero background
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
};

// Lazy load non-critical scripts
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Intersection Observer for lazy loading
export const createLazyLoadObserver = (callback: IntersectionObserverCallback) => {
  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px 0px'
  });
};

// Debounce function for performance-sensitive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image optimization helper
export const getOptimizedImageSrc = (src: string, width: number, quality = 80) => {
  // This would integrate with your image optimization service
  // For now, return original src
  return src;
};

// Enhanced resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const externalDomains = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//zwqtewpycdbvjgkntejd.supabase.co'
  ];

  externalDomains.forEach(domain => {
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.gstatic.com',
    'https://zwqtewpycdbvjgkntejd.supabase.co'
  ];

  criticalOrigins.forEach(origin => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = origin;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
};