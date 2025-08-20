import { supabase } from '@/integrations/supabase/client';

interface SecurityEventData {
  event_type: string;
  severity?: 'info' | 'low' | 'medium' | 'high' | 'critical';
  event_data?: Record<string, any>;
  source?: string;
}

class RateLimitedSecurityLogger {
  private rateLimitMap = new Map<string, { count: number; lastReset: number }>();
  private readonly maxEventsPerMinute = 10;
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

    // Client-side rate limiting
    if (this.isRateLimited(key)) {
      console.warn(`Security event rate limited: ${eventData.event_type}`);
      return false;
    }

    try {
      // Use the rate-limited function from the migration
      const { data, error } = await supabase.rpc('log_client_security_event', {
        event_type: eventData.event_type,
        severity: eventData.severity || 'info',
        event_data: eventData.event_data || {},
        source: eventData.source || 'client'
      });

      if (error) {
        console.error('Error logging security event:', error);
        return false;
      }

      return Boolean(data);
    } catch (error) {
      console.error('Critical error logging security event:', error);
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