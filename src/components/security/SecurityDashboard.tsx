import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Eye, 
  TrendingUp,
  Clock,
  MapPin,
  Zap,
  RefreshCw
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'suspicious_activity' | 'form_validation' | 'xss_attempt' | 'csrf_violation';
  timestamp: number;
  ip: string;
  userAgent: string;
  endpoint: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  blocked: boolean;
}

interface SecurityMetrics {
  totalEvents: number;
  blockedRequests: number;
  suspiciousActivities: number;
  rateLimitViolations: number;
  formValidationErrors: number;
  xssAttempts: number;
  csrfViolations: number;
}

export const SecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    blockedRequests: 0,
    suspiciousActivities: 0,
    rateLimitViolations: 0,
    formValidationErrors: 0,
    xssAttempts: 0,
    csrfViolations: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    loadSecurityEvents();
    const interval = setInterval(loadSecurityEvents, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadSecurityEvents = () => {
    try {
      const storedEvents = localStorage.getItem('security_events');
      const storedMetrics = localStorage.getItem('security_metrics');
      
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents.slice(-100)); // Keep last 100 events
      }
      
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
    } catch (error) {
      console.error('Failed to load security events:', error);
    }
  };

  const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };

    const updatedEvents = [...events, newEvent].slice(-100);
    const updatedMetrics = {
      ...metrics,
      totalEvents: metrics.totalEvents + 1,
      blockedRequests: event.blocked ? metrics.blockedRequests + 1 : metrics.blockedRequests,
      suspiciousActivities: event.type === 'suspicious_activity' ? metrics.suspiciousActivities + 1 : metrics.suspiciousActivities,
      rateLimitViolations: event.type === 'rate_limit' ? metrics.rateLimitViolations + 1 : metrics.rateLimitViolations,
      formValidationErrors: event.type === 'form_validation' ? metrics.formValidationErrors + 1 : metrics.formValidationErrors,
      xssAttempts: event.type === 'xss_attempt' ? metrics.xssAttempts + 1 : metrics.xssAttempts,
      csrfViolations: event.type === 'csrf_violation' ? metrics.csrfViolations + 1 : metrics.csrfViolations
    };

    setEvents(updatedEvents);
    setMetrics(updatedMetrics);

    localStorage.setItem('security_events', JSON.stringify(updatedEvents));
    localStorage.setItem('security_metrics', JSON.stringify(updatedMetrics));

    // Trigger alerts for high severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      showSecurityAlert(newEvent);
    }
  };

  const showSecurityAlert = (event: SecurityEvent) => {
    // In a real application, this would trigger notifications
    console.warn('Security Alert:', event);
  };

  const clearEvents = () => {
    setEvents([]);
    setMetrics({
      totalEvents: 0,
      blockedRequests: 0,
      suspiciousActivities: 0,
      rateLimitViolations: 0,
      formValidationErrors: 0,
      xssAttempts: 0,
      csrfViolations: 0
    });
    localStorage.removeItem('security_events');
    localStorage.removeItem('security_metrics');
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'rate_limit': return <Clock className="h-4 w-4" />;
      case 'suspicious_activity': return <Eye className="h-4 w-4" />;
      case 'form_validation': return <AlertTriangle className="h-4 w-4" />;
      case 'xss_attempt': return <Zap className="h-4 w-4" />;
      case 'csrf_violation': return <Lock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  // Make logSecurityEvent available globally for other components
  useEffect(() => {
    (window as any).logSecurityEvent = logSecurityEvent;
  }, [events, metrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"}>
            {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
          </Badge>
          <Button onClick={() => setIsMonitoring(!isMonitoring)} variant="outline" size="sm">
            {isMonitoring ? "Pause" : "Resume"}
          </Button>
          <Button onClick={clearEvents} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold">{metrics.blockedRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspicious</p>
                <p className="text-2xl font-bold">{metrics.suspiciousActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rate Limited</p>
                <p className="text-2xl font-bold">{metrics.rateLimitViolations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No security events recorded</p>
                ) : (
                  events.slice().reverse().map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.type.replace('_', ' ')}</span>
                          <Badge variant={event.blocked ? "destructive" : "secondary"}>
                            {event.blocked ? "Blocked" : "Allowed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()} • {event.endpoint}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rate Limit Violations</span>
                    <span className="font-bold">{metrics.rateLimitViolations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Form Validation Errors</span>
                    <span className="font-bold">{metrics.formValidationErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XSS Attempts</span>
                    <span className="font-bold">{metrics.xssAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CSRF Violations</span>
                    <span className="font-bold">{metrics.csrfViolations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Enhanced security monitoring is active. All requests are being analyzed for threats.
                    </AlertDescription>
                  </Alert>
                  {metrics.totalEvents > 100 && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        High activity detected. Consider reviewing security policies.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Automated threat detection is monitoring for suspicious patterns and known attack vectors.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">XSS Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitoring for cross-site scripting attempts in form inputs and URL parameters.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">CSRF Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Validating CSRF tokens on all form submissions to prevent cross-site request forgery.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Progressive rate limiting with captcha challenges for repeated violations.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Input Validation</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time validation and sanitization of all user inputs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};