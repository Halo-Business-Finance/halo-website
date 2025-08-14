import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePerformanceMetrics } from '@/components/optimization/PerformanceMonitor';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  status: 'good' | 'needs-improvement' | 'poor';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, status }) => {
  const statusColors = {
    good: 'bg-green-100 text-green-800',
    'needs-improvement': 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge className={statusColors[status]}>{status.replace('-', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const PerformanceDashboard: React.FC = () => {
  const { getMetrics } = usePerformanceMetrics();
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [webVitals, setWebVitals] = useState<{
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }>({});

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 5000);

    // Collect Web Vitals
    const collectWebVitals = () => {
      // LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        setWebVitals(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setWebVitals(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // TTFB
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
        setWebVitals(prev => ({ ...prev, ttfb }));
      }
    };

    collectWebVitals();

    return () => {
      clearInterval(interval);
    };
  }, [getMetrics]);

  const getMetricStatus = (value: number, goodThreshold: number, poorThreshold: number): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= goodThreshold) return 'good';
    if (value <= poorThreshold) return 'needs-improvement';
    return 'poor';
  };

  const formatMetric = (value: number | undefined, unit: string = 'ms'): string => {
    if (value === undefined) return 'N/A';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 'score') return value.toFixed(3);
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Performance Dashboard</h2>
        <p className="text-muted-foreground">Monitor your website's Core Web Vitals and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Largest Contentful Paint (LCP)"
          value={formatMetric(webVitals.lcp)}
          description="Time to render the largest element"
          status={webVitals.lcp ? getMetricStatus(webVitals.lcp, 2500, 4000) : 'good'}
        />
        
        <MetricCard
          title="Cumulative Layout Shift (CLS)"
          value={formatMetric(webVitals.cls, 'score')}
          description="Visual stability of the page"
          status={webVitals.cls ? getMetricStatus(webVitals.cls, 0.1, 0.25) : 'good'}
        />
        
        <MetricCard
          title="Time to First Byte (TTFB)"
          value={formatMetric(webVitals.ttfb)}
          description="Server response time"
          status={webVitals.ttfb ? getMetricStatus(webVitals.ttfb, 600, 1500) : 'good'}
        />

        <MetricCard
          title="Memory Usage"
          value={formatMetric(metrics.memoryUsed, 'MB')}
          description="JavaScript heap memory"
          status={metrics.memoryUsed ? getMetricStatus(metrics.memoryUsed, 50, 100) : 'good'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
          <CardDescription>Suggestions to improve your website's performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {webVitals.lcp && webVitals.lcp > 2500 && (
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold">Improve LCP</h4>
              <p className="text-sm text-muted-foreground">Consider optimizing images, preloading critical resources, or using a CDN.</p>
            </div>
          )}
          
          {webVitals.cls && webVitals.cls > 0.1 && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold">Reduce Layout Shifts</h4>
              <p className="text-sm text-muted-foreground">Set explicit dimensions for images and ensure proper font loading.</p>
            </div>
          )}
          
          {metrics.memoryUsed && metrics.memoryUsed > 50 && (
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-semibold">Optimize Memory Usage</h4>
              <p className="text-sm text-muted-foreground">Consider code splitting or cleanup of unused resources.</p>
            </div>
          )}
          
          {(!webVitals.lcp || webVitals.lcp <= 2500) && 
           (!webVitals.cls || webVitals.cls <= 0.1) && 
           (!metrics.memoryUsed || metrics.memoryUsed <= 50) && (
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold">Great Performance!</h4>
              <p className="text-sm text-muted-foreground">Your website is performing well across all metrics.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Use lazy loading for images and components below the fold</li>
            <li>• Implement code splitting to reduce initial bundle size</li>
            <li>• Preload critical resources and use proper caching strategies</li>
            <li>• Optimize images with modern formats (WebP, AVIF)</li>
            <li>• Monitor and clean up memory leaks regularly</li>
            <li>• Use service workers for better caching control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;