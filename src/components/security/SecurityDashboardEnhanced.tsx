import React, { useEffect, useState } from 'react';
import { useEnhancedSecurity } from './EnhancedSecurityProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Eye, Clock, Lock, TrendingUp } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  event_data: any;
  ip_address?: string | null;
  user_id?: string | null;
  source?: string | null;
  user_agent?: string | null;
  resolved_at?: string | null;
  resolved_by?: string | null;
  risk_score?: number | null;
  session_id?: string | null;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  priority: string;
  status: string;
  created_at: string;
  notes?: string;
}

export const SecurityDashboardEnhanced: React.FC = () => {
  const { metrics, checkSecurityStatus, reportSecurityEvent } = useEnhancedSecurity();
  const { userRole, isAdmin } = useAuth();
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadSecurityData();
    }
  }, [isAdmin]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Load recent security events
      const { data: events } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Load active security alerts
      const { data: alerts } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setRecentEvents((events || []) as SecurityEvent[]);
      setActiveAlerts(alerts || []);
    } catch (error) {
      console.error('Failed to load security data:', error);
      await reportSecurityEvent('dashboard_load_error', 'medium', { error });
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleRefresh = async () => {
    await checkSecurityStatus();
    await loadSecurityData();
  };

  if (!isAdmin) {
    return (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          Administrator privileges required to view security dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={getThreatLevelColor(metrics.threatLevel)}>
                {metrics.threatLevel.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.riskScore}/100</div>
            <Progress value={metrics.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentEvents}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Security Alerts</span>
            </CardTitle>
            <CardDescription>
              Critical security issues requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{formatEventType(alert.alert_type)}</span>
                  <Badge variant={alert.priority === 'critical' ? 'destructive' : 'default'}>
                    {alert.priority}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {alert.notes || 'Security alert detected - investigation required'}
                  <div className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(alert.created_at).toLocaleString()}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>
              Latest security activities and monitoring events
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading security events...</div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recent security events
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getSeverityIcon(event.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {formatEventType(event.event_type)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleString()}
                      {event.ip_address && ` • IP: ${event.ip_address}`}
                    </p>
                    {event.event_data && Object.keys(event.event_data).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                          Event Details
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto">
                          {JSON.stringify(event.event_data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security System Status</CardTitle>
          <CardDescription>
            Last updated: {metrics.lastUpdated.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiting</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Input Validation</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PII Encryption</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit Logging</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role-Based Access</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Monitoring</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};