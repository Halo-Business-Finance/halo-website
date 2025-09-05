import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Activity, 
  Lock,
  Zap,
  Eye
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface SecurityPattern {
  pattern_type: string;
  severity: string;
  event_count: number;
  affected_users: number;
  time_window: string;
  recommended_action: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  activeThreats: number;
  securityScore: number;
}

export const SecurityAnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, isModerator } = useAuth();
  const [patterns, setPatterns] = useState<SecurityPattern[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    activeThreats: 0,
    securityScore: 85
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!isAdmin && !isModerator) return;
    
    loadSecurityAnalytics();
    
    if (autoRefresh) {
      const interval = setInterval(loadSecurityAnalytics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAdmin, isModerator, autoRefresh]);

  const loadSecurityAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load security event patterns
      const { data: patternData, error: patternError } = await supabase
        .rpc('analyze_security_events');
      
      if (patternError) throw patternError;
      setPatterns(patternData || []);
      
      // Load general security metrics
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('severity, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (eventsError) throw eventsError;
      
      const totalEvents = eventsData?.length || 0;
      const criticalEvents = eventsData?.filter(e => e.severity === 'critical').length || 0;
      const activeThreats = patterns.filter(p => p.severity === 'critical').length;
      
      // Calculate security score based on recent events
      const securityScore = Math.max(0, 100 - (criticalEvents * 10) - (totalEvents * 0.5));
      
      setMetrics({
        totalEvents,
        criticalEvents,
        activeThreats,
        securityScore: Math.round(securityScore)
      });
      
    } catch (error) {
      console.error('Failed to load security analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSecurityValidation = async () => {
    try {
      const { data, error } = await supabase.rpc('validate_function_security');
      if (error) throw error;
      
      if (import.meta.env.DEV) {
        console.log('Security validation results:', data);
      }
      toast({
        title: "Security Validation Complete",
        description: "Check the security dashboard for detailed results.",
      });
    } catch (error) {
      console.error('Security validation failed:', error);
      toast({
        title: "Security Validation Failed",
        description: "Please check your authentication and try again.",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isAdmin && !isModerator) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access denied. This dashboard requires admin or moderator privileges.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat analysis</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto-refresh: {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerSecurityValidation}
          >
            <Shield className="h-4 w-4 mr-2" />
            Validate Security
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.securityScore)}`}>
              {metrics.securityScore}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Overall security health
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Security events logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeThreats}</div>
            <p className="text-xs text-muted-foreground">
              Ongoing security patterns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Detected Security Patterns
          </CardTitle>
          <CardDescription>
            Automated analysis of security events and threat patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : patterns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No security patterns detected. Your system appears secure.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <Alert key={index} variant={getSeverityColor(pattern.severity) as any}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(pattern.severity) as any}>
                            {pattern.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium capitalize">
                            {pattern.pattern_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{pattern.event_count}</span> events affecting{' '}
                          <span className="font-medium">{pattern.affected_users}</span> users
                          in the last <span className="font-medium">{pattern.time_window}</span>
                        </div>
                        <div className="text-sm font-medium text-primary">
                          Recommended Action: {pattern.recommended_action}
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Status */}
      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date().toLocaleTimeString()} | 
        Auto-refresh: {autoRefresh ? 'Active' : 'Paused'} | 
        Monitoring: Enhanced security analysis
      </div>
    </div>
  );
};