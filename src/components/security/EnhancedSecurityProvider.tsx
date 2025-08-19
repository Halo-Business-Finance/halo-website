import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  created_at: string;
  event_data: any;
  risk_score: number;
}

interface SecurityContextType {
  securityScore: number;
  criticalEvents: SecurityEvent[];
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  acknowledgeEvent: (eventId: string) => Promise<void>;
  performSecurityCheck: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const EnhancedSecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [securityScore, setSecurityScore] = useState(100);
  const [criticalEvents, setCriticalEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      startMonitoring();
      performSecurityCheck();
    }
    
    return () => {
      stopMonitoring();
    };
  }, [user, isAdmin]);

  const startMonitoring = () => {
    if (!isAdmin) return;
    
    setIsMonitoring(true);
    
    // Set up real-time subscription for critical security events
    const channel = supabase
      .channel('security-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events',
          filter: 'severity=in.(critical,high)'
        },
        (payload) => {
          const newEvent = payload.new as SecurityEvent;
          setCriticalEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10
          updateSecurityScore([newEvent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const performSecurityCheck = async () => {
    if (!isAdmin) return;

    try {
      // Fetch recent critical events
      const { data: events, error } = await supabase
        .from('security_events')
        .select('*')
        .in('severity', ['critical', 'high'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setCriticalEvents(events || []);
      updateSecurityScore(events || []);

      // Run automated security maintenance
      await supabase.rpc('automated_security_maintenance');

    } catch (error) {
      console.error('Security check failed:', error);
    }
  };

  const updateSecurityScore = (events: SecurityEvent[]) => {
    let score = 100;
    
    events.forEach(event => {
      const penalty = event.severity === 'critical' ? 20 : 10;
      const age = new Date().getTime() - new Date(event.created_at).getTime();
      const ageHours = age / (1000 * 60 * 60);
      
      // Reduce penalty for older events
      const adjustedPenalty = ageHours > 24 ? penalty * 0.5 : penalty;
      score -= adjustedPenalty;
    });

    setSecurityScore(Math.max(0, Math.min(100, score)));
  };

  const acknowledgeEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('security_events')
        .update({ 
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id 
        })
        .eq('id', eventId);

      if (error) throw error;

      setCriticalEvents(prev => prev.filter(event => event.id !== eventId));
      
    } catch (error) {
      console.error('Failed to acknowledge security event:', error);
    }
  };

  return (
    <SecurityContext.Provider value={{
      securityScore,
      criticalEvents,
      isMonitoring,
      startMonitoring,
      stopMonitoring,
      acknowledgeEvent,
      performSecurityCheck
    }}>
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