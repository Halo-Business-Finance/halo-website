// Secure Content Sanitizer for XSS Prevention

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
  stripUnsafe?: boolean;
}

class ContentSanitizer {
  private static instance: ContentSanitizer;
  
  private constructor() {}
  
  static getInstance(): ContentSanitizer {
    if (!ContentSanitizer.instance) {
      ContentSanitizer.instance = new ContentSanitizer();
    }
    return ContentSanitizer.instance;
  }

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHTML(content: string, options: SanitizeOptions = {}): string {
    // Use manual sanitization for security
    return this.serverSideSanitize(content);
  }

  /**
   * Sanitize JSON data for structured schemas
   */
  sanitizeJSONSchema(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJSONSchema(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const cleanKey = this.sanitizeString(key);
        sanitized[cleanKey] = this.sanitizeJSONSchema(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Sanitize strings to prevent injection
   */
  private sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .trim();
  }

  /**
   * Server-side sanitization fallback
   */
  private serverSideSanitize(content: string): string {
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Generate secure nonce for CSP
   */
  generateSecureNonce(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without crypto API
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Validate and sanitize URLs
   */
  sanitizeURL(url: string): string {
    if (!url || typeof url !== 'string') return '';
    
    // Remove dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = url.toLowerCase();
    
    for (const protocol of dangerousProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        return '#';
      }
    }
    
    // Ensure only safe protocols
    if (!lowerUrl.match(/^(https?|mailto|tel|ftp):/)) {
      return url.startsWith('/') ? url : `/${url}`;
    }
    
    return url;
  }
}

export const contentSanitizer = ContentSanitizer.getInstance();
export default contentSanitizer;