import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { secureLogger } from '@/utils/secureLogger';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  event_data: any;
  created_at: string;
}

interface AutomatedResponse {
  eventType: string;
  conditions: (event: SecurityEvent) => boolean;
  action: (event: SecurityEvent) => Promise<void>;
  description: string;
}

export const AutomatedSecurityResponse = () => {
  const [isActive, setIsActive] = useState(true);
  const [processedEvents, setProcessedEvents] = useState(new Set<string>());

  // Define automated response rules
  const responses: AutomatedResponse[] = [
    {
      eventType: 'brute_force_attempt',
      conditions: (event) => 
        event.severity === 'critical' && 
        event.event_type === 'session_anomaly_detected' &&
        event.event_data?.score > 80,
      action: async (event) => {
        secureLogger.securityEvent('automated_session_termination', { eventId: event.id });
        await supabase.rpc('invalidate_suspicious_sessions', {
          target_user_id: event.user_id,
          reason: 'Automated response: Critical session anomaly'
        });
        toast.error('Suspicious session terminated automatically');
      },
      description: 'Terminate sessions with critical anomaly scores'
    },
    {
      eventType: 'multiple_failed_auth',
      conditions: (event) => 
        event.event_type === 'enhanced_rate_limit_check' &&
        event.event_data?.is_blocked === true &&
        event.event_data?.attempts_count > 10,
      action: async (event) => {
        secureLogger.securityEvent('automated_ip_block', { 
          eventId: event.id, 
          ipAddress: event.ip_address 
        });
        
        // Log security event for IP blocking using optimized logger
        await supabase.functions.invoke('security-event-optimizer', {
          body: {
            event_type: 'ip_auto_blocked',
            severity: 'high',
            event_data: { 
              blocked_ip: event.ip_address,
              reason: 'Excessive rate limit violations',
              auto_response: true
            }
          }
        });
        
        toast.warning('Suspicious IP activity detected and logged');
      },
      description: 'Log and monitor IPs with excessive rate limit violations'
    },
    {
      eventType: 'admin_role_threat',
      conditions: (event) => 
        event.event_type === 'unauthorized_role_assignment_attempt' ||
        event.event_type === 'admin_role_assigned',
      action: async (event) => {
        secureLogger.securityEvent('admin_security_alert', { eventId: event.id });
        
        // Send immediate notification to all admins using optimized logger
        await supabase.functions.invoke('security-event-optimizer', {
          body: {
            event_type: 'admin_security_notification',
            severity: 'critical',
            event_data: {
              original_event: event.event_type,
              requires_review: true,
              auto_flagged: true
            }
          }
        });
        
        toast.error('Admin role security event flagged for immediate review');
      },
      description: 'Flag admin role security events for immediate review'
    },
    {
      eventType: 'data_access_anomaly',
      conditions: (event) => 
        event.event_type.includes('consultation') && 
        event.severity === 'high' &&
        event.event_data?.access_method !== 'secure_function',
      action: async (event) => {
        secureLogger.securityEvent('data_access_alert', { eventId: event.id });
        
        await supabase.functions.invoke('security-event-optimizer', {
          body: {
            event_type: 'suspicious_data_access',
            severity: 'high',
            event_data: {
              original_event: event.event_type,
              access_pattern: 'anomalous',
              auto_flagged: true
            }
          }
        });
        
        toast.warning('Unusual data access pattern detected and logged');
      },
      description: 'Monitor and log unusual data access patterns'
    }
  ];

  useEffect(() => {
    if (!isActive) return;

    // Set up real-time subscription for security events
    const subscription = supabase
      .channel('security_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events',
          filter: 'severity=in.(high,critical)'
        },
        async (payload) => {
          const event = payload.new as SecurityEvent;
          
          // Prevent duplicate processing
          if (processedEvents.has(event.id)) return;
          
          setProcessedEvents(prev => new Set([...prev, event.id]));
          
          // Process automated responses
          for (const response of responses) {
            try {
              if (response.conditions(event)) {
                secureLogger.info('Executing automated security response', {
                  responseType: response.eventType,
                  eventId: event.id
                });
                
                await response.action(event);
                
                // Log the automated response using optimized logger
                await supabase.functions.invoke('security-event-optimizer', {
                  body: {
                    event_type: 'automated_security_response',
                    severity: 'info',
                    event_data: {
                      response_type: response.eventType,
                      original_event_id: event.id,
                      description: response.description
                    }
                  }
                });
              }
            } catch (error) {
              secureLogger.error('Automated security response failed', {
                responseType: response.eventType,
                eventId: event.id,
                error
              });
            }
          }
        }
      )
      .subscribe();

    // Cleanup old processed events (keep last 1000)
    const cleanupInterval = setInterval(() => {
      setProcessedEvents(prev => {
        const array = Array.from(prev);
        if (array.length > 1000) {
          return new Set(array.slice(-1000));
        }
        return prev;
      });
    }, 300000); // Every 5 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, [isActive]);

  return null; // This is a background service component
};
