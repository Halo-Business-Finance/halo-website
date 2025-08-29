import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  event_data: any;
  source: string;
  user_id?: string;
}

export const SecurityEventLogger: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testEvent, setTestEvent] = useState<string | null>(null);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (queryError) {
        throw queryError;
      }

      setEvents(data || []);
    } catch (err: any) {
      console.error('Error loading security events:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testSecurityLogging = async () => {
    setTestEvent('Testing...');
    
    try {
      // Log a test security event directly to database
      const { error: insertError } = await supabase
        .from('security_events')
        .insert({
          event_type: 'security_test',
          severity: 'info',
          event_data: {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Security logging test event'
          },
          source: 'security_dashboard',
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (insertError) {
        throw insertError;
      }

      setTestEvent('✅ Test event logged successfully');
      await loadEvents(); // Reload events
    } catch (err: any) {
      console.error('Error testing security logging:', err);
      setTestEvent(`❌ Test failed: ${err.message}`);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Event Monitor
        </CardTitle>
        <CardDescription>
          Monitor and test security event logging functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={loadEvents} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Events
          </Button>
          <Button 
            onClick={testSecurityLogging}
            size="sm"
          >
            Test Logging
          </Button>
        </div>

        {testEvent && (
          <Alert>
            <AlertDescription>{testEvent}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Recent Security Events</h4>
          {events.length === 0 ? (
            <Alert>
              <AlertDescription>
                No security events found. This could indicate an issue with security event logging.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      <span className="font-medium">{event.event_type}</span>
                      <Badge variant={getSeverityColor(event.severity) as any}>
                        {event.severity}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Source: {event.source}
                  </div>
                  {event.event_data && Object.keys(event.event_data).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Event Data</summary>
                      <pre className="mt-1 bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.event_data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};