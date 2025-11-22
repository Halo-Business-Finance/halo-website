import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface RoutePreloadConfig {
  path: string;
  priority: 'high' | 'medium' | 'low';
  preloadCondition?: () => boolean;
  delay?: number;
}

// Route prediction based on user behavior patterns
const routePredictionMap: Record<string, RoutePreloadConfig[]> = {
  '/': [
    { path: '/sba-loans', priority: 'high', delay: 2000 },
    { path: '/commercial-loans', priority: 'high', delay: 2500 },
    { path: '/loan-calculator', priority: 'medium', delay: 3000 },
    { path: '/equipment-financing', priority: 'medium', delay: 4000 },
  ],
  '/sba-loans': [
    { path: '/sba-7a-loans', priority: 'high', delay: 1000 },
    { path: '/sba-504-loans', priority: 'high', delay: 1500 },
    { path: '/sba-loan-application', priority: 'medium', delay: 2000 },
  ],
  '/commercial-loans': [
    { path: '/construction-loans', priority: 'high', delay: 1000 },
    { path: '/bridge-financing', priority: 'medium', delay: 1500 },
    { path: '/commercial-real-estate-application', priority: 'medium', delay: 2000 },
  ],
  '/equipment-financing': [
    { path: '/equipment-loans', priority: 'high', delay: 1000 },
    { path: '/equipment-leasing', priority: 'high', delay: 1500 },
    { path: '/heavy-equipment', priority: 'medium', delay: 2000 },
    { path: '/medical-equipment', priority: 'medium', delay: 2500 },
  ],
  '/loan-calculator': [
    { path: '/sba-loan-application', priority: 'high', delay: 1000 },
    { path: '/commercial-real-estate-application', priority: 'medium', delay: 1500 },
  ],
};

const AdvancedRoutePreloader = () => {
  const location = useLocation();
  const preloadedRoutes = useRef<Set<string>>(new Set());
  const preloadTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Intelligent route preloading based on current location
  const preloadRoute = useCallback(async (path: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (preloadedRoutes.current.has(path)) return;
    
    try {
      // Create link element for route prefetching
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      link.as = 'document';
      
      // Set priority
      if ('fetchPriority' in link) {
        (link as any).fetchPriority = priority === 'high' ? 'high' : 'low';
      }
      
      document.head.appendChild(link);
      preloadedRoutes.current.add(path);
      
      // Dynamic import for component preloading
      const componentMap: Record<string, () => Promise<any>> = {
        '/sba-loans': () => import('../../pages/SBALoansPage'),
        '/commercial-loans': () => import('../../pages/CommercialLoansPage'),
        '/loan-calculator': () => import('../../pages/LoanCalculatorPageTest'),
        '/equipment-financing': () => import('../../pages/EquipmentFinancingPage'),
        '/sba-7a-loans': () => import('../../pages/SBA7aLoansPage'),
        '/sba-504-loans': () => import('../../pages/SBA504LoansPage'),
        '/sba-loan-application': () => import('../../pages/SBALoanApplication'),
        '/construction-loans': () => import('../../pages/ConstructionLoansPage'),
        '/bridge-financing': () => import('../../pages/BridgeFinancingPage'),
        '/commercial-real-estate-application': () => import('../../pages/CommercialRealEstateApplication'),
        '/equipment-loans': () => import('../../pages/EquipmentLoansPage'),
        '/equipment-leasing': () => import('../../pages/EquipmentLeasingPage'),
        '/heavy-equipment': () => import('../../pages/HeavyEquipmentPage'),
        '/medical-equipment': () => import('../../pages/MedicalEquipmentPage'),
      };
      
      const componentLoader = componentMap[path];
      if (componentLoader) {
        await componentLoader();
        console.log(`✅ Preloaded component for ${path}`);
      }
      
    } catch (error) {
      console.warn(`Failed to preload route ${path}:`, error);
    }
  }, []);

  // Mouse hover preloading for links
  const setupHoverPreloading = useCallback(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Ensure target is an Element that supports closest()
      if (!target || typeof target.closest !== 'function') return;
      
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          preloadRoute(url.pathname, 'high');
        }
      }
    };

    // Use event delegation for better performance
    document.addEventListener('mouseenter', handleMouseEnter, true);
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [preloadRoute]);

  // Intersection Observer for link preloading
  const setupViewportPreloading = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            if (link.href) {
              const url = new URL(link.href);
              if (url.origin === window.location.origin) {
                preloadRoute(url.pathname, 'medium');
              }
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    // Observe all internal links
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => observer.observe(link));

    return () => observer.disconnect();
  }, [preloadRoute]);

  // Preload routes based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const predictedRoutes = routePredictionMap[currentPath] || [];

    // Clear existing timers
    preloadTimers.current.forEach(timer => clearTimeout(timer));
    preloadTimers.current.clear();

    // Schedule preloading based on predictions
    predictedRoutes.forEach((config) => {
      const shouldPreload = !config.preloadCondition || config.preloadCondition();
      
      if (shouldPreload) {
        const timer = setTimeout(() => {
          preloadRoute(config.path, config.priority);
        }, config.delay || 1000);
        
        preloadTimers.current.set(config.path, timer);
      }
    });

    return () => {
      preloadTimers.current.forEach(timer => clearTimeout(timer));
      preloadTimers.current.clear();
    };
  }, [location.pathname, preloadRoute]);

  // Setup advanced preloading strategies
  useEffect(() => {
    const cleanupHover = setupHoverPreloading();
    const cleanupViewport = setupViewportPreloading();

    return () => {
      cleanupHover();
      cleanupViewport();
    };
  }, [setupHoverPreloading, setupViewportPreloading]);

  // Preload critical resources on idle
  useEffect(() => {
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/src/assets/new-hero-background.jpg',
        '/src/assets/business-meeting.jpg',
        '/src/assets/sba-logo.jpg',
        '/src/assets/commercial-building.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 1000);
    }
  }, []);

  return null;
};

export default AdvancedRoutePreloader;