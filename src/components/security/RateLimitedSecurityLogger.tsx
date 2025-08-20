import { supabase } from '@/integrations/supabase/client';

interface SecurityEventData {
  event_type: string;
  severity?: 'info' | 'low' | 'medium' | 'high' | 'critical';
  event_data?: Record<string, any>;
  source?: string;
}

class RateLimitedSecurityLogger {
  private rateLimitMap = new Map<string, { count: number; lastReset: number }>();
  private readonly maxEventsPerMinute = 5; // Reduced from 10 to 5
  private readonly resetInterval = 60000; // 1 minute

  private getRateLimitKey(eventType: string, userAgent?: string): string {
    return `${eventType}_${userAgent || 'unknown'}`;
  }

  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const data = this.rateLimitMap.get(key);

    if (!data || now - data.lastReset > this.resetInterval) {
      this.rateLimitMap.set(key, { count: 1, lastReset: now });
      return false;
    }

    if (data.count >= this.maxEventsPerMinute) {
      return true;
    }

    data.count++;
    return false;
  }

  async logSecurityEvent(eventData: SecurityEventData): Promise<boolean> {
    const userAgent = navigator.userAgent;
    const key = this.getRateLimitKey(eventData.event_type, userAgent);

    // Client-side rate limiting (reduced for better performance)
    if (this.isRateLimited(key)) {
      return false; // Silently fail to reduce console noise
    }

    try {
      // Use the optimized security event logger
      const { data, error } = await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: eventData.event_type,
          severity: eventData.severity || 'info',
          event_data: eventData.event_data || {},
          source: eventData.source || 'client',
          user_agent: userAgent,
          ip_address: null // Let the edge function detect IP
        }
      });

      if (error) {
        // Only log errors in development to reduce production noise
        if (import.meta.env.DEV) {
          console.error('Security event error:', error);
        }
        return false;
      }

      return data?.success || false;
    } catch (error) {
      // Only log critical errors in development
      if (import.meta.env.DEV) {
        console.error('Critical security event error:', error);
      }
      return false;
    }
  }

  // Clean up old rate limit data periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.rateLimitMap.entries()) {
      if (now - data.lastReset > this.resetInterval * 2) {
        this.rateLimitMap.delete(key);
      }
    }
  }
}

export const securityLogger = new RateLimitedSecurityLogger();

// Clean up periodically
setInterval(() => {
  securityLogger.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes