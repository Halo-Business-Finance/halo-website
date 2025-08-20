/**
 * Enhanced XSS sanitization utilities for production security
 */

export class SecureSanitizer {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onload
    /<[^>]*\s(on\w+|javascript:|data:)/gi,
    /expression\s*\(/gi,
    /@import/gi,
    /url\s*\(/gi,
    /<style[^>]*>.*?<\/style>/gis,
    /&#x?\d+;/gi, // HTML entities that might be used for obfuscation
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(['"])\s*(or|and)\s+\1?\d+\1?\s*[=<>]/gi,
    /\b(or|and)\s+\d+\s*[=<>]\s*\d+/gi,
    /\/\*.*?\*\//g, // SQL comments
    /--[^\r\n]*/g, // SQL line comments
    /['"]\s*;\s*\w+/gi, // Command injection
  ];

  /**
   * Sanitize user input to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove dangerous HTML tags and attributes
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode remaining HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized.trim();
  }

  /**
   * Sanitize input to prevent SQL injection
   */
  static sanitizeSql(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[BLOCKED]');
    });
    
    return sanitized;
  }

  /**
   * Comprehensive input sanitization for form data
   */
  static sanitizeFormInput(input: string, type: 'email' | 'phone' | 'name' | 'text' | 'number' = 'text'): string {
    if (typeof input !== 'string') return '';
    
    // Basic XSS protection
    let sanitized = this.sanitizeHtml(input);
    
    // SQL injection protection
    sanitized = this.sanitizeSql(sanitized);
    
    // Type-specific validation
    switch (type) {
      case 'email':
        // Only allow valid email characters
        sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
        break;
      case 'phone':
        // Only allow digits, spaces, hyphens, parentheses, plus
        sanitized = sanitized.replace(/[^0-9\s\-\(\)\+]/g, '');
        break;
      case 'name':
        // Only allow letters, spaces, apostrophes, hyphens
        sanitized = sanitized.replace(/[^a-zA-Z\s'\-]/g, '');
        break;
      case 'number':
        // Only allow digits and decimal points
        sanitized = sanitized.replace(/[^0-9.]/g, '');
        break;
      default:
        // General text: remove control characters and excessive whitespace
        sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
        sanitized = sanitized.replace(/\s+/g, ' ');
    }
    
    // Limit length to prevent DoS
    const maxLength = type === 'email' ? 254 : type === 'phone' ? 20 : 1000;
    return sanitized.slice(0, maxLength).trim();
  }

  /**
   * Validate and sanitize URL to prevent open redirects
   */
  static sanitizeUrl(url: string): string {
    if (typeof url !== 'string') return '';
    
    try {
      const parsed = new URL(url);
      
      // Only allow specific protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      if (!allowedProtocols.includes(parsed.protocol)) {
        return '';
      }
      
      // Block dangerous hosts
      const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
      if (blockedHosts.includes(parsed.hostname)) {
        return '';
      }
      
      return parsed.toString();
    } catch (e) {
      return '';
    }
  }

  /**
   * Remove sensitive data from objects before logging
   */
  static sanitizeForLogging(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'session',
      'credit_card', 'ssn', 'social_security', 'api_key'
    ];
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sensitiveKey => 
        lowerKey.includes(sensitiveKey)
      );
      
      if (isSensitive) {
        (sanitized as any)[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        (sanitized as any)[key] = this.sanitizeForLogging(obj[key]);
      } else {
        (sanitized as any)[key] = obj[key];
      }
    });
    
    return sanitized;
  }
}