import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useFormSecurity } from './FormSecurityProvider';
import { useAdvancedRateLimit } from './RateLimiter';
import { useServerRateLimit } from './ServerRateLimit';
import { CaptchaChallenge } from './CaptchaChallenge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface EnhancedSecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
  endpoint: string;
  maxSubmissions?: number;
  windowMs?: number;
  requiresCaptcha?: boolean;
}

export const EnhancedSecureForm: React.FC<EnhancedSecureFormProps> = ({
  children,
  onSubmit,
  endpoint,
  maxSubmissions = 5,
  windowMs = 15 * 60 * 1000, // 15 minutes
  requiresCaptcha = false
}) => {
  const { 
    generateCSRFToken, 
    validateCSRFToken, 
    encryptSensitiveData, 
    sanitizeInput, 
    validateInput 
  } = useFormSecurity();
  
  // Client-side rate limiting (fallback)
  const {
    checkRateLimit: checkClientLimit,
    isBlocked: isClientBlocked,
    blockTimeRemaining,
    showCaptcha,
    solveCaptcha
  } = useAdvancedRateLimit({
    maxRequests: maxSubmissions,
    windowMs,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    endpoint
  });

  // Server-side rate limiting (primary)
  const { 
    checkRateLimit: checkServerLimit, 
    isBlocked: isServerBlocked, 
    lastResponse, 
    timeUntilReset 
  } = useServerRateLimit();

  const isBlocked = isServerBlocked || isClientBlocked;

  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  useEffect(() => {
    // Generate CSRF token on mount
    const token = generateCSRFToken();
    setCsrfToken(token);
  }, [generateCSRFToken]);

  const validateFormData = (formData: FormData): boolean => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      newErrors.push('Security token validation failed. Please refresh and try again.');
    }

    // Check for suspicious patterns in form data
    formData.forEach((value, key) => {
      const stringValue = value.toString();
      const sanitized = sanitizeInput(stringValue);
      
      if (sanitized !== stringValue) {
        newWarnings.push(`Potentially unsafe content detected in ${key} field.`);
      }

      // Validate based on field type
      if (key.toLowerCase().includes('email')) {
        if (!validateInput(sanitized, 'email')) {
          newErrors.push(`Invalid email format in ${key} field.`);
        }
      }
      
      if (key.toLowerCase().includes('phone')) {
        if (!validateInput(sanitized, 'phone')) {
          newErrors.push(`Invalid phone format in ${key} field.`);
        }
      }

      // Check for XSS patterns
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /eval\(/i
      ];

      if (xssPatterns.some(pattern => pattern.test(stringValue))) {
        newErrors.push('Potentially malicious content detected. Please remove any script tags or JavaScript.');
      }
    });

    setErrors(newErrors);
    setSecurityWarnings(newWarnings);
    
    return newErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check server-side rate limiting first
    const serverAllowed = await checkServerLimit({ endpoint });
    if (!serverAllowed) {
      const message = lastResponse?.message || `Rate limit exceeded. Please wait ${Math.ceil(timeUntilReset / 60)} minutes.`;
      setErrors([message]);
      return;
    }
    
    // Fallback to client-side rate limiting
    const canProceed = await checkClientLimit();
    if (!canProceed) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    // Add CSRF token
    formData.append('csrf_token', csrfToken);
    
    // Validate form data
    if (!validateFormData(formData)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert FormData to object and encrypt sensitive fields
      const data: any = {};
      formData.forEach((value, key) => {
        let processedValue = sanitizeInput(value.toString());
        
        // Encrypt sensitive fields
        const sensitiveFields = ['ssn', 'tax_id', 'account_number', 'routing_number'];
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          processedValue = encryptSensitiveData(processedValue);
        }
        
        data[key] = processedValue;
      });

      // Add security metadata
      data._security = {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        endpoint
      };

      await onSubmit(data);
      
      // Generate new CSRF token for next submission
      const newToken = generateCSRFToken();
      setCsrfToken(newToken);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(['An error occurred while submitting the form. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCaptcha || (requiresCaptcha && isBlocked)) {
    return (
      <CaptchaChallenge
        onSolve={solveCaptcha}
        difficulty="medium"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Security Status */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          This form is protected by advanced security measures including rate limiting, CSRF protection, and input validation.
        </AlertDescription>
      </Alert>

      {/* Rate Limit Warning */}
      {isBlocked && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Too many submission attempts. Please wait {blockTimeRemaining} seconds before trying again.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Warnings */}
      {securityWarnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p><strong>Security Warnings:</strong></p>
              {securityWarnings.map((warning, index) => (
                <p key={index} className="text-sm">• {warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p><strong>Please fix the following errors:</strong></p>
              {errors.map((error, index) => (
                <p key={index} className="text-sm">• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden CSRF token */}
        <input type="hidden" name="csrf_token" value={csrfToken} />
        
        {/* Form fields */}
        {children}
        
        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting || isBlocked || errors.length > 0}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Secure Form'}
        </Button>
      </form>

      {/* Security footer */}
      <div className="text-xs text-muted-foreground text-center">
        <p>🔒 Your data is encrypted and protected by industry-standard security measures.</p>
      </div>
    </div>
  );
};