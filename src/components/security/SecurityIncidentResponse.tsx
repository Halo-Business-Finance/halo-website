import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  alert_type: string;
  priority: string;
  status: string;
  created_at: string;
  notes?: string;
  assigned_to?: string;
  event_id?: string;
  updated_at?: string;
}

export const SecurityIncidentResponse: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityAlerts();
    
    // Set up real-time subscription for new alerts
    const subscription = supabase
      .channel('security_alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setAlerts(prev => [newAlert, ...prev]);
          
          // Show toast for critical alerts
          if (newAlert.priority === 'critical') {
            toast({
              title: 'Critical Security Alert',
              description: `${newAlert.alert_type} detected`,
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const fetchSecurityAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to fetch security alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security alerts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncident = async (alertId: string, action: 'investigate' | 'resolve') => {
    try {
      const newStatus = action === 'investigate' ? 'investigating' : 'resolved';
      
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          status: newStatus,
          notes: `Status updated to ${newStatus} by admin`
        })
        .eq('id', alertId);

      if (error) throw error;

      // Trigger automated response if resolving critical incident
      if (action === 'resolve') {
        await supabase.functions.invoke('automated-security-response', {
          body: {
            action: 'incident_resolved',
            alertId,
            timestamp: new Date().toISOString()
          }
        });
      }

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: newStatus }
            : alert
        )
      );

      toast({
        title: 'Success',
        description: `Alert ${action === 'investigate' ? 'investigation started' : 'resolved'}`,
      });
    } catch (error) {
      console.error('Failed to handle incident:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert status',
        variant: 'destructive',
      });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Shield className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Incident Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading security alerts...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Incident Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            No active security alerts
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center space-x-3">
                {getPriorityIcon(alert.priority)}
                <div>
                  <div className="font-medium">{alert.alert_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(alert.priority)}>
                  {alert.priority}
                </Badge>
                <Badge variant="outline">
                  {alert.status}
                </Badge>
                
                {alert.status === 'open' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIncident(alert.id, 'investigate')}
                    >
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleIncident(alert.id, 'resolve')}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
                
                {alert.status === 'investigating' && (
                  <Button
                    size="sm"
                    onClick={() => handleIncident(alert.id, 'resolve')}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};