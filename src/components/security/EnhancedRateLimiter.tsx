import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  requests: number[];
  blockedUntil?: number;
}

interface RateLimitContextType {
  checkRateLimit: (identifier: string, config?: Partial<RateLimitConfig>) => boolean;
  isBlocked: (identifier: string) => boolean;
  getRemainingRequests: (identifier: string, config?: Partial<RateLimitConfig>) => number;
  resetRateLimit: (identifier: string) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  blockDurationMs: 300000, // 5 minutes
};

export const EnhancedRateLimiter: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rateLimitStates, setRateLimitStates] = useState<Map<string, RateLimitState>>(new Map());
  const { toast } = useToast();

  const checkRateLimit = useCallback((identifier: string, configOverride?: Partial<RateLimitConfig>): boolean => {
    const config = { ...DEFAULT_CONFIG, ...configOverride };
    const now = Date.now();
    
    setRateLimitStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(identifier) || { requests: [] };
      
      // Check if currently blocked
      if (state.blockedUntil && now < state.blockedUntil) {
        return newMap;
      }
      
      // Remove blocked status if expired
      if (state.blockedUntil && now >= state.blockedUntil) {
        state.blockedUntil = undefined;
      }
      
      // Filter out old requests outside the window
      const windowStart = now - config.windowMs;
      state.requests = state.requests.filter(timestamp => timestamp > windowStart);
      
      // Check if adding this request would exceed the limit
      if (state.requests.length >= config.maxRequests) {
        // Block the identifier
        state.blockedUntil = now + config.blockDurationMs;
        newMap.set(identifier, state);
        
        // Show user-friendly message
        toast({
          title: "Rate limit exceeded",
          description: "Please wait before trying again.",
          variant: "destructive",
        });
        
        return newMap;
      }
      
      // Add the current request
      state.requests.push(now);
      newMap.set(identifier, state);
      
      return newMap;
    });
    
    const currentState = rateLimitStates.get(identifier);
    return !currentState?.blockedUntil || now >= currentState.blockedUntil;
  }, [rateLimitStates, toast]);

  const isBlocked = useCallback((identifier: string): boolean => {
    const state = rateLimitStates.get(identifier);
    if (!state?.blockedUntil) return false;
    return Date.now() < state.blockedUntil;
  }, [rateLimitStates]);

  const getRemainingRequests = useCallback((identifier: string, configOverride?: Partial<RateLimitConfig>): number => {
    const config = { ...DEFAULT_CONFIG, ...configOverride };
    const state = rateLimitStates.get(identifier);
    if (!state) return config.maxRequests;
    
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const recentRequests = state.requests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, config.maxRequests - recentRequests.length);
  }, [rateLimitStates]);

  const resetRateLimit = useCallback((identifier: string): void => {
    setRateLimitStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(identifier);
      return newMap;
    });
  }, []);

  const contextValue: RateLimitContextType = {
    checkRateLimit,
    isBlocked,
    getRemainingRequests,
    resetRateLimit,
  };

  return (
    <RateLimitContext.Provider value={contextValue}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = (): RateLimitContextType => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within an EnhancedRateLimiter');
  }
  return context;
};

/**
 * Hook for form-specific rate limiting
 */
export const useFormRateLimit = (formType: string) => {
  const { checkRateLimit, isBlocked, getRemainingRequests } = useRateLimit();
  
  const checkFormSubmission = useCallback(() => {
    return checkRateLimit(`form:${formType}`, {
      maxRequests: 5, // 5 submissions per minute for forms
      windowMs: 60000,
      blockDurationMs: 180000, // 3 minute block
    });
  }, [checkRateLimit, formType]);
  
  const isFormBlocked = useCallback(() => {
    return isBlocked(`form:${formType}`);
  }, [isBlocked, formType]);
  
  const remainingSubmissions = useCallback(() => {
    return getRemainingRequests(`form:${formType}`, {
      maxRequests: 5,
      windowMs: 60000,
    });
  }, [getRemainingRequests, formType]);
  
  return {
    checkFormSubmission,
    isFormBlocked,
    remainingSubmissions,
  };
};