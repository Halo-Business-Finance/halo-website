/**
 * Secure Logger - Production-safe logging utility
 * Automatically filters out sensitive information and provides conditional logging
 */

interface LogLevel {
  SILENT: 0;
  ERROR: 1;
  WARN: 2;
  INFO: 3;
  DEBUG: 4;
}

const LOG_LEVELS: LogLevel = {
  SILENT: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

class SecureLogger {
  private currentLevel: number;
  private sensitivePatterns: RegExp[];
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.currentLevel = this.isProduction ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
    
    // Patterns to detect and redact sensitive information
    this.sensitivePatterns = [
      /password['":\s]*['"]\w+['"]/gi,
      /token['":\s]*['"]\w+['"]/gi,
      /key['":\s]*['"]\w+['"]/gi,
      /secret['":\s]*['"]\w+['"]/gi,
      /bearer\s+\w+/gi,
      /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, // Credit card numbers
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email addresses
    ];
  }

  private sanitize(data: any): any {
    if (typeof data === 'string') {
      let sanitized = data;
      this.sensitivePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
      });
      return sanitized;
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitized[key] = this.sanitize(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private log(level: number, method: 'log' | 'warn' | 'error', ...args: any[]) {
    if (level <= this.currentLevel) {
      const sanitizedArgs = args.map(arg => this.sanitize(arg));
      
      if (this.isProduction) {
        // In production, only log errors and send to monitoring service
        if (level <= LOG_LEVELS.ERROR) {
          console[method]('[SECURE]', ...sanitizedArgs);
          this.sendToMonitoringService(level, sanitizedArgs);
        }
      } else {
        // In development, log normally with security prefix
        console[method]('[SECURE]', ...sanitizedArgs);
      }
    }
  }

  private async sendToMonitoringService(level: number, data: any[]) {
    try {
      // In a real implementation, this would send to your monitoring service
      // For now, we'll use a simple fetch to a logging endpoint
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {}); // Fail silently in production
    } catch {
      // Fail silently - logging should never break the app
    }
  }

  debug(...args: any[]) {
    this.log(LOG_LEVELS.DEBUG, 'log', ...args);
  }

  info(...args: any[]) {
    this.log(LOG_LEVELS.INFO, 'log', ...args);
  }

  warn(...args: any[]) {
    this.log(LOG_LEVELS.WARN, 'warn', ...args);
  }

  error(...args: any[]) {
    this.log(LOG_LEVELS.ERROR, 'error', ...args);
  }

  // Security-specific logging methods
  securityEvent(eventType: string, details: any) {
    this.error('SECURITY_EVENT', { type: eventType, details: this.sanitize(details) });
  }

  authEvent(action: string, userId?: string, details?: any) {
    this.info('AUTH_EVENT', { 
      action, 
      userId: userId ? `user-${userId.substring(0, 8)}` : 'anonymous',
      details: this.sanitize(details)
    });
  }

  performanceEvent(metric: string, value: number, context?: any) {
    this.info('PERFORMANCE_EVENT', { metric, value, context: this.sanitize(context) });
  }
}

// Export singleton instance
export const secureLogger = new SecureLogger();

// Legacy console replacement for gradual migration
export const replaceConsole = () => {
  if (import.meta.env.PROD) {
    // In production, replace console methods with secure logger
    (window as any).console = {
      ...window.console,
      log: (...args: any[]) => secureLogger.debug(...args),
      warn: (...args: any[]) => secureLogger.warn(...args),
      error: (...args: any[]) => secureLogger.error(...args),
      info: (...args: any[]) => secureLogger.info(...args)
    };
  }
};