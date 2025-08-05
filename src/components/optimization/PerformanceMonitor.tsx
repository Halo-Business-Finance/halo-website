import { useEffect } from 'react';

// Performance monitoring component
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Log Core Web Vitals
    if ('web-vital' in window) {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          console.log(`Performance metric: ${entry.name}`, entry);
        });
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Monitor large images
    const imageObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (resourceEntry.transferSize && resourceEntry.transferSize > 500000) { // Images larger than 500KB
          console.warn(`Large image detected: ${entry.name} (${Math.round(resourceEntry.transferSize / 1024)}KB)`);
        }
      });
    });
    imageObserver.observe({ entryTypes: ['resource'] });

    // Monitor slow resources
    const resourceObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (entry.duration > 2000) { // Resources taking more than 2 seconds
          console.warn(`Slow resource: ${entry.name} took ${Math.round(entry.duration)}ms`);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    return () => {
      imageObserver?.disconnect();
      resourceObserver?.disconnect();
    };
  }, []);

  return null;
};

// Component to measure and log render times
export const withPerformanceMeasure = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return function MeasuredComponent(props: P) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        if (renderTime > 100) { // Log if render takes more than 100ms
          console.log(`${componentName} render time: ${Math.round(renderTime)}ms`);
        }
      };
    });

    return <WrappedComponent {...props} />;
  };
};