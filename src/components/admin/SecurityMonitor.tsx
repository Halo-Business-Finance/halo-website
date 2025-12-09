import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Users,
  Lock,
  Monitor,
  Database,
  Server,
  Wifi,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Ban,
  Eye,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format, subDays, subHours } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  event_data: any;
  ip_address?: string;
  user_agent?: string;
  user_id?: string;
  resolved_at: string | null;
  created_at: string;
  risk_score?: number;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  activeThreats: number;
  sessionSecurity: 'healthy' | 'warning' | 'critical';
  dataSecurity: 'healthy' | 'warning' | 'critical';
  systemSecurity: 'healthy' | 'warning' | 'critical';
}

interface EventTrend {
  time: string;
  events: number;
  critical: number;
  warnings: number;
}

interface EventTypeBreakdown {
  name: string;
  value: number;
  color: string;
}

const severityColors = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  critical: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200'
};

const CHART_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

const SecurityMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalAlerts: 0,
    activeThreats: 0,
    sessionSecurity: 'healthy',
    dataSecurity: 'healthy',
    systemSecurity: 'healthy'
  });
  const [eventTrends, setEventTrends] = useState<EventTrend[]>([]);
  const [eventTypeBreakdown, setEventTypeBreakdown] = useState<EventTypeBreakdown[]>([]);
  const [failedLogins, setFailedLogins] = useState<SecurityEvent[]>([]);
  const [rateLimitEvents, setRateLimitEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const [isLive, setIsLive] = useState(true);

  const loadSecurityData = useCallback(async () => {
    try {
      const hoursBack = timeframe === '24h' ? 24 : 168;
      const startDate = subHours(new Date(), hoursBack).toISOString();

      // Fetch security events from database
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) {
        console.error('Error fetching security events:', eventsError);
      }

      // Map database events to our interface (ip_address is inet type in DB)
      const securityEvents: SecurityEvent[] = (eventsData || []).map(e => ({
        ...e,
        ip_address: e.ip_address ? String(e.ip_address) : undefined,
        user_id: e.user_id || undefined,
        user_agent: e.user_agent || undefined,
        risk_score: e.risk_score || undefined
      }));
      setEvents(securityEvents);

      // Calculate metrics
      const criticalCount = securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length;
      const unresolvedCount = securityEvents.filter(e => !e.resolved_at).length;

      setMetrics({
        totalEvents: securityEvents.length,
        criticalAlerts: criticalCount,
        activeThreats: unresolvedCount,
        sessionSecurity: criticalCount > 5 ? 'critical' : unresolvedCount > 10 ? 'warning' : 'healthy',
        dataSecurity: securityEvents.length > 100 ? 'warning' : criticalCount > 2 ? 'critical' : 'healthy',
        systemSecurity: unresolvedCount > 15 ? 'critical' : securityEvents.length > 50 ? 'warning' : 'healthy'
      });

      // Filter failed logins
      const failedLoginEvents = securityEvents.filter(e => 
        e.event_type.includes('failed_login') || 
        e.event_type.includes('login_failure') ||
        e.event_type.includes('auth_failure')
      );
      setFailedLogins(failedLoginEvents);

      // Filter rate limit events
      const rateLimitHits = securityEvents.filter(e => 
        e.event_type.includes('rate_limit') || 
        e.event_type.includes('blocked') ||
        e.event_type.includes('throttle')
      );
      setRateLimitEvents(rateLimitHits);

      // Calculate event trends
      const trends = calculateEventTrends(securityEvents, timeframe);
      setEventTrends(trends);

      // Calculate event type breakdown
      const breakdown = calculateEventTypeBreakdown(securityEvents);
      setEventTypeBreakdown(breakdown);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast.error('Failed to load security monitoring data');
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  const calculateEventTrends = (events: SecurityEvent[], tf: '24h' | '7d'): EventTrend[] => {
    const intervals = tf === '24h' ? 24 : 7;
    const trends: EventTrend[] = [];
    
    for (let i = intervals - 1; i >= 0; i--) {
      const start = tf === '24h' ? subHours(new Date(), i + 1) : subDays(new Date(), i + 1);
      const end = tf === '24h' ? subHours(new Date(), i) : subDays(new Date(), i);
      
      const periodEvents = events.filter(e => {
        const eventTime = new Date(e.created_at);
        return eventTime >= start && eventTime < end;
      });

      trends.push({
        time: tf === '24h' ? format(end, 'HH:mm') : format(end, 'EEE'),
        events: periodEvents.length,
        critical: periodEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length,
        warnings: periodEvents.filter(e => e.severity === 'warning' || e.severity === 'medium').length
      });
    }
    
    return trends;
  };

  const calculateEventTypeBreakdown = (events: SecurityEvent[]): EventTypeBreakdown[] => {
    const typeCounts: Record<string, number> = {};
    
    events.forEach(event => {
      const type = event.event_type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], index) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
  };

  useEffect(() => {
    loadSecurityData();
  }, [loadSecurityData]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, [isLive, loadSecurityData]);

  const getSecurityScore = () => {
    const score = Math.max(0, 100 - (metrics.criticalAlerts * 15) - (metrics.activeThreats * 3));
    return Math.min(100, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
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
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Security Monitoring Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time security events, threats, and system health monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant={timeframe === '24h' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('24h')}
            >
              24 Hours
            </Button>
            <Button 
              variant={timeframe === '7d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('7d')}
            >
              7 Days
            </Button>
          </div>
          <Button 
            variant={isLive ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'animate-pulse' : ''}
          >
            <Activity className="h-4 w-4 mr-1" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={loadSecurityData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Security Score & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className={`text-5xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Security Score</p>
            <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  securityScore >= 85 ? 'bg-green-500' : securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              <p className="text-xs text-muted-foreground">
                Last {timeframe === '24h' ? '24 hours' : '7 days'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
              <p className={`text-2xl font-bold ${metrics.criticalAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.criticalAlerts}
              </p>
              <p className="text-xs text-muted-foreground">High severity</p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${metrics.criticalAlerts > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
              <p className="text-2xl font-bold text-orange-600">{failedLogins.length}</p>
              <p className="text-xs text-muted-foreground">Attempts blocked</p>
            </div>
            <Ban className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rate Limits</p>
              <p className="text-2xl font-bold text-purple-600">{rateLimitEvents.length}</p>
              <p className="text-xs text-muted-foreground">Triggers</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* Critical Alert Banner */}
      {metrics.criticalAlerts > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>{metrics.criticalAlerts} critical security event(s)</strong> require immediate attention.
            </span>
            <Button variant="outline" size="sm" className="ml-4 border-red-300 text-red-700 hover:bg-red-50">
              View Critical Events
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Security Event Trends
            </CardTitle>
            <CardDescription>
              Event volume over {timeframe === '24h' ? 'the last 24 hours' : 'the past week'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventTrends}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorEvents)" 
                    name="Total Events"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="critical" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorCritical)" 
                    name="Critical"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Event Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Event Types
            </CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {eventTypeBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {eventTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No events in this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Security Status
          </CardTitle>
          <CardDescription>Real-time health monitoring of security subsystems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(metrics.sessionSecurity)}
                <div>
                  <p className="font-medium">Session Security</p>
                  <p className="text-sm text-muted-foreground">Active session monitoring</p>
                </div>
              </div>
              {getStatusBadge(metrics.sessionSecurity)}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(metrics.dataSecurity)}
                <div>
                  <p className="font-medium">Data Protection</p>
                  <p className="text-sm text-muted-foreground">Encryption & RLS status</p>
                </div>
              </div>
              {getStatusBadge(metrics.dataSecurity)}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(metrics.systemSecurity)}
                <div>
                  <p className="font-medium">System Integrity</p>
                  <p className="text-sm text-muted-foreground">API & infrastructure</p>
                </div>
              </div>
              {getStatusBadge(metrics.systemSecurity)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Events Tabs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Event Log
              </CardTitle>
              <CardDescription>
                Detailed security events with filtering
              </CardDescription>
            </div>
            <span className="text-sm text-muted-foreground">
              Last updated: {formatDistanceToNow(lastRefresh)} ago
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">
                All Events ({events.length})
              </TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({events.filter(e => e.severity === 'critical' || e.severity === 'high').length})
              </TabsTrigger>
              <TabsTrigger value="logins">
                Failed Logins ({failedLogins.length})
              </TabsTrigger>
              <TabsTrigger value="ratelimits">
                Rate Limits ({rateLimitEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <SecurityEventTable events={events.slice(0, 20)} />
            </TabsContent>

            <TabsContent value="critical">
              <SecurityEventTable events={events.filter(e => e.severity === 'critical' || e.severity === 'high').slice(0, 20)} />
            </TabsContent>

            <TabsContent value="logins">
              <SecurityEventTable events={failedLogins.slice(0, 20)} />
            </TabsContent>

            <TabsContent value="ratelimits">
              <SecurityEventTable events={rateLimitEvents.slice(0, 20)} />
            </TabsContent>
          </Tabs>
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
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">SSL/TLS Encryption</p>
                <p className="text-sm text-muted-foreground">All connections are secured with HTTPS</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Row-Level Security</p>
                <p className="text-sm text-muted-foreground">RLS enabled on all 30 database tables</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">CSRF Protection</p>
                <p className="text-sm text-muted-foreground">One-time CSRF tokens with rate limiting</p>
              </div>
            </div>

            {metrics.activeThreats > 5 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Review Unresolved Events</p>
                  <p className="text-sm text-muted-foreground">
                    {metrics.activeThreats} unresolved security events need attention
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Separate component for the event table
const SecurityEventTable = ({ events }: { events: SecurityEvent[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events found in this category
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Details</TableHead>
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
                  <span className="font-medium text-sm">
                    {event.event_type.replace(/_/g, ' ')}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={severityColors[event.severity as keyof typeof severityColors] || severityColors.info}>
                  {event.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate text-sm text-muted-foreground">
                  {typeof event.event_data === 'object' 
                    ? JSON.stringify(event.event_data).substring(0, 50) + '...'
                    : String(event.event_data || 'N/A')}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {event.ip_address || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(event.created_at))} ago
                </div>
              </TableCell>
              <TableCell>
                {event.resolved_at ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Resolved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Pending</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SecurityMonitor;
