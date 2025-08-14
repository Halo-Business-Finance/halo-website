import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield, Key, Lock, Users, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityOverview {
  active_sessions: number;
  security_events_24h: number;
  critical_alerts: number;
  encryption_keys_active: number;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  priority: string;
  status: string;
  created_at: string;
  notes?: string;
  event_id?: string;
  assigned_to?: string;
  updated_at?: string;
}

export const SecurityDashboard: React.FC = () => {
  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityDashboard();
  }, []);

  const loadSecurityDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Load security overview
      const { data: overviewData, error: overviewError } = await supabase
        .rpc('get_security_overview');
      
      if (overviewError) throw overviewError;
      setOverview(overviewData[0]);
      
      // Load security alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (alertsError) throw alertsError;
      setAlerts(alertsData || []);
      
    } catch (error) {
      console.error('Failed to load security dashboard:', error);
      toast({
        title: "Security Dashboard Error",
        description: "Failed to load security information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forceSessionRotation = async (userId?: string) => {
    try {
      const { data, error } = await supabase
        .rpc('force_session_rotation', { p_user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: "Session Rotation Complete",
        description: `Successfully rotated ${data} sessions.`,
      });
      
      loadSecurityDashboard();
    } catch (error) {
      console.error('Failed to rotate sessions:', error);
      toast({
        title: "Session Rotation Failed",
        description: "Unable to rotate sessions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId);
      
      if (error) throw error;
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert Dismissed",
        description: "Security alert has been resolved.",
      });
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage system security</p>
        </div>
        <Button onClick={loadSecurityDashboard} variant="outline">
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.filter(alert => alert.priority === 'critical').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Security Alerts</AlertTitle>
          <AlertDescription>
            {alerts.filter(alert => alert.priority === 'critical').length} critical security alerts require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.active_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently authenticated users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.security_events_24h || 0}</div>
            <p className="text-xs text-muted-foreground">Events in last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overview?.critical_alerts || 0}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encryption Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.encryption_keys_active || 0}</div>
            <p className="text-xs text-muted-foreground">Active encryption keys</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Actions
          </CardTitle>
          <CardDescription>Emergency security controls and monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => forceSessionRotation()} 
              variant="destructive"
              size="sm"
            >
              <Lock className="mr-2 h-4 w-4" />
              Force All Session Rotation
            </Button>
            <Button 
              onClick={loadSecurityDashboard} 
              variant="outline"
              size="sm"
            >
              <Activity className="mr-2 h-4 w-4" />
              Run Security Scan
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Use these controls carefully. Session rotation will log out all users immediately.
          </p>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>Recent security events requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No active security alerts</p>
              <p className="text-sm">Your system is secure</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.alert_type}</span>
                    </div>
                    {alert.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{alert.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => dismissAlert(alert.id)} 
                    variant="ghost" 
                    size="sm"
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};