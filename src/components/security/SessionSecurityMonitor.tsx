import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useSession } from './SessionManager';
import { supabase } from '@/integrations/supabase/client';

interface SecurityThreat {
  type: 'session_anomaly' | 'multiple_sessions' | 'ip_change' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
}

export const SessionSecurityMonitor: React.FC = () => {
  const { session, destroySession, createSession } = useSession();
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!session || !isMonitoring) return;

    const monitorInterval = setInterval(async () => {
      await checkSessionSecurity();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(monitorInterval);
  }, [session, isMonitoring]);

  const checkSessionSecurity = async () => {
    if (!session) return;

    try {
      // Check for session anomalies using Supabase function
      const { data, error } = await supabase.functions.invoke('detect-session-anomaly', {
        body: {
          sessionId: session.sessionId,
          newIp: await getCurrentIP(),
          newUserAgent: navigator.userAgent,
          newFingerprint: generateClientFingerprint()
        }
      });

      if (error) {
        console.error('Session security check failed:', error);
        return;
      }

      if (data && data.anomaly_detected) {
        const threat: SecurityThreat = {
          type: 'session_anomaly',
          severity: data.risk_level,
          message: `Session anomaly detected: ${data.anomalies.join(', ')}`,
          timestamp: Date.now()
        };

        setThreats(prev => [threat, ...prev.slice(0, 4)]); // Keep last 5 threats

        // Auto-terminate session if critical
        if (data.risk_level === 'critical') {
          await handleCriticalThreat();
        }
      }
    } catch (error) {
      console.error('Session monitoring error:', error);
    }
  };

  const getCurrentIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const generateClientFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + screen.height + 
      (canvas.toDataURL() || '')
    ).substring(0, 32);
  };

  const handleCriticalThreat = async () => {
    // Log security event
    await supabase.functions.invoke('log-client-security-event', {
      body: {
        event_type: 'critical_session_threat_detected',
        severity: 'critical',
        event_data: {
          session_id: session?.sessionId,
          threats: threats.map(t => t.type),
          auto_terminated: true
        }
      }
    });

    // Destroy current session
    destroySession();
    
    // Force re-authentication
    window.location.href = '/auth?reason=security';
  };

  const dismissThreat = (index: number) => {
    setThreats(prev => prev.filter((_, i) => i !== index));
  };

  const refreshSession = () => {
    if (session?.userId) {
      destroySession();
      createSession(session.userId);
      setThreats([]);
    }
  };

  if (threats.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {threats.map((threat, index) => (
        <Alert 
          key={`${threat.timestamp}-${index}`}
          variant={threat.severity === 'critical' || threat.severity === 'high' ? 'destructive' : 'default'}
          className="shadow-lg"
        >
          {threat.severity === 'critical' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          <AlertDescription className="pr-8">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Security Alert ({threat.severity.toUpperCase()})
              </p>
              <p className="text-xs">{threat.message}</p>
              <div className="flex gap-2">
                {threat.severity !== 'critical' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshSession}
                    className="h-6 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh Session
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissThreat(index)}
                  className="h-6 text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};