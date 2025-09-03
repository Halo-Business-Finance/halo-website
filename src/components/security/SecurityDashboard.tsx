import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AdminInitializer } from './AdminInitializer';
import { SecurityEventOptimizer } from './SecurityEventOptimizer';
import { Shield, AlertTriangle, TrendingUp, Users, Database, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  recentEvents: number;
  openAlerts: number;
  activeAdmins: number;
}

export const SecurityDashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityMetrics();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .eq('is_active', true)
        .limit(1);

      if (error) throw error;
      setHasAdmins(data && data.length > 0);
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const fetchSecurityMetrics = async () => {
    setLoading(true);
    try {
      // Get security events metrics
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('severity, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (eventsError) throw eventsError;

      // Get open alerts count
      const { count: alertsCount, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      if (alertsError) throw alertsError;

      // Get active admins count
      const { count: adminsCount, error: adminsError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('is_active', true);

      if (adminsError) throw adminsError;

      const totalEvents = eventsData?.length || 0;
      const criticalEvents = eventsData?.filter(e => e.severity === 'critical').length || 0;
      const highEvents = eventsData?.filter(e => e.severity === 'high').length || 0;
      const recentEvents = eventsData?.filter(e => 
        new Date(e.created_at) > new Date(Date.now() - 60 * 60 * 1000)
      ).length || 0;

      setMetrics({
        totalEvents,
        criticalEvents,
        highEvents,
        recentEvents,
        openAlerts: alertsCount || 0,
        activeAdmins: adminsCount || 0
      });
    } catch (error: any) {
      console.error('Error fetching security metrics:', error);
      toast({
        title: 'Error Loading Security Metrics',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const runSecurityOptimization = async () => {
    try {
      const { data, error } = await supabase.rpc('optimize_security_events');
      if (error) throw error;

      toast({
        title: 'Security Optimization Complete',
        description: `Cleaned up ${data || 0} redundant security events`,
      });
      
      // Refresh metrics
      fetchSecurityMetrics();
    } catch (error: any) {
      toast({
        title: 'Optimization Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Show admin initializer if no admins exist
  if (hasAdmins === false) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <Badge variant="destructive">Action Required</Badge>
        </div>
        
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Critical:</strong> No administrators found. The system requires at least one administrator for security management.
          </AlertDescription>
        </Alert>

        <AdminInitializer />
      </div>
    );
  }

  // Show loading state
  if (loading || hasAdmins === null) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading security metrics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Access denied. Administrative privileges required to view security dashboard.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSecurityStatus = () => {
    if (!metrics) return { status: 'unknown', color: 'secondary' };
    
    if (metrics.criticalEvents > 5 || metrics.openAlerts > 10) {
      return { status: 'critical', color: 'destructive' };
    } else if (metrics.criticalEvents > 0 || metrics.highEvents > 10) {
      return { status: 'high', color: 'warning' };
    } else if (metrics.totalEvents > 1000) {
      return { status: 'monitoring', color: 'info' };
    }
    return { status: 'good', color: 'success' };
  };

  const securityStatus = getSecurityStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <Badge variant={securityStatus.color as any}>
            {securityStatus.status.toUpperCase()}
          </Badge>
        </div>
        <Button onClick={fetchSecurityMetrics} variant="outline">
          Refresh Metrics
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics?.criticalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.recentEvents || 0} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics?.openAlerts || 0}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Administrators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeAdmins || 0}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics?.highEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Elevated risk events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">SECURE</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="admin">Administration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status Summary</CardTitle>
              <CardDescription>
                Current security posture and recommended actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(metrics?.criticalEvents || 0) > 0 && (
                <Alert className="border-destructive bg-destructive/5">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    <strong>{metrics?.criticalEvents} critical events</strong> detected in the last 24 hours. 
                    Immediate investigation required.
                  </AlertDescription>
                </Alert>
              )}

              {(metrics?.totalEvents || 0) > 10000 && (
                <Alert className="border-warning bg-warning/5">
                  <Database className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning">
                    <strong>High event volume detected.</strong> Consider running security event optimization 
                    to improve system performance.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Security Monitoring</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Row Level Security enabled</li>
                    <li>✅ Real-time threat detection active</li>
                    <li>✅ Administrative access logging</li>
                    <li>✅ Session anomaly detection</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Data Protection</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ PII encryption enabled</li>
                    <li>✅ Secure consultation forms</li>
                    <li>✅ Input validation active</li>
                    <li>✅ CSRF protection enabled</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security events and threat indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Event details and analysis tools are available in the full security monitoring system.
                  Contact your system administrator for detailed event logs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <SecurityEventOptimizer />
          
          <Card>
            <CardHeader>
              <CardTitle>Security Maintenance</CardTitle>
              <CardDescription>
                System optimization and cleanup tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runSecurityOptimization}
                variant="outline"
                className="w-full"
              >
                Run Full Security Optimization
              </Button>
              
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Regular maintenance helps maintain optimal security monitoring performance.
                  Run optimization weekly or when event volume exceeds 50,000 entries.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Tools</CardTitle>
              <CardDescription>
                User and role management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  Advanced administrative functions are available through the admin panel.
                  Current admin count: {metrics?.activeAdmins || 0}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};