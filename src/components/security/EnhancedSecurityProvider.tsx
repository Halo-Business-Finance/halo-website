import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  recentEvents: number;
  blockedAttempts: number;
  riskScore: number;
  lastUpdated: Date;
}

interface SecurityContextType {
  metrics: SecurityMetrics;
  isSecurityEnabled: boolean;
  checkSecurityStatus: () => Promise<void>;
  reportSecurityEvent: (eventType: string, severity: string, data?: any) => Promise<void>;
  validateAccess: (resource: string, action: string) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const EnhancedSecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user, userRole } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 'low',
    recentEvents: 0,
    blockedAttempts: 0,
    riskScore: 0,
    lastUpdated: new Date()
  });
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      checkSecurityStatus();
      // Set up periodic security checks
      const interval = setInterval(checkSecurityStatus, 300000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkSecurityStatus = async () => {
    try {
      // Check recent security events for this user
      const { data: events, error } = await supabase
        .from('security_events')
        .select('severity, created_at')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch security events:', error);
        return;
      }

      const recentEvents = events?.length || 0;
      const criticalEvents = events?.filter(e => e.severity === 'critical').length || 0;
      const highEvents = events?.filter(e => e.severity === 'high').length || 0;

      // Calculate threat level and risk score
      let threatLevel: SecurityMetrics['threatLevel'] = 'low';
      let riskScore = 0;

      if (criticalEvents > 0) {
        threatLevel = 'critical';
        riskScore = 90 + Math.min(criticalEvents * 5, 10);
      } else if (highEvents > 2) {
        threatLevel = 'high';
        riskScore = 70 + Math.min(highEvents * 3, 20);
      } else if (recentEvents > 10) {
        threatLevel = 'medium';
        riskScore = 40 + Math.min(recentEvents * 2, 30);
      } else {
        riskScore = Math.min(recentEvents * 5, 30);
      }

      setMetrics({
        threatLevel,
        recentEvents,
        blockedAttempts: events?.filter(e => e.severity === 'high' && 
          JSON.stringify(e).includes('blocked')).length || 0,
        riskScore,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Security status check failed:', error);
    }
  };

  const reportSecurityEvent = async (eventType: string, severity: string, data?: any) => {
    try {
      await supabase.rpc('log_client_security_event', {
        event_type: eventType,
        severity,
        event_data: data || {},
        source: 'enhanced_security_provider'
      });

      // Refresh security metrics after reporting
      setTimeout(checkSecurityStatus, 1000);
    } catch (error) {
      console.error('Failed to report security event:', error);
    }
  };

  const validateAccess = async (resource: string, action: string): Promise<boolean> => {
    try {
      // Check rate limits
      const { data: rateLimitResult } = await supabase.rpc('advanced_rate_limit_check', {
        p_identifier: user?.id || 'anonymous',
        p_action: `${resource}_${action}`,
        p_limit: 100,
        p_window_seconds: 3600,
        p_behavioral_score: Math.max(100 - metrics.riskScore, 10)
      });

      if (!(rateLimitResult as any)?.allowed) {
        await reportSecurityEvent('access_denied_rate_limit', 'medium', {
          resource,
          action,
          reason: 'rate_limit_exceeded'
        });
        return false;
      }

      // Role-based access control
      const rolePermissions: Record<string, string[]> = {
        admin: ['read', 'write', 'delete', 'manage'],
        moderator: ['read', 'write'],
        user: ['read']
      };

      const allowedActions = rolePermissions[userRole || 'user'] || ['read'];
      if (!allowedActions.includes(action)) {
        await reportSecurityEvent('access_denied_insufficient_permissions', 'high', {
          resource,
          action,
          userRole,
          reason: 'insufficient_permissions'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Access validation failed:', error);
      return false;
    }
  };

  const contextValue: SecurityContextType = {
    metrics,
    isSecurityEnabled,
    checkSecurityStatus,
    reportSecurityEvent,
    validateAccess
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useEnhancedSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useEnhancedSecurity must be used within an EnhancedSecurityProvider');
  }
  return context;
};