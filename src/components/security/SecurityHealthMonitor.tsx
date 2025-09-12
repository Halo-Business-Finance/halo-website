import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { runSecurityCleanup, getSecurityHealth } from '@/utils/securityMaintenance';
import { useToast } from '@/hooks/use-toast';

export const SecurityHealthMonitor: React.FC = () => {
  const { health, metrics, isLoading, checkSecurityHealth } = useSecurityMonitor();
  const { toast } = useToast();
  const [cleanupRunning, setCleanupRunning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);

  const handleSecurityCleanup = async () => {
    setCleanupRunning(true);
    try {
      const result = await runSecurityCleanup();
      if (result.success) {
        toast({
          title: "Security Cleanup Complete",
          description: `Cleaned ${result.cleanedCount || 0} records`,
        });
        setLastCleanup(new Date());
        await checkSecurityHealth();
      } else {
        toast({
          title: "Cleanup Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Cleanup Error",
        description: "Failed to run security cleanup",
        variant: "destructive",
      });
    } finally {
      setCleanupRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Monitor
          </CardTitle>
          <CardDescription>
            Real-time security status and threat monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {health && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.status)}
                <span className="font-medium">System Health</span>
              </div>
              <Badge className={getStatusColor(health.status)}>
                {health.status.toUpperCase()}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Security Score</div>
              <div className="text-2xl font-bold text-primary">
                {health?.score || 0}/100
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Last Check</div>
              <div className="text-sm">
                {health?.lastChecked 
                  ? new Date(health.lastChecked).toLocaleTimeString()
                  : 'Never'
                }
              </div>
            </div>
          </div>

          {health?.issues && health.issues.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {health.issues.length} security {health.issues.length === 1 ? 'issue' : 'issues'} detected
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.encryptionKeysActive || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Keys</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(metrics?.criticalEvents24h || 0) + (metrics?.failedLogins24h || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {metrics?.criticalEvents24h || 0}
              </div>
              <div className="text-sm text-muted-foreground">Critical Events</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {metrics?.failedLogins24h || 0}
              </div>
              <div className="text-sm text-muted-foreground">Failed Logins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Security Event Cleanup</div>
              <div className="text-sm text-muted-foreground">
                Remove old security events and optimize database
              </div>
            </div>
            <Button 
              onClick={handleSecurityCleanup}
              disabled={cleanupRunning}
              variant="outline"
            >
              {cleanupRunning ? 'Running...' : 'Run Cleanup'}
            </Button>
          </div>

          {lastCleanup && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last cleanup: {lastCleanup.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};