import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, X, CheckCircle } from 'lucide-react';
import { useEnhancedSecurity } from './EnhancedSecurityProvider';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  message: string;
  timestamp: string;
  autoResolve?: boolean;
  actionRequired?: boolean;
}

export const SecurityAlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { criticalEvents, acknowledgeEvent, securityScore } = useEnhancedSecurity();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;

    // Convert security events to alerts
    const newAlerts: SecurityAlert[] = criticalEvents
      .filter(event => !dismissed.has(event.id))
      .map(event => ({
        id: event.id,
        type: event.severity as 'critical' | 'high' | 'medium' | 'info',
        title: getAlertTitle(event.event_type),
        message: getAlertMessage(event.event_type, event.event_data),
        timestamp: event.created_at,
        actionRequired: event.severity === 'critical',
        autoResolve: event.severity === 'info'
      }));

    // Add system security score alert if low
    if (securityScore < 70 && !dismissed.has('low-security-score')) {
      newAlerts.push({
        id: 'low-security-score',
        type: securityScore < 50 ? 'critical' : 'high',
        title: 'Security Score Alert',
        message: `Current security score: ${securityScore}/100. Immediate attention required.`,
        timestamp: new Date().toISOString(),
        actionRequired: securityScore < 50
      });
    }

    setAlerts(newAlerts);

    // Auto-resolve info alerts after 10 seconds
    const autoResolveTimer = setTimeout(() => {
      newAlerts
        .filter(alert => alert.autoResolve)
        .forEach(alert => dismissAlert(alert.id));
    }, 10000);

    return () => clearTimeout(autoResolveTimer);
  }, [criticalEvents, securityScore, dismissed, isAdmin]);

  const dismissAlert = (alertId: string) => {
    setDismissed(prev => new Set([...prev, alertId]));
    if (alertId !== 'low-security-score') {
      acknowledgeEvent(alertId);
    }
  };

  const getAlertTitle = (eventType: string): string => {
    const titleMap: Record<string, string> = {
      'unauthorized_role_assignment_attempt': 'Unauthorized Role Assignment',
      'admin_lockout_prevention_triggered': 'Admin Lockout Prevention',
      'self_admin_assignment_flagged': 'Suspicious Self-Promotion',
      'session_anomaly_detected': 'Session Security Anomaly',
      'brute_force_attempt': 'Brute Force Attack Detected',
      'privilege_escalation_attempt': 'Privilege Escalation Attempt',
      'data_access_anomaly': 'Unusual Data Access Pattern'
    };
    return titleMap[eventType] || 'Security Event';
  };

  const getAlertMessage = (eventType: string, eventData: any): string => {
    const messageMap: Record<string, (data: any) => string> = {
      'unauthorized_role_assignment_attempt': (data) => 
        `User attempted to assign ${data.attempted_role} role without permission`,
      'admin_lockout_prevention_triggered': (data) => 
        `Admin role revocation blocked - would leave only ${data.remaining_admin_count} admins`,
      'self_admin_assignment_flagged': (data) => 
        `User attempted self-promotion to admin role - requires approval`,
      'session_anomaly_detected': (data) => 
        `Session anomaly detected: ${data.detected_anomalies?.join(', ') || 'Multiple indicators'}`,
      'brute_force_attempt': (data) => 
        `${data.attempt_count || 'Multiple'} failed authentication attempts detected`,
      'privilege_escalation_attempt': (data) => 
        `Suspicious privilege escalation activity detected`,
      'data_access_anomaly': (data) => 
        `Unusual data access pattern detected for sensitive information`
    };
    
    const messageFunc = messageMap[eventType];
    return messageFunc ? messageFunc(eventData) : 'Security event requires attention';
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!isAdmin || alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.slice(0, 5).map((alert) => (
        <Alert 
          key={alert.id} 
          variant={getAlertVariant(alert.type)}
          className="shadow-lg border-l-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTitle className="text-sm font-semibold">
                    {alert.title}
                  </AlertTitle>
                  <Badge 
                    variant={alert.type === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {alert.message}
                </AlertDescription>
                {alert.actionRequired && (
                  <div className="mt-2 text-xs font-medium text-destructive">
                    Immediate action required
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
      
      {alerts.length > 5 && (
        <Alert variant="default" className="shadow-lg">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            +{alerts.length - 5} more security alerts pending review
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};