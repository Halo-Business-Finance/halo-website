/**
 * Log Sampling Utility
 * Implements intelligent log sampling to reduce database overhead
 */

interface LogEvent {
  event_type: string;
  severity: string;
  timestamp: number;
  [key: string]: any;
}

interface LogCache {
  lastSeen: number;
  count: number;
  backoffMultiplier: number;
}

class LogSampler {
  private static instance: LogSampler;
  private eventCache: Map<string, LogCache> = new Map();
  private readonly baseBackoffMs = 60000; // 1 minute
  private readonly maxBackoffMs = 3600000; // 1 hour

  private constructor() {
    // Clean up old cache entries periodically
    setInterval(() => this.cleanupCache(), 300000); // Every 5 minutes
  }

  public static getInstance(): LogSampler {
    if (!LogSampler.instance) {
      LogSampler.instance = new LogSampler();
    }
    return LogSampler.instance;
  }

  /**
   * Determine if a log event should be kept based on sampling rules
   */
  public shouldKeepLog(event: LogEvent, samplingRate: number = 10): boolean {
    const eventKey = `${event.event_type}_${event.severity}`;
    const now = Date.now();

    // Always keep high-severity events
    if (event.severity === 'high' || event.severity === 'critical' || event.severity === 'error') {
      this.resetBackoff(eventKey);
      return true;
    }

    // Check if we're in a backoff period for this event type
    const cached = this.eventCache.get(eventKey);
    if (cached) {
      const backoffPeriod = Math.min(
        this.baseBackoffMs * cached.backoffMultiplier,
        this.maxBackoffMs
      );

      if (now - cached.lastSeen < backoffPeriod) {
        // In backoff period - skip this log
        cached.count++;
        return false;
      }

      // Backoff period expired - keep this log but increase backoff
      cached.lastSeen = now;
      cached.count = 1;
      cached.backoffMultiplier = Math.min(cached.backoffMultiplier * 2, 32);
      return true;
    }

    // First time seeing this event type
    this.eventCache.set(eventKey, {
      lastSeen: now,
      count: 1,
      backoffMultiplier: 1
    });

    // Apply sampling rate for low-priority events
    if (event.severity === 'info' || event.severity === 'low') {
      return Math.random() < (1 / samplingRate);
    }

    return true;
  }

  /**
   * Reset backoff for a specific event type
   */
  private resetBackoff(eventKey: string): void {
    const cached = this.eventCache.get(eventKey);
    if (cached) {
      cached.backoffMultiplier = 1;
    }
  }

  /**
   * Clean up old cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    const expirationTime = this.maxBackoffMs * 2; // 2 hours

    for (const [key, cache] of this.eventCache.entries()) {
      if (now - cache.lastSeen > expirationTime) {
        this.eventCache.delete(key);
      }
    }
  }

  /**
   * Get aggregated event counts for reporting
   */
  public getAggregatedCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const [key, cache] of this.eventCache.entries()) {
      counts.set(key, cache.count);
    }
    return counts;
  }
}

export const logSampler = LogSampler.getInstance();
