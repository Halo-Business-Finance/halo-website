// Performance optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/assets/hero-background.jpg',
    '/assets/financial-advisor-consultation.jpg',
    '/assets/modern-commercial-property.jpg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
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

// Resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = '//fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch);

  // Preconnect to important origins
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://preview--hbf-application.lovable.app';
  document.head.appendChild(preconnect);
};

// Clean up resources when component unmounts
export const cleanupResources = () => {
  // Remove event listeners, cancel requests, etc.
  window.removeEventListener('scroll', () => {});
  window.removeEventListener('resize', () => {});
};