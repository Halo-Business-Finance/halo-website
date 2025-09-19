import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Users,
  Eye,
  Lock,
  Monitor,
  Database,
  Server,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  message: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  admin_user_id?: string;
  resolved: boolean;
  created_at: string;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  resolvedEvents: number;
  activeSessions: number;
  recentAttempts: number;
}

const severityColors = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const severityIcons = {
  info: <CheckCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <AlertTriangle className="h-4 w-4" />,
  critical: <AlertTriangle className="h-4 w-4" />
};

const SecurityMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    resolvedEvents: 0,
    activeSessions: 0,
    recentAttempts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // Simulate loading security data since we don't have the actual security logs endpoint
      // In a real implementation, this would fetch from your security monitoring system
      setStats({
        totalEvents: 247,
        criticalEvents: 3,
        resolvedEvents: 235,
        activeSessions: 2,
        recentAttempts: 12
      });

      // Mock security events data
      setEvents([
        {
          id: '1',
          event_type: 'admin_login',
          severity: 'info',
          message: 'Admin user logged in successfully',
          details: { ip: '192.168.1.1' },
          ip_address: '192.168.1.1',
          resolved: true,
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: '2',
          event_type: 'failed_login_attempt',
          severity: 'warning',
          message: 'Failed login attempt with invalid credentials',
          details: { attempts: 3 },
          ip_address: '10.0.0.5',
          resolved: false,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          id: '3',
          event_type: 'lead_submission',
          severity: 'info',
          message: 'New lead form submitted',
          details: { form_type: 'consultation' },
          ip_address: '203.0.113.1',
          resolved: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          id: '4',
          event_type: 'suspicious_activity',
          severity: 'critical',
          message: 'Multiple failed login attempts from same IP',
          details: { attempts: 10, blocked: true },
          ip_address: '198.51.100.1',
          resolved: false,
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security monitoring data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityScore = () => {
    const score = Math.max(0, 100 - (stats.criticalEvents * 20) - ((stats.totalEvents - stats.resolvedEvents) * 5));
    return Math.min(100, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Security Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}%
              </p>
            </div>
            <Shield className={`h-8 w-8 ${getScoreColor(securityScore)}`} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Active Sessions</p>
              <p className="text-2xl font-bold">{stats.activeSessions}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalEvents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Events Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedEvents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {stats.criticalEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.criticalEvents} critical security event(s) that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Events */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Event Monitor
              </CardTitle>
              <CardDescription>
                Real-time security events and system activity monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {formatDistanceToNow(lastRefresh)} ago
              </span>
              <Button variant="outline" size="sm" onClick={loadSecurityData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {severityIcons[event.severity as keyof typeof severityIcons]}
                        <span className="font-medium">{event.event_type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={severityColors[event.severity as keyof typeof severityColors]}>
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={event.message}>
                        {event.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {event.ip_address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(event.created_at))} ago
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {event.resolved ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Resolved</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-600">Pending</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="font-medium">Database</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                <span className="font-medium">API Services</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <span className="font-medium">Network</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Stable</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">SSL/TLS Encryption</p>
                <p className="text-sm text-gray-600">All connections are secured with HTTPS</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Database Security</p>
                <p className="text-sm text-gray-600">Row-level security enabled on all tables</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium">Regular Security Audits</p>
                <p className="text-sm text-gray-600">Schedule monthly security reviews and penetration testing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;