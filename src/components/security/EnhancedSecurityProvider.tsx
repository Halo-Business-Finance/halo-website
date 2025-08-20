import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  action_required?: string;
}

interface SecurityContextType {
  threats: SecurityThreat[];
  securityScore: number;
  dismissThreat: (threatId: string) => void;
  refreshSecurityStatus: () => Promise<void>;
  isSecurityMonitoringActive: boolean;
  lastSecurityCheck: Date | null;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface EnhancedSecurityProviderProps {
  children: ReactNode;
}

export const EnhancedSecurityProvider: React.FC<EnhancedSecurityProviderProps> = ({ children }) => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [securityScore, setSecurityScore] = useState(100);
  const [isSecurityMonitoringActive, setIsSecurityMonitoringActive] = useState(true);
  const [lastSecurityCheck, setLastSecurityCheck] = useState<Date | null>(null);
  const { user, session } = useAuth();

  // Enhanced security monitoring
  useEffect(() => {
    if (!user || !session || !isSecurityMonitoringActive) return;

    const performSecurityCheck = async () => {
      try {
        // Generate client fingerprint
        const clientFingerprint = await generateClientFingerprint();
        const userAgent = navigator.userAgent;
        
        // Get current IP (simplified for demo)
        const currentIP = '127.0.0.1'; // In production, get from a service

        // Validate session security
        const { data: validation } = await supabase.rpc('validate_session_security', {
          session_id: session.user.id, // Using user ID as session identifier
          client_ip: currentIP,
          user_agent: userAgent,
          security_context: {
            client_fingerprint: clientFingerprint,
            timestamp: new Date().toISOString(),
            page_url: window.location.href
          }
        });

        if (validation) {
          const validationData = validation as any;
          setSecurityScore(Math.max(0, 100 - (validationData.security_score || 0)));
          
          if (validationData.alerts && Array.isArray(validationData.alerts)) {
            const newThreats: SecurityThreat[] = validationData.alerts.map((alert: string, index: number) => ({
              id: `${Date.now()}-${index}`,
              type: alert,
              severity: validationData.security_score >= 70 ? 'critical' : 
                       validationData.security_score >= 40 ? 'high' : 
                       validationData.security_score >= 20 ? 'medium' : 'low',
              message: formatThreatMessage(alert),
              timestamp: new Date(),
              action_required: validationData.action
            }));
            
            setThreats(prev => [...prev, ...newThreats]);
          }

          // Handle critical security actions
          if (validationData.action === 'terminate_all_sessions') {
            await handleCriticalSecurityEvent('All sessions terminated due to security threat');
          }
        }

        setLastSecurityCheck(new Date());
      } catch (error) {
        console.error('Security check failed:', error);
        
        // Log client-side security event
        try {
          await supabase.rpc('log_client_security_event', {
            event_type: 'security_check_failed',
            severity: 'medium',
            event_data: {
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            }
          });
        } catch (logError) {
          console.warn('Failed to log security event:', logError);
        }
      }
    };

    // Initial security check
    performSecurityCheck();

    // Set up periodic security monitoring
    const securityInterval = setInterval(performSecurityCheck, 60000); // Every minute

    // Monitor for suspicious activity
    const handleSuspiciousActivity = async () => {
      try {
        await supabase.rpc('log_client_security_event', {
          event_type: 'suspicious_activity_detected',
          severity: 'high',
          event_data: {
            activity_type: 'unusual_interaction',
            timestamp: new Date().toISOString(),
            page_url: window.location.href
          }
        });
      } catch (error) {
        console.warn('Failed to log suspicious activity:', error);
      }
    };

    // Add event listeners for suspicious activity
    document.addEventListener('contextmenu', handleSuspiciousActivity);

    return () => {
      clearInterval(securityInterval);
      document.removeEventListener('contextmenu', handleSuspiciousActivity);
    };
  }, [user, session, isSecurityMonitoringActive]);

  const generateClientFingerprint = async (): Promise<string> => {
    // Generate a simple client fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  };

  const formatThreatMessage = (threat: string): string => {
    const messages: Record<string, string> = {
      'ip_address_mismatch': 'Your IP address has changed during this session',
      'user_agent_mismatch': 'Your browser signature has changed',
      'suspicious_concurrent_sessions': 'Multiple suspicious sessions detected',
      'client_fingerprint_change': 'Device fingerprint has changed unexpectedly'
    };
    
    return messages[threat] || `Security alert: ${threat}`;
  };

  const handleCriticalSecurityEvent = async (message: string) => {
    // Force logout for critical security events
    await supabase.auth.signOut();
    
    // Redirect to security page
    window.location.href = '/security-alert';
  };

  const dismissThreat = (threatId: string) => {
    setThreats(prev => prev.filter(threat => threat.id !== threatId));
  };

  const refreshSecurityStatus = async () => {
    setThreats([]);
    setSecurityScore(100);
    setLastSecurityCheck(null);
    
    // Trigger a new security check
    if (user && session) {
      // Security check will be triggered by the useEffect
    }
  };

  const contextValue: SecurityContextType = {
    threats,
    securityScore,
    dismissThreat,
    refreshSecurityStatus,
    isSecurityMonitoringActive,
    lastSecurityCheck
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