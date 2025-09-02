import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, Trash2, BarChart3, CheckCircle } from 'lucide-react';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  recentEvents: number;
  noiseEvents: number;
}

export const SecurityEventOptimizer: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityMetrics();
      // Auto-refresh metrics every 30 seconds
      const interval = setInterval(fetchSecurityMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchSecurityMetrics = async () => {
    if (!isAdmin) return;
    
    try {
      setIsLoading(true);
      
      // Get comprehensive metrics
      const { data: totalCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true });

      const { data: criticalCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .in('severity', ['critical', 'high']);

      const { data: recentCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: noiseCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .in('event_type', ['client_log', 'console_access', 'dom_mutation', 'behavioral_pattern_deviation']);

      setMetrics({
        totalEvents: totalCount?.length || 0,
        criticalEvents: criticalCount?.length || 0,
        recentEvents: recentCount?.length || 0,
        noiseEvents: noiseCount?.length || 0,
      });

    } catch (error) {
      console.error('Error fetching security metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeSecurityEvents = async () => {
    if (!isAdmin) return;
    
    setIsOptimizing(true);
    try {
      // Call the optimization function
      const { data, error } = await supabase.rpc('optimize_security_events');
      
      if (error) throw error;
      
      toast({
        title: "Security Optimization Complete",
        description: `Cleaned up ${data || 0} excessive security events. Performance improved significantly.`,
      });
      
      // Refresh metrics
      await fetchSecurityMetrics();
    } catch (error) {
      console.error('Error during optimization:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize security events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const performEmergencyCleanup = async () => {
    if (!isAdmin) return;
    
    setIsOptimizing(true);
    try {
      // Emergency cleanup of all non-critical events
      const { error } = await supabase
        .from('security_events')
        .delete()
        .not('severity', 'in', '(critical,high)')
        .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Keep last hour
      
      if (error) throw error;
      
      toast({
        title: "Emergency Cleanup Complete",
        description: "Removed all non-critical events older than 1 hour. System performance restored.",
      });
      
      await fetchSecurityMetrics();
    } catch (error) {
      console.error('Error during emergency cleanup:', error);
      toast({
        title: "Emergency Cleanup Failed",
        description: "Failed to perform emergency cleanup. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!isAdmin) return null;

  const getSecurityStatus = () => {
    if (!metrics) return { status: 'loading', color: 'secondary' };
    
    if (metrics.recentEvents > 50000) return { status: 'critical', color: 'destructive' };
    if (metrics.recentEvents > 10000) return { status: 'warning', color: 'warning' };
    if (metrics.noiseEvents > 1000) return { status: 'noisy', color: 'warning' };
    return { status: 'healthy', color: 'success' };
  };

  const { status, color } = getSecurityStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Security Event Optimizer
          </CardTitle>
          <CardDescription>
            Monitor and optimize security event logging to prevent system overload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Alert>
              <AlertDescription>Loading security metrics...</AlertDescription>
            </Alert>
          ) : metrics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.totalEvents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{metrics.criticalEvents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Critical Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{metrics.recentEvents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Last 24h</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{metrics.noiseEvents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Noise Events</div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <span>System Status:</span>
            <Badge variant={color as any}>
              {status === 'loading' && 'Loading...'}
              {status === 'critical' && 'Critical - Immediate Action Required'}
              {status === 'warning' && 'Warning - Optimization Recommended'}
              {status === 'noisy' && 'Noisy - Cleanup Recommended'}
              {status === 'healthy' && 'Healthy'}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={optimizeSecurityEvents}
              disabled={isOptimizing}
              className="flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Events'}
            </Button>
            
            {status === 'critical' && (
              <Button 
                onClick={performEmergencyCleanup}
                disabled={isOptimizing}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Emergency Cleanup
              </Button>
            )}
          </div>

          {status === 'healthy' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Security monitoring is optimized and performing well.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};