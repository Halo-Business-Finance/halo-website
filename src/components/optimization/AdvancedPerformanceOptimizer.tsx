import { useEffect, useRef } from 'react';

const AdvancedPerformanceOptimizer = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 1. Preload critical resources immediately
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/src/assets/new-hero-background.jpg',
        '/src/assets/business-meeting.jpg'
      ];

      // Use high priority preloading for critical images
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      });
    };

    // 2. Optimize font loading
    const optimizeFontLoading = () => {
      // Preload Google Fonts with optimal settings
      const fontPreloads = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
      ];

      fontPreloads.forEach((href, index) => {
        const link = document.createElement('link');
        link.rel = index === 0 ? 'preload' : 'preload';
        link.as = index === 0 ? 'style' : 'font';
        link.href = href;
        if (index === 1) {
          link.crossOrigin = 'anonymous';
          link.type = 'font/woff2';
        }
        document.head.appendChild(link);
      });
    };

    // 3. Implement aggressive image lazy loading with viewport prediction
    const setupAdvancedLazyLoading = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              
              // Preload next images when current comes into view
              const nextImages = document.querySelectorAll('img[data-src]:not([src])');
              Array.from(nextImages).slice(0, 3).forEach(nextImg => {
                const src = nextImg.getAttribute('data-src');
                if (src) {
                  const preloadLink = document.createElement('link');
                  preloadLink.rel = 'prefetch';
                  preloadLink.as = 'image';
                  preloadLink.href = src;
                  document.head.appendChild(preloadLink);
                }
              });
            }
          });
        },
        { 
          threshold: 0.1, 
          rootMargin: '200px 0px' // Aggressive preloading
        }
      );

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        observerRef.current?.observe(img);
      });
    };

    // 4. Prefetch likely next pages based on user behavior
    const prefetchLikelyPages = () => {
      const likelyPages = [
        '/loan-calculator',
        '/sba-loans', 
        '/commercial-loans',
        '/equipment-financing'
      ];

      // Prefetch on user interaction or after delay
      let prefetchTimer: NodeJS.Timeout;
      
      const startPrefetching = () => {
        likelyPages.forEach((path, index) => {
          setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = path;
            document.head.appendChild(link);
          }, index * 100); // Stagger prefetching
        });
      };

      // Start prefetching after user shows intent
      document.addEventListener('mouseover', () => {
        if (!prefetchTimer) {
          prefetchTimer = setTimeout(startPrefetching, 500);
        }
      }, { once: true });

      // Or after 2 seconds if no interaction
      setTimeout(startPrefetching, 2000);
    };

    // 5. Optimize DOM rendering
    const optimizeRendering = () => {
      // Use requestIdleCallback for non-critical operations
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          // Defer non-critical CSS loading
          const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
          nonCriticalCSS.forEach(link => {
            const linkEl = link as HTMLLinkElement;
            linkEl.media = 'print';
            linkEl.onload = () => { linkEl.media = 'all'; };
          });
        });
      }
    };

    // 6. Implement resource hints for third-party domains
    const addResourceHints = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      domains.forEach(domain => {
        // DNS prefetch
        const dnsLink = document.createElement('link');
        dnsLink.rel = 'dns-prefetch';
        dnsLink.href = domain;
        document.head.appendChild(dnsLink);

        // Preconnect for critical resources
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = domain;
        if (domain.includes('gstatic')) {
          preconnectLink.crossOrigin = 'anonymous';
        }
        document.head.appendChild(preconnectLink);
      });
    };

    // Execute all optimizations
    preloadCriticalResources();
    optimizeFontLoading();
    setupAdvancedLazyLoading();
    prefetchLikelyPages();
    optimizeRendering();
    addResourceHints();

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return null;
};

export default AdvancedPerformanceOptimizer;