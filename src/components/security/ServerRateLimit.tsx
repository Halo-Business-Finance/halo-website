import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServerRateLimitConfig {
  endpoint: string;
  identifier?: string;
  action?: string;
}

interface RateLimitResponse {
  allowed: boolean;
  attempts: number;
  maxAttempts: number;
  resetTime: string | null;
  blockDuration: number | null;
  message: string;
}

export const useServerRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);
  const [lastResponse, setLastResponse] = useState<RateLimitResponse | null>(null);

  const checkRateLimit = useCallback(async (config: ServerRateLimitConfig): Promise<boolean> => {
    try {
      // Use user ID as identifier if available, otherwise fall back to IP-based limiting
      const { data: { user } } = await supabase.auth.getUser();
      const identifier = config.identifier || user?.id || 'anonymous';

      const response = await supabase.functions.invoke('enhanced-rate-limit', {
        body: {
          endpoint: config.endpoint,
          identifier,
          action: config.action || 'access'
        }
      });

      if (response.error) {
        console.error('Rate limit check failed:', response.error);
        // Fail open - allow the request if rate limiting is unavailable
        return true;
      }

      const rateLimitData = response.data as RateLimitResponse;
      setLastResponse(rateLimitData);

      if (!rateLimitData.allowed) {
        setIsBlocked(true);
        if (rateLimitData.blockDuration) {
          setBlockUntil(new Date(Date.now() + (rateLimitData.blockDuration * 1000)));
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow the request if there's an error
      return true;
    }
  }, []);

  const resetBlock = useCallback(() => {
    setIsBlocked(false);
    setBlockUntil(null);
    setLastResponse(null);
  }, []);

  const isCurrentlyBlocked = useCallback(() => {
    if (!isBlocked || !blockUntil) return false;
    
    const now = new Date();
    if (now >= blockUntil) {
      resetBlock();
      return false;
    }
    
    return true;
  }, [isBlocked, blockUntil, resetBlock]);

  const getTimeUntilReset = useCallback(() => {
    if (!blockUntil) return 0;
    
    const now = new Date();
    const diff = blockUntil.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 1000));
  }, [blockUntil]);

  return {
    checkRateLimit,
    isBlocked: isCurrentlyBlocked(),
    resetBlock,
    lastResponse,
    timeUntilReset: getTimeUntilReset(),
    blockUntil
  };
};