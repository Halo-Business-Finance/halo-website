import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  event_data: any;
  ip_address?: unknown;
  resolved_at?: string;
  resolved_by?: string;
  risk_score?: number;
  session_id?: string;
  source?: string;
  user_agent?: string;
  user_id?: string;
}

interface SecurityMonitoringContextType {
  securityEvents: SecurityEvent[];
  securityScore: number;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  acknowledgeEvent: (eventId: string) => void;
}

const SecurityMonitoringContext = createContext<SecurityMonitoringContextType | undefined>(undefined);

interface SecurityMonitoringProps {
  children: React.ReactNode;
  monitoringInterval?: number; // in milliseconds
}

export const SecurityMonitoringProvider: React.FC<SecurityMonitoringProps> = ({
  children,
  monitoringInterval = 120000, // Optimized: 2 minutes default (reduced from 30 seconds)
}) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState<number>(100);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringTimer, setMonitoringTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const calculateSecurityScore = (events: SecurityEvent[]): number => {
    const recentEvents = events.filter(
      event => Date.now() - new Date(event.created_at).getTime() < 24 * 60 * 60 * 1000
    );

    let score = 100;
    
    recentEvents.forEach(event => {
      switch (event.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
        default:
          score -= 1;
      }
    });

    return Math.max(0, Math.min(100, score));
  };

  const fetchSecurityEvents = async () => {
    try {
      // Optimized: Only fetch high/critical events to reduce load
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .in('severity', ['high', 'critical'])
        .order('created_at', { ascending: false })
        .limit(25); // Reduced limit

      if (error) {
        console.error('Error fetching security events:', error);
        return;
      }

      setSecurityEvents(data || []);
      setSecurityScore(calculateSecurityScore(data || []));

      // Check for critical events and alert
      const criticalEvents = (data || []).filter(
        event => event.severity === 'critical' && 
        Date.now() - new Date(event.created_at).getTime() < 5 * 60 * 1000 // last 5 minutes
      );

      if (criticalEvents.length > 0) {
        toast({
          title: "🚨 Critical Security Alert",
          description: `${criticalEvents.length} critical security event(s) detected in the last 5 minutes.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Failed to fetch security events:', error);
    }
  };

  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    fetchSecurityEvents(); // Initial fetch
    
    const timer = setInterval(fetchSecurityEvents, monitoringInterval);
    setMonitoringTimer(timer);
    
    console.log('[SECURITY] Real-time security monitoring started');
  };

  const stopMonitoring = () => {
    if (!isMonitoring) return;
    
    setIsMonitoring(false);
    
    if (monitoringTimer) {
      clearInterval(monitoringTimer);
      setMonitoringTimer(null);
    }
    
    console.log('[SECURITY] Real-time security monitoring stopped');
  };

  const acknowledgeEvent = async (eventId: string) => {
    try {
      // Mark event as acknowledged in database
      const { error } = await supabase
        .from('security_events')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', eventId);

      if (error) throw error;

      // Remove from local state
      setSecurityEvents(prev => prev.filter(event => event.id !== eventId));
      
      toast({
        title: "Event Acknowledged",
        description: "Security event has been marked as resolved.",
      });
    } catch (error) {
      console.error('Failed to acknowledge security event:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge security event.",
        variant: "destructive",
      });
    }
  };

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  // Set up real-time subscription for critical events
  useEffect(() => {
    const subscription = supabase
      .channel('security_events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'security_events',
        filter: 'severity=eq.critical'
      }, (payload) => {
        const newEvent = payload.new as SecurityEvent;
        
        // Add to events list
        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 49)]);
        
        // Show immediate alert for critical events
        toast({
          title: "🚨 CRITICAL SECURITY EVENT",
          description: `${newEvent.event_type} - Immediate attention required!`,
          variant: "destructive",
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const contextValue: SecurityMonitoringContextType = {
    securityEvents,
    securityScore,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    acknowledgeEvent,
  };

  return (
    <SecurityMonitoringContext.Provider value={contextValue}>
      {children}
    </SecurityMonitoringContext.Provider>
  );
};

export const useSecurityMonitoring = (): SecurityMonitoringContextType => {
  const context = useContext(SecurityMonitoringContext);
  if (!context) {
    throw new Error('useSecurityMonitoring must be used within a SecurityMonitoringProvider');
  }
  return context;
};