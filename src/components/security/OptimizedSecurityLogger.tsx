import { supabase } from '@/integrations/supabase/client';

interface SecurityEventData {
  event_type: string;
  severity?: 'info' | 'low' | 'medium' | 'high' | 'critical';
  event_data?: Record<string, any>;
  source?: string;
}

class OptimizedSecurityLogger {
  private eventBuffer: SecurityEventData[] = [];
  private lastFlush = Date.now();
  private readonly flushInterval = 30000; // 30 seconds
  private readonly maxBufferSize = 10;
  private readonly blockedEventTypes = [
    'client_log',
    'console_access', 
    'dom_mutation',
    'behavioral_pattern_deviation',
    'unusual_time_activity'
  ];

  constructor() {
    // Batch flush events periodically
    setInterval(() => this.flushEvents(), this.flushInterval);
    
    // Emergency cleanup on page unload
    window.addEventListener('beforeunload', () => this.flushEvents());
  }

  async logSecurityEvent(eventData: SecurityEventData): Promise<boolean> {
    // Block noisy event types completely
    if (this.blockedEventTypes.includes(eventData.event_type)) {
      return false;
    }

    // Only allow critical and high severity events for immediate logging
    const isCritical = ['critical', 'high'].includes(eventData.severity || 'info');
    
    if (isCritical) {
      // Log critical events immediately
      return this.logEventDirectly(eventData);
    }

    // Buffer non-critical events for batch processing
    this.eventBuffer.push(eventData);
    
    // Flush if buffer is full
    if (this.eventBuffer.length >= this.maxBufferSize) {
      await this.flushEvents();
    }

    return true;
  }

  private async logEventDirectly(eventData: SecurityEventData): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('optimized-security-logger', {
        body: {
          events: [eventData],
          batch: false,
          priority: 'critical'
        }
      });

      return !error;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Critical security event failed:', error);
      }
      return false;
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await supabase.functions.invoke('optimized-security-logger', {
        body: {
          events: eventsToFlush,
          batch: true,
          priority: 'normal'
        }
      });
    } catch (error) {
      // Silently fail to prevent log noise
      if (import.meta.env.DEV) {
        console.error('Batch security event flush failed:', error);
      }
    }

    this.lastFlush = Date.now();
  }

  // Emergency cleanup
  cleanup(): void {
    this.flushEvents();
    this.eventBuffer = [];
  }
}

export const optimizedSecurityLogger = new OptimizedSecurityLogger();

// Cleanup on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    optimizedSecurityLogger.cleanup();
  });
}