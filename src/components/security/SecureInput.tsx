import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecureInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  validateSecurity?: boolean;
  preventXSS?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
  errorMessage?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  validateSecurity = true,
  preventXSS = true,
  maxLength = 1000,
  allowedChars,
  errorMessage,
  value,
  onChange,
  ...props
}) => {
  const [securityWarning, setSecurityWarning] = useState<string>('');
  const [sanitizedValue, setSanitizedValue] = useState(value || '');

  useEffect(() => {
    setSanitizedValue(value || '');
  }, [value]);

  const sanitizeInput = (input: string): string => {
    if (!preventXSS) return input;

    // Enhanced XSS protection with comprehensive patterns
    let sanitized = input;
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi,
      /<link[^>]*>/gi,
      /<meta[^>]*>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /expression\s*\(/gi,
      /@import/gi,
      /<style[^>]*>.*?<\/style>/gis,
      /&#x?\d+;/gi
    ];
    
    xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove all HTML tags and encode entities
    sanitized = sanitized
      .replace(/<[^>]*>/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
    
    return sanitized.trim();
  };

  const validateInput = (input: string): string[] => {
    const warnings: string[] = [];

    if (input.length > maxLength) {
      warnings.push(`Input exceeds maximum length of ${maxLength} characters`);
    }

    if (allowedChars && !allowedChars.test(input)) {
      warnings.push('Input contains invalid characters');
    }

    // Check for potential SQL injection patterns
    const sqlPatterns = [
      /union\s+select/gi,
      /or\s+1\s*=\s*1/gi,
      /drop\s+table/gi,
      /delete\s+from/gi,
      /insert\s+into/gi,
      /update\s+.*set/gi
    ];

    if (sqlPatterns.some(pattern => pattern.test(input))) {
      warnings.push('Input contains potentially dangerous patterns');
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi
    ];

    if (xssPatterns.some(pattern => pattern.test(input))) {
      warnings.push('Input contains potentially malicious code');
    }

    return warnings;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (validateSecurity) {
      const warnings = validateInput(rawValue);
      if (warnings.length > 0) {
        setSecurityWarning(warnings[0]);
        return; // Don't update value if validation fails
      } else {
        setSecurityWarning('');
      }
    }

    const cleanValue = sanitizeInput(rawValue);
    setSanitizedValue(cleanValue);

    // Create a new event with sanitized value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: cleanValue
      }
    };

    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="flex items-center gap-2">
          {label}
          {validateSecurity && <Shield className="h-3 w-3 text-green-600" />}
        </Label>
      )}
      
      <Input
        {...props}
        value={sanitizedValue}
        onChange={handleChange}
        maxLength={maxLength}
        className={securityWarning ? 'border-red-500' : ''}
      />
      
      {securityWarning && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{securityWarning}</AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};