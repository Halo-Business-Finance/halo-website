import React from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  riskScore: number;
}

export class EnhancedInputValidator {
  private static readonly XSS_PATTERNS = [
    // Enhanced XSS detection patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi,
    /<svg[^>]*>/gi,
    /<math[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /<applet[^>]*>/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /document\./gi,
    /window\./gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /Function\s*\(/gi,
    /<\s*\w+\s+[^>]*\bon\w+\s*=/gi,
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDROP\b|\bDELETE\b|\bUPDATE\b)/gi,
    /('|(\\\\\')|(\\\\\\\\\\\\\')|(--)|(\/\*|\*\/))/gi,
    /(\b(ALTER|CREATE|EXEC(UTE){0,1}|INSERT|SELECT|DELETE|UPDATE|UNION|DROP)\b)/gi,
  ];

  private static readonly MALICIOUS_PATTERNS = [
    // Command injection
    /(\||;|&|\$\(|`)/gi,
    // Path traversal
    /(\.\.|\/\.\.)/gi,
    // LDAP injection
    /(\*|\(|\)|\\|!|&)/gi,
    // XXE patterns
    /<!ENTITY/gi,
    /<!DOCTYPE.*\[/gi,
  ];

  static validateInput(value: string, type: 'text' | 'email' | 'phone' | 'url' = 'text'): ValidationResult {
    const errors: string[] = [];
    let riskScore = 0;

    if (!value || value.trim() === '') {
      return { isValid: true, errors: [], riskScore: 0 };
    }

    // Check length limits
    if (value.length > 10000) {
      errors.push('Input exceeds maximum length limit');
      riskScore += 30;
    }

    // XSS Detection
    this.XSS_PATTERNS.forEach(pattern => {
      if (pattern.test(value)) {
        errors.push('Potentially malicious script content detected');
        riskScore += 50;
      }
    });

    // SQL Injection Detection
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      if (pattern.test(value)) {
        errors.push('Potentially malicious database query detected');
        riskScore += 60;
      }
    });

    // Other malicious patterns
    this.MALICIOUS_PATTERNS.forEach(pattern => {
      if (pattern.test(value)) {
        errors.push('Potentially malicious system command detected');
        riskScore += 40;
      }
    });

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.isValidEmail(value)) {
          errors.push('Invalid email format');
          riskScore += 10;
        }
        break;
      case 'phone':
        if (!this.isValidPhone(value)) {
          errors.push('Invalid phone format');
          riskScore += 10;
        }
        break;
      case 'url':
        if (!this.isValidUrl(value)) {
          errors.push('Invalid URL format');
          riskScore += 15;
        }
        break;
    }

    // Suspicious character frequency analysis
    const suspiciousChars = (value.match(/[<>'";&|$()]/g) || []).length;
    if (suspiciousChars > value.length * 0.1) {
      errors.push('High frequency of suspicious characters');
      riskScore += 25;
    }

    // Encoding detection
    if (value.includes('%') && /%[0-9a-fA-F]{2}/.test(value)) {
      riskScore += 15; // URL encoding might be used to bypass filters
    }

    return {
      isValid: errors.length === 0,
      errors,
      riskScore: Math.min(100, riskScore)
    };
  }

  static sanitizeInput(value: string): string {
    if (!value) return value;

    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;')
      .trim();
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }

  private static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  static validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];
    let riskScore = 0;

    // File size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size exceeds 10MB limit');
      riskScore += 30;
    }

    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
      riskScore += 50;
    }

    // Suspicious file names
    if (/\.(exe|bat|cmd|scr|pif|vbs|js|jar|com|pif)$/i.test(file.name)) {
      errors.push('Potentially dangerous file extension');
      riskScore += 70;
    }

    // Double extension check
    if ((file.name.match(/\./g) || []).length > 1) {
      errors.push('Multiple file extensions detected');
      riskScore += 40;
    }

    return {
      isValid: errors.length === 0,
      errors,
      riskScore: Math.min(100, riskScore)
    };
  }
}
