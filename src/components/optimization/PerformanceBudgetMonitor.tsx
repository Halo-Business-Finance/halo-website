import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PerformanceBudget {
  metric: string;
  budget: number;
  current: number;
  unit: string;
  warning: number;
  critical: number;
}

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  bundleSize: number;
  imageSize: number;
  cacheHitRate: number;
}

const PerformanceBudgetMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    tti: 0,
    bundleSize: 0,
    imageSize: 0,
    cacheHitRate: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Performance budgets (enterprise targets)
  const budgets: PerformanceBudget[] = [
    {
      metric: 'First Contentful Paint',
      budget: 1200,
      current: metrics.fcp,
      unit: 'ms',
      warning: 1000,
      critical: 1200
    },
    {
      metric: 'Largest Contentful Paint',
      budget: 2000,
      current: metrics.lcp,
      unit: 'ms',
      warning: 1500,
      critical: 2000
    },
    {
      metric: 'First Input Delay',
      budget: 50,
      current: metrics.fid,
      unit: 'ms',
      warning: 30,
      critical: 50
    },
    {
      metric: 'Cumulative Layout Shift',
      budget: 0.05,
      current: metrics.cls,
      unit: '',
      warning: 0.03,
      critical: 0.05
    },
    {
      metric: 'Time to Interactive',
      budget: 2500,
      current: metrics.tti,
      unit: 'ms',
      warning: 2000,
      critical: 2500
    },
    {
      metric: 'Bundle Size',
      budget: 300,
      current: metrics.bundleSize,
      unit: 'KB',
      warning: 250,
      critical: 300
    },
    {
      metric: 'Image Size',
      budget: 500,
      current: metrics.imageSize,
      unit: 'KB',
      warning: 400,
      critical: 500
    },
    {
      metric: 'Cache Hit Rate',
      budget: 95,
      current: metrics.cacheHitRate,
      unit: '%',
      warning: 85,
      critical: 75
    }
  ];

  // Collect Core Web Vitals
  const collectCoreWebVitals = useCallback(() => {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: Math.round(fcpEntry.startTime) }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.processingStart) {
          const fid = entry.processingStart - entry.startTime;
          setMetrics(prev => ({ ...prev, fid: Math.round(fid) }));
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Calculate bundle size
  const calculateBundleSize = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let imageSize = 0;

    resources.forEach((resource) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
        
        if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
          imageSize += resource.transferSize;
        }
      }
    });

    setMetrics(prev => ({
      ...prev,
      bundleSize: Math.round(totalSize / 1024),
      imageSize: Math.round(imageSize / 1024)
    }));
  }, []);

  // Calculate cache hit rate
  const calculateCacheHitRate = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let cacheHits = 0;
    let totalRequests = resources.length;

    resources.forEach((resource) => {
      // If transfer size is 0 but encoded body size > 0, it's likely from cache
      if (resource.transferSize === 0 && resource.encodedBodySize > 0) {
        cacheHits++;
      }
    });

    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    setMetrics(prev => ({ ...prev, cacheHitRate: Math.round(hitRate * 10) / 10 }));
  }, []);

  // Calculate Time to Interactive
  const calculateTTI = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const tti = navigation.loadEventEnd - navigation.fetchStart;
      setMetrics(prev => ({ ...prev, tti: Math.round(tti) }));
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    const cleanup = collectCoreWebVitals();
    
    // Initial calculations
    setTimeout(() => {
      calculateBundleSize();
      calculateCacheHitRate();
      calculateTTI();
    }, 1000);

    // Periodic updates
    const interval = setInterval(() => {
      calculateBundleSize();
      calculateCacheHitRate();
    }, 10000);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [collectCoreWebVitals, calculateBundleSize, calculateCacheHitRate, calculateTTI]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  // Get status color based on performance
  const getStatusColor = (budget: PerformanceBudget): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (budget.current <= budget.warning) return 'default';
    if (budget.current <= budget.critical) return 'secondary';
    return 'destructive';
  };

  // Get progress percentage
  const getProgress = (budget: PerformanceBudget): number => {
    return Math.min((budget.current / budget.budget) * 100, 100);
  };

  // Calculate overall score
  const overallScore = budgets.reduce((score, budget) => {
    const status = getStatusColor(budget);
    if (status === 'default') return score + 100;
    if (status === 'secondary') return score + 70;
    return score + 30;
  }, 0) / budgets.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Enterprise Performance Budget Monitor
            <Badge variant={overallScore >= 90 ? 'default' : overallScore >= 70 ? 'secondary' : 'destructive'}>
              Score: {Math.round(overallScore)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgets.map((budget, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{budget.metric}</h4>
                    <Badge variant={getStatusColor(budget)}>
                      {budget.current}{budget.unit}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={getProgress(budget)} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {budget.budget}{budget.unit}</span>
                    <span>{Math.round(getProgress(budget))}%</span>
                  </div>
                  
                  {budget.current > budget.critical && (
                    <p className="text-xs text-destructive">
                      Exceeds budget by {budget.current - budget.budget}{budget.unit}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {budgets
              .filter(budget => getStatusColor(budget) !== 'default')
              .map((budget, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">{budget.metric}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRecommendation(budget.metric)}
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Get specific recommendations
function getRecommendation(metric: string): string {
  const recommendations: Record<string, string> = {
    'First Contentful Paint': 'Optimize critical rendering path, reduce server response time, enable compression',
    'Largest Contentful Paint': 'Optimize images, implement lazy loading, reduce JavaScript blocking time',
    'First Input Delay': 'Reduce JavaScript execution time, split code chunks, defer non-critical scripts',
    'Cumulative Layout Shift': 'Specify image dimensions, avoid dynamic content insertion, use CSS transforms',
    'Time to Interactive': 'Minimize main thread blocking, optimize JavaScript bundles, reduce third-party scripts',
    'Bundle Size': 'Enable tree shaking, compress assets, implement code splitting',
    'Image Size': 'Optimize image formats (WebP/AVIF), implement responsive images, compress images',
    'Cache Hit Rate': 'Configure cache headers, implement service worker caching, optimize cache strategies'
  };
  
  return recommendations[metric] || 'Optimize this metric for better performance';
}

export default PerformanceBudgetMonitor;