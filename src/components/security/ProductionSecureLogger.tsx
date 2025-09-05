import { useCallback } from 'react';

/**
 * Production-safe logging utility that sanitizes sensitive data
 * and only logs in development mode
 */
export const useSecureLogger = () => {
  const isDevelopment = import.meta.env.DEV;

  const sanitizeData = useCallback((data: any): any => {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'session',
      'email', 'phone', 'ssn', 'ein', 'credit'
    ];

    if (Array.isArray(data)) {
      return data.map(sanitizeData);
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const keyLower = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }, []);

  const secureLog = useCallback((level: 'log' | 'warn' | 'error', message: string, data?: any) => {
    if (!isDevelopment) {
      // In production, only log errors to help with debugging
      if (level === 'error') {
        console.error(`[SECURE] ${message}`, data ? sanitizeData(data) : '');
      }
      return;
    }

    // In development, log everything but sanitized
    const sanitizedData = data ? sanitizeData(data) : undefined;
    console[level](`[SECURE] ${message}`, sanitizedData || '');
  }, [isDevelopment, sanitizeData]);

  const log = useCallback((message: string, data?: any) => {
    secureLog('log', message, data);
  }, [secureLog]);

  const warn = useCallback((message: string, data?: any) => {
    secureLog('warn', message, data);
  }, [secureLog]);

  const error = useCallback((message: string, data?: any) => {
    secureLog('error', message, data);
  }, [secureLog]);

  return { log, warn, error };
};

/**
 * Production-safe alert replacement
 */
export const useSecureAlert = () => {
  const isDevelopment = import.meta.env.DEV;

  const secureAlert = useCallback((message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    if (!isDevelopment) {
      // In production, don't show alerts - log to console instead
      console.warn('[SECURE ALERT]', message);
      return;
    }

    // In development, show sanitized alerts
    const sanitizedMessage = message.replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]')
                                    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
                                    .replace(/\b\d{10,}\b/g, '[NUMBER]');
    
    alert(`[${type.toUpperCase()}] ${sanitizedMessage}`);
  }, [isDevelopment]);

  return secureAlert;
};