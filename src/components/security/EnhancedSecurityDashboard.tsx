import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Users, Database, Lock, Eye, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityEventCleanup } from './SecurityEventCleanup';
import { toast } from 'sonner';

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  activeThreats: number;
  sessionSecurity: 'healthy' | 'warning' | 'critical';
  dataSecurity: 'healthy' | 'warning' | 'critical';
  systemSecurity: 'healthy' | 'warning' | 'critical';
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  user_id?: string;
  event_data: any;
  ip_address?: string;
  risk_score?: number;
  resolved_at?: string;
}

export const EnhancedSecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalAlerts: 0,
    activeThreats: 0,
    sessionSecurity: 'healthy',
    dataSecurity: 'healthy',
    systemSecurity: 'healthy'
  });
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchSecurityData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch security metrics
      const { data: metricsData, error: metricsError } = await supabase.functions.invoke('get-security-metrics', {
        body: { timeframe: '24h' }
      });

      if (metricsError) throw metricsError;

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase.functions.invoke('get-security-events', {
        body: { 
          limit: 10,
          severities: ['critical', 'high', 'medium']
        }
      });

      if (eventsError) throw eventsError;

      setMetrics(metricsData || {
        totalEvents: 0,
        criticalAlerts: 0,
        activeThreats: 0,
        sessionSecurity: 'healthy',
        dataSecurity: 'healthy',
        systemSecurity: 'healthy'
      });
      
      setRecentEvents(eventsData || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSecurityStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSecurityData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="cleanup">Database Cleanup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Security</CardTitle>
            {getSecurityStatusIcon(metrics.sessionSecurity)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getSecurityStatusColor(metrics.sessionSecurity)}>
                {metrics.sessionSecurity.toUpperCase()}
              </Badge>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Security</CardTitle>
            {getSecurityStatusIcon(metrics.dataSecurity)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getSecurityStatusColor(metrics.dataSecurity)}>
                {metrics.dataSecurity.toUpperCase()}
              </Badge>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Security</CardTitle>
            {getSecurityStatusIcon(metrics.systemSecurity)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getSecurityStatusColor(metrics.systemSecurity)}>
                {metrics.systemSecurity.toUpperCase()}
              </Badge>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Events (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalEvents}</div>
            <p className="text-sm text-muted-foreground">Total security events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics.criticalAlerts}</div>
            <p className="text-sm text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{metrics.activeThreats}</div>
            <p className="text-sm text-muted-foreground">Currently being monitored</p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Recent Security Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security events across all systems</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No recent security events. All systems operating normally.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{event.event_type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatTimeAgo(event.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.severity === 'critical' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-6">
          <div className="grid gap-6">
            <SecurityEventCleanup />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Optimization Status
                </CardTitle>
                <CardDescription>
                  Monitor security event database performance and cleanup status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {recentEvents.filter(e => e.event_type === 'client_log').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Client Log Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {recentEvents.filter(e => e.severity === 'info').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Info Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {recentEvents.filter(e => ['critical', 'high'].includes(e.severity)).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Critical/High Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};