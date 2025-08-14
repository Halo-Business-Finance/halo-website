import { useEffect, useRef } from 'react';
import { throttle } from '@/utils/performance';

// Advanced performance monitoring component
export const PerformanceMonitor = () => {
  const metricsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // Enhanced Core Web Vitals monitoring
    const observeWebVitals = () => {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          metricsRef.current.lcp = entry.startTime;
          if (entry.startTime > 2500) {
            console.warn(`Poor LCP: ${Math.round(entry.startTime)}ms (target: <2.5s)`);
          }
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const processingTime = (entry as any).processingStart - entry.startTime;
          metricsRef.current.fid = processingTime;
          if (processingTime > 100) {
            console.warn(`Poor FID: ${Math.round(processingTime)}ms (target: <100ms)`);
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metricsRef.current.cls = clsValue;
        if (clsValue > 0.1) {
          console.warn(`Poor CLS: ${clsValue.toFixed(3)} (target: <0.1)`);
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    };

    // Monitor resource performance
    const resourceObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Large resource detection
        if (resourceEntry.transferSize && resourceEntry.transferSize > 1000000) { // 1MB
          console.warn(`Large resource: ${entry.name} (${Math.round(resourceEntry.transferSize / 1024 / 1024)}MB)`);
        }
        
        // Slow resource detection
        if (entry.duration > 3000) { // 3 seconds
          console.warn(`Slow resource: ${entry.name} took ${Math.round(entry.duration)}ms`);
        }
        
        // Failed resources
        if (resourceEntry.transferSize === 0 && entry.duration > 0) {
          console.error(`Failed to load: ${entry.name}`);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Memory usage monitoring
    const monitorMemory = throttle(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        
        if (usedMB > limitMB * 0.8) { // 80% of limit
          console.warn(`High memory usage: ${usedMB}MB / ${limitMB}MB`);
        }
        
        metricsRef.current.memoryUsed = usedMB;
        metricsRef.current.memoryTotal = totalMB;
      }
    }, 5000);

    // Connection monitoring
    const monitorConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          console.warn('Slow connection detected, consider reducing resource usage');
        }
        
        metricsRef.current.connectionType = effectiveType;
      }
    };

    // Long task monitoring (blocking main thread)
    const longTaskObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks over 50ms block rendering
          console.warn(`Long task detected: ${Math.round(entry.duration)}ms (blocks rendering)`);
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Initialize monitoring
    const cleanup = observeWebVitals();
    monitorMemory();
    monitorConnection();

    // Set up periodic monitoring
    const memoryInterval = setInterval(monitorMemory, 10000);
    const connectionInterval = setInterval(monitorConnection, 30000);

    // Performance metrics logging
    const logMetrics = () => {
      console.group('Performance Metrics');
      console.log('Core Web Vitals:', {
        LCP: metricsRef.current.lcp ? `${Math.round(metricsRef.current.lcp)}ms` : 'N/A',
        FID: metricsRef.current.fid ? `${Math.round(metricsRef.current.fid)}ms` : 'N/A',
        CLS: metricsRef.current.cls ? metricsRef.current.cls.toFixed(3) : 'N/A'
      });
      console.log('Memory:', {
        used: metricsRef.current.memoryUsed ? `${metricsRef.current.memoryUsed}MB` : 'N/A',
        total: metricsRef.current.memoryTotal ? `${metricsRef.current.memoryTotal}MB` : 'N/A'
      });
      console.log('Connection:', metricsRef.current.connectionType || 'N/A');
      console.groupEnd();
    };

    // Log metrics every minute in development
    const metricsInterval = setInterval(logMetrics, 60000);

    return () => {
      cleanup?.();
      resourceObserver.disconnect();
      longTaskObserver.disconnect();
      clearInterval(memoryInterval);
      clearInterval(connectionInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return null;
};

// HOC for measuring component performance
export const withPerformanceMeasure = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return function MeasuredComponent(props: P) {
    const renderStartRef = useRef<number>();
    const mountStartRef = useRef<number>();

    useEffect(() => {
      mountStartRef.current = performance.now();
      
      return () => {
        if (mountStartRef.current) {
          const mountTime = performance.now() - mountStartRef.current;
          if (mountTime > 500) { // Log if mount takes more than 500ms
            console.log(`${componentName} total lifetime: ${Math.round(mountTime)}ms`);
          }
        }
      };
    }, []);

    useEffect(() => {
      renderStartRef.current = performance.now();
      
      // Measure after render
      const timeoutId = setTimeout(() => {
        if (renderStartRef.current) {
          const renderTime = performance.now() - renderStartRef.current;
          if (renderTime > 100) { // Log if render takes more than 100ms
            console.log(`${componentName} render time: ${Math.round(renderTime)}ms`);
          }
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    });

    return <WrappedComponent {...props} />;
  };
};

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const metricsRef = useRef<Record<string, number>>({});
  
  const getMetrics = () => metricsRef.current;
  
  const measureOperation = async (
    name: string,
    operation: () => any | Promise<any>
  ): Promise<any> => {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      metricsRef.current[name] = duration;
      
      if (duration > 1000) {
        console.warn(`Slow operation "${name}": ${Math.round(duration)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Failed operation "${name}" after ${Math.round(duration)}ms:`, error);
      throw error;
    }
  };
  
  return { getMetrics, measureOperation };
};