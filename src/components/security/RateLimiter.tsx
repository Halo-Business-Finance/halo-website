import { useState, useCallback, useEffect } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
  endpoint?: string;
}

interface RequestLog {
  timestamp: number;
  ip: string;
  endpoint: string;
  blocked: boolean;
}

interface RateLimitData {
  requests: RequestLog[];
  blockUntil: number;
  violations: number;
}

export const useAdvancedRateLimit = (config: RateLimitConfig) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const getClientIdentifier = () => {
    // In a real app, you'd get the actual IP from the server
    return `${navigator.userAgent}_${window.location.hostname}`;
  };

  const getStorageKey = (endpoint?: string) => {
    const clientId = getClientIdentifier();
    return `rate_limit_${clientId}_${endpoint || 'default'}`;
  };

  const getRateLimitData = (): RateLimitData => {
    const key = getStorageKey(config.endpoint);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return { requests: [], blockUntil: 0, violations: 0 };
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return { requests: [], blockUntil: 0, violations: 0 };
    }
  };

  const saveRateLimitData = (data: RateLimitData) => {
    const key = getStorageKey(config.endpoint);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    try {
      const now = Date.now();
      const data = getRateLimitData();
      
      // Check if currently blocked
      if (data.blockUntil > now) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((data.blockUntil - now) / 1000));
        
        // Show captcha for multiple violations
        if (data.violations >= 3) {
          setShowCaptcha(true);
        }
        
        return false;
      }

      // Clean old requests outside the window
      const windowStart = now - config.windowMs;
      const recentRequests = data.requests.filter(req => req.timestamp > windowStart);
      
      setRequestCount(recentRequests.length);

      // Check if limit exceeded
      if (recentRequests.length >= config.maxRequests) {
        const violations = data.violations + 1;
        const progressiveDelay = Math.min(
          config.blockDurationMs * Math.pow(2, violations - 1),
          config.blockDurationMs * 8 // Max 8x the base duration
        );
        
        const blockUntil = now + progressiveDelay;
        
        const newData: RateLimitData = {
          requests: recentRequests,
          blockUntil,
          violations
        };
        
        saveRateLimitData(newData);
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil(progressiveDelay / 1000));
        
        // Show captcha after 2 violations
        if (violations >= 2) {
          setShowCaptcha(true);
        }
        
        return false;
      }

      // Add current request
      const newRequest: RequestLog = {
        timestamp: now,
        ip: getClientIdentifier(),
        endpoint: config.endpoint || 'default',
        blocked: false
      };

      const updatedData: RateLimitData = {
        requests: [...recentRequests, newRequest],
        blockUntil: 0,
        violations: data.violations
      };
      
      saveRateLimitData(updatedData);
      setIsBlocked(false);
      setBlockTimeRemaining(0);
      
      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow on error to prevent complete blocking
    }
  }, [config]);

  const solveCaptcha = useCallback(() => {
    setShowCaptcha(false);
    setIsBlocked(false);
    
    // Reset violations on successful captcha
    const data = getRateLimitData();
    const resetData: RateLimitData = {
      ...data,
      violations: 0,
      blockUntil: 0
    };
    saveRateLimitData(resetData);
  }, []);

  const resetLimits = useCallback(() => {
    const key = getStorageKey(config.endpoint);
    localStorage.removeItem(key);
    setIsBlocked(false);
    setRequestCount(0);
    setBlockTimeRemaining(0);
    setShowCaptcha(false);
  }, [config.endpoint]);

  // Update block time remaining
  useEffect(() => {
    if (blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsBlocked(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [blockTimeRemaining]);

  return {
    checkRateLimit,
    isBlocked,
    requestCount,
    blockTimeRemaining,
    showCaptcha,
    solveCaptcha,
    resetLimits,
    maxRequests: config.maxRequests,
    currentWindow: config.windowMs / 1000
  };
};