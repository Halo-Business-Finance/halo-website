import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityLoggerContextType {
  logSecurityEvent: (eventType: string, severity: string, eventData?: any, source?: string) => Promise<void>;
  logPIIAccess: (resourceType: string, resourceId: string, accessType: string) => Promise<void>;
  logAdminAction: (action: string, targetResource: string, details?: any) => Promise<void>;
}

const SecurityLoggerContext = createContext<SecurityLoggerContextType | null>(null);

interface EnhancedSecurityLoggerProps {
  children: ReactNode;
}

export const EnhancedSecurityLogger = ({ children }: EnhancedSecurityLoggerProps) => {
  const logSecurityEvent = async (
    eventType: string, 
    severity: string, 
    eventData: any = {}, 
    source: string = 'client'
  ) => {
    try {
      // Use intelligent filtering before logging
      const { data: shouldLog } = await supabase.rpc('intelligent_security_event_filter', {
        p_event_type: eventType,
        p_severity: severity,
        p_source: source,
        p_ip_address: null // Will be determined server-side
      });

      if (!shouldLog) {
        return; // Event was filtered out
      }

      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: eventType,
          severity,
          event_data: {
            ...eventData,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href,
            filtered: false
          },
          source
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw - logging should never break app functionality
    }
  };

  const logPIIAccess = async (resourceType: string, resourceId: string, accessType: string) => {
    await logSecurityEvent(
      'pii_data_accessed',
      'medium',
      {
        resource_type: resourceType,
        resource_id: resourceId,
        access_type: accessType,
        requires_audit: true
      },
      'pii_access_monitor'
    );
  };

  const logAdminAction = async (action: string, targetResource: string, details: any = {}) => {
    await logSecurityEvent(
      'admin_action_performed',
      'high',
      {
        admin_action: action,
        target_resource: targetResource,
        action_details: details,
        requires_audit: true,
        elevated_privileges: true
      },
      'admin_activity_monitor'
    );
  };

  const contextValue = {
    logSecurityEvent,
    logPIIAccess,
    logAdminAction
  };

  return (
    <SecurityLoggerContext.Provider value={contextValue}>
      {children}
    </SecurityLoggerContext.Provider>
  );
};

export const useSecurityLogger = () => {
  const context = useContext(SecurityLoggerContext);
  if (!context) {
    throw new Error('useSecurityLogger must be used within EnhancedSecurityLogger');
  }
  return context;
};