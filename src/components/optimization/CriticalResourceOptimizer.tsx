import { useEffect } from 'react';

interface CriticalResource {
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  href: string;
  as?: string;
  crossOrigin?: string;
  media?: string;
  priority?: 'high' | 'low';
}

const CriticalResourceOptimizer = () => {
  useEffect(() => {
    optimizeCriticalResources();
  }, []);

  const optimizeCriticalResources = () => {
    // Critical resources configuration
    const criticalResources: CriticalResource[] = [
      // Critical fonts
      {
        type: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        type: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      
      // Critical images (above the fold)
      {
        type: 'preload',
        href: '/src/assets/new-hero-background.jpg',
        as: 'image',
        priority: 'high'
      },
      {
        type: 'preload',
        href: '/src/assets/business-meeting.jpg',
        as: 'image',
        priority: 'high'
      },
      {
        type: 'preload',
        href: '/src/assets/sba-logo.jpg',
        as: 'image'
      },
      
      // Critical stylesheets
      {
        type: 'preload',
        href: '/src/index.css',
        as: 'style'
      },
      
      // High-priority next pages
      {
        type: 'prefetch',
        href: '/sba-loans'
      },
      {
        type: 'prefetch',
        href: '/commercial-loans'
      },
      {
        type: 'prefetch',
        href: '/loan-calculator'
      },
      
      // External services
      {
        type: 'dns-prefetch',
        href: '//zwqtewpycdbvjgkntejd.supabase.co'
      }
    ];

    // Remove existing resource hints to avoid duplicates
    const existingHints = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="preconnect"], link[rel="dns-prefetch"]');
    existingHints.forEach(hint => {
      if (hint.hasAttribute('data-critical-optimizer')) {
        hint.remove();
      }
    });

    // Add new optimized resource hints
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = resource.type;
      link.href = resource.href;
      link.setAttribute('data-critical-optimizer', 'true');
      
      if (resource.as) link.as = resource.as;
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
      if (resource.media) link.media = resource.media;
      
      // Set fetchPriority for supported browsers
      if (resource.priority && 'fetchPriority' in link) {
        (link as any).fetchPriority = resource.priority;
      }
      
      document.head.appendChild(link);
    });

    // Optimize font loading
    optimizeFontLoading();
    
    // Optimize JavaScript loading
    optimizeScriptLoading();
    
    // Set up resource monitoring
    monitorResourceLoading();
  };

  const optimizeFontLoading = () => {
    // Preload critical font weights
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'style';
      link.setAttribute('data-critical-optimizer', 'true');
      document.head.appendChild(link);
      
      // Also add the stylesheet
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = fontUrl;
      styleLink.setAttribute('data-critical-optimizer', 'true');
      document.head.appendChild(styleLink);
    });

    // Enable font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  };

  const optimizeScriptLoading = () => {
    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('vite') && !script.hasAttribute('async') && !script.hasAttribute('defer')) {
        script.setAttribute('defer', '');
      }
    });

    // Add module preload for critical chunks
    const modulePreloads = [
      '/src/main.tsx',
      '/src/App.tsx',
      '/src/pages/Index.tsx'
    ];

    modulePreloads.forEach(module => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = module;
      link.setAttribute('data-critical-optimizer', 'true');
      document.head.appendChild(link);
    });
  };

  const monitorResourceLoading = () => {
    // Only monitor in development
    if (!import.meta.env.DEV) return;

    // Monitor resource loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Log slow resources in dev only
          if (resourceEntry.duration > 1000) {
            console.warn(`🐌 Slow resource: ${resourceEntry.name} (${Math.round(resourceEntry.duration)}ms)`);
          }
          
          // Track failed resources
          if (resourceEntry.transferSize === 0 && resourceEntry.encodedBodySize === 0) {
            console.warn(`❌ Resource failed: ${resourceEntry.name}`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor LCP in dev
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const lcpEntry = entry as any;
        if (lcpEntry.element && lcpEntry.element.tagName === 'IMG') {
          console.log(`🎯 LCP is an image. Consider optimization`);
        }
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  };

  return null;
};

export default CriticalResourceOptimizer;