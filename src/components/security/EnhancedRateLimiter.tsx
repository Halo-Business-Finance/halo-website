import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';

interface RateLimitContextType {
  checkRateLimit: (action: string, customLimit?: number) => Promise<boolean>;
  getRateLimitStatus: (action: string) => RateLimitStatus | null;
  getBehavioralScore: () => number;
}

interface RateLimitStatus {
  allowed: boolean;
  attempts_count: number;
  limit: number;
  utilization_percentage: number;
  reset_time: number;
  behavioral_score: number;
}

interface BehavioralProfile {
  trustScore: number;
  sessionDuration: number;
  actionPattern: string[];
  lastActivity: number;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

export const EnhancedRateLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [rateLimitStatuses, setRateLimitStatuses] = useState<Map<string, RateLimitStatus>>(new Map());
  const [behavioralProfile, setBehavioralProfile] = useState<BehavioralProfile>({
    trustScore: 50,
    sessionDuration: 0,
    actionPattern: [],
    lastActivity: Date.now()
  });

  const sessionStartTime = React.useRef(Date.now());

  useEffect(() => {
    // Track behavioral patterns
    const trackBehavior = () => {
      const updateBehavioralScore = () => {
        const now = Date.now();
        const sessionDuration = now - sessionStartTime.current;
        const timeSinceLastActivity = now - behavioralProfile.lastActivity;
        
        let newTrustScore = behavioralProfile.trustScore;
        
        // Increase trust for longer sessions
        if (sessionDuration > 300000) newTrustScore += 5; // 5+ minutes
        if (sessionDuration > 900000) newTrustScore += 10; // 15+ minutes
        
        // Decrease trust for suspicious patterns
        if (timeSinceLastActivity < 100) newTrustScore -= 5; // Very rapid actions
        
        // Pattern analysis - detect automated behavior
        const recentActions = behavioralProfile.actionPattern.slice(-10);
        const avgInterval = recentActions.length > 1 ? 
          recentActions.reduce((acc, curr, idx) => 
            idx === 0 ? 0 : acc + (parseInt(curr) - parseInt(recentActions[idx-1])), 0
          ) / (recentActions.length - 1) : 0;
        
        if (avgInterval < 50 && recentActions.length >= 5) {
          newTrustScore -= 20; // Likely automated
        }
        
        // Normalize score
        newTrustScore = Math.max(0, Math.min(100, newTrustScore));
        
        setBehavioralProfile(prev => ({
          ...prev,
          trustScore: newTrustScore,
          sessionDuration,
          lastActivity: now
        }));
      };

      const handleUserActivity = () => {
        const now = Date.now();
        setBehavioralProfile(prev => ({
          ...prev,
          actionPattern: [...prev.actionPattern.slice(-9), now.toString()],
          lastActivity: now
        }));
        
        updateBehavioralScore();
      };

      // Track various user interactions
      const events = ['click', 'keydown', 'scroll', 'mousemove'];
      const throttledHandler = throttle(handleUserActivity, 1000);
      
      events.forEach(event => {
        document.addEventListener(event, throttledHandler);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, throttledHandler);
        });
      };
    };

    const cleanup = trackBehavior();
    return cleanup;
  }, [behavioralProfile.lastActivity]);

  const checkRateLimit = async (action: string, customLimit?: number): Promise<boolean> => {
    try {
      const identifier = user?.id || `anonymous_${getClientId()}`;
      const limit = customLimit || getDefaultLimit(action);
      
      // Use the new advanced rate limiting function with enhanced security
      const { data, error } = await supabase.rpc('advanced_rate_limit_check', {
        p_identifier: identifier,
        p_action: action,
        p_limit: limit,
        p_window_seconds: 3600, // 1 hour window
        p_behavioral_score: Math.round(behavioralProfile.trustScore)
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return false; // Fail closed
      }

      const rateLimitData = data as any;
      const status: RateLimitStatus = {
        allowed: rateLimitData.allowed,
        attempts_count: rateLimitData.attempts_count,
        limit: rateLimitData.limit,
        utilization_percentage: rateLimitData.utilization_percentage,
        reset_time: rateLimitData.reset_time,
        behavioral_score: rateLimitData.behavioral_score
      };

      // Update local status
      setRateLimitStatuses(prev => new Map(prev).set(action, status));

      // Show user feedback for rate limiting
      if (!rateLimitData.allowed) {
        toast.error(`Rate limit exceeded for ${action}. Please try again later.`);
        
        // Log client-side rate limit hit
        await supabase.rpc('log_client_security_event', {
          event_type: 'rate_limit_exceeded_client',
          severity: 'medium',
          event_data: {
            action,
            attempts_count: rateLimitData.attempts_count,
            limit: rateLimitData.limit,
            behavioral_score: rateLimitData.behavioral_score
          },
          source: 'client_rate_limiter'
        });
      } else if (rateLimitData.utilization_percentage > 80) {
        // Warn when approaching limit
        toast.warning(`Approaching rate limit for ${action} (${rateLimitData.utilization_percentage}% used)`);
      }

      return rateLimitData.allowed;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false; // Fail closed
    }
  };

  const getRateLimitStatus = (action: string): RateLimitStatus | null => {
    return rateLimitStatuses.get(action) || null;
  };

  const getBehavioralScore = (): number => {
    return behavioralProfile.trustScore;
  };

  const value: RateLimitContextType = {
    checkRateLimit,
    getRateLimitStatus,
    getBehavioralScore
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = (): RateLimitContextType => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within an EnhancedRateLimitProvider');
  }
  return context;
};

// Helper functions
function getDefaultLimit(action: string): number {
  const limits: Record<string, number> = {
    'login_attempt': 5,
    'consultation_submit': 3,
    'password_reset': 2,
    'api_call': 100,
    'form_submit': 10,
    'search_query': 50,
    'data_export': 1,
    'admin_action': 20
  };
  
  return limits[action] || 10; // Default limit
}

function getClientId(): string {
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Higher-order component for rate-limited actions
export function withRateLimit<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  action: string,
  limit?: number
) {
  return React.forwardRef<any, T>((props, ref) => {
    const { checkRateLimit } = useRateLimit();
    
    const rateLimitedProps = {
      ...props,
      onSubmit: props.onSubmit ? async (e: any) => {
        const allowed = await checkRateLimit(action, limit);
        if (allowed && props.onSubmit) {
          props.onSubmit(e);
        } else if (!allowed) {
          e.preventDefault();
        }
      } : props.onSubmit,
      onClick: props.onClick ? async (e: any) => {
        const allowed = await checkRateLimit(action, limit);
        if (allowed && props.onClick) {
          props.onClick(e);
        } else if (!allowed) {
          e.preventDefault();
        }
      } : props.onClick
    } as T;
    
    return <Component ref={ref} {...rateLimitedProps} />;
  });
}