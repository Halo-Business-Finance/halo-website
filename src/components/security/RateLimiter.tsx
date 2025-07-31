import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000 // 30 minutes
};

export const useRateLimit = (action: string, config: RateLimitConfig = DEFAULT_CONFIG) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    try {
      // TODO: Implement database-based rate limiting once tables are created
      // For now, use simple client-side rate limiting
      const identifier = getClientIdentifier();
      const storageKey = `rate_limit_${action}_${identifier}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        
        // Check if still blocked
        if (data.blockedUntil && now < data.blockedUntil) {
          setIsBlocked(true);
          toast.error('Too many attempts. Please try again later.');
          return false;
        }
        
        // Check attempts in current window
        const windowStart = now - config.windowMs;
        const recentAttempts = data.attempts.filter((time: number) => time > windowStart);
        
        if (recentAttempts.length >= config.maxAttempts) {
          const blockedUntil = now + config.blockDurationMs;
          localStorage.setItem(storageKey, JSON.stringify({
            attempts: recentAttempts,
            blockedUntil
          }));
          setIsBlocked(true);
          toast.error(`Too many attempts. Blocked for ${config.blockDurationMs / 60000} minutes.`);
          return false;
        }
        
        // Add current attempt
        recentAttempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify({
          attempts: recentAttempts,
          blockedUntil: null
        }));
      } else {
        // First attempt
        localStorage.setItem(storageKey, JSON.stringify({
          attempts: [Date.now()],
          blockedUntil: null
        }));
      }

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow on error
    }
  }, [action, config]);

  return { checkRateLimit, isBlocked };
};

const getClientIdentifier = (): string => {
  // Create a fingerprint based on available browser information
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasFingerprint = canvas.toDataURL();

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.slice(-50) // Last 50 chars of canvas fingerprint
  ].join('|');

  // Create a hash of the fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
};