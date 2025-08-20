import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

interface SecurityBaseline {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  encryptionKeysActive: number;
  rateLimit: {
    violations: number;
    blocks: number;
  };
}

export const SecurityMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [baseline, setBaseline] = useState<SecurityBaseline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadSecurityMetrics();
    const interval = setInterval(loadSecurityMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityMetrics = async () => {
    try {
      // Get security events for baseline calculation
      const { data: events, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (eventsError) throw eventsError;

      // Calculate baseline metrics
      const newBaseline: SecurityBaseline = {
        totalEvents: events?.length || 0,
        criticalEvents: events?.filter(e => e.severity === 'critical').length || 0,
        failedLogins: events?.filter(e => e.event_type.includes('login_failed')).length || 0,
        suspiciousActivity: events?.filter(e => e.event_type.includes('suspicious')).length || 0,
        encryptionKeysActive: 0, // Will be populated by service role function
        rateLimit: {
          violations: events?.filter(e => e.event_type.includes('rate_limit')).length || 0,
          blocks: events?.filter(e => e.event_type.includes('blocked')).length || 0,
        }
      };

      setBaseline(newBaseline);

      // Calculate security metrics with thresholds
      const newMetrics: SecurityMetric[] = [
        {
          id: 'critical_events',
          name: 'Critical Security Events (24h)',
          value: newBaseline.criticalEvents,
          threshold: 5,
          status: newBaseline.criticalEvents > 5 ? 'critical' : newBaseline.criticalEvents > 2 ? 'warning' : 'healthy',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'failed_logins',
          name: 'Failed Login Attempts (24h)',
          value: newBaseline.failedLogins,
          threshold: 20,
          status: newBaseline.failedLogins > 20 ? 'critical' : newBaseline.failedLogins > 10 ? 'warning' : 'healthy',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'suspicious_activity',
          name: 'Suspicious Activity Events (24h)',
          value: newBaseline.suspiciousActivity,
          threshold: 10,
          status: newBaseline.suspiciousActivity > 10 ? 'critical' : newBaseline.suspiciousActivity > 5 ? 'warning' : 'healthy',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'rate_limit_violations',
          name: 'Rate Limit Violations (24h)',
          value: newBaseline.rateLimit.violations,
          threshold: 50,
          status: newBaseline.rateLimit.violations > 50 ? 'critical' : newBaseline.rateLimit.violations > 25 ? 'warning' : 'healthy',
          lastUpdated: new Date().toISOString()
        }
      ];

      setMetrics(newMetrics);

      // Generate alerts for critical metrics
      const newAlerts: string[] = [];
      newMetrics.forEach(metric => {
        if (metric.status === 'critical') {
          newAlerts.push(`CRITICAL: ${metric.name} has exceeded threshold (${metric.value}/${metric.threshold})`);
        }
      });
      setAlerts(newAlerts);

    } catch (error) {
      console.error('Error loading security metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      critical: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Security Monitoring</h2>
        </div>
        <Button onClick={loadSecurityMetrics} variant="outline" size="sm">
          Refresh Metrics
        </Button>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Threshold: {metric.threshold}
                </p>
                {getStatusBadge(metric.status)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Baseline Summary */}
      {baseline && (
        <Card>
          <CardHeader>
            <CardTitle>Security Baseline (24h)</CardTitle>
            <CardDescription>
              Overview of security events and system health metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{baseline.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{baseline.criticalEvents}</div>
                <div className="text-sm text-muted-foreground">Critical Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{baseline.rateLimit.violations}</div>
                <div className="text-sm text-muted-foreground">Rate Limit Violations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {baseline.totalEvents - baseline.criticalEvents - baseline.suspiciousActivity}
                </div>
                <div className="text-sm text-muted-foreground">Normal Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};