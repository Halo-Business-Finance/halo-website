import { useState, useCallback } from 'react';
import { EnhancedInputValidator, ValidationResult } from '@/components/security/EnhancedInputValidator';
import { supabase } from '@/integrations/supabase/client';

interface SecureFormOptions {
  enableRealTimeValidation?: boolean;
  maxSubmissionAttempts?: number;
  rateLimitWindow?: number;
}

interface FormSecurityState {
  isSubmitting: boolean;
  submissionAttempts: number;
  lastSubmissionTime: number;
  blockedUntil: number;
  validationErrors: Record<string, string[]>;
  securityWarnings: string[];
}

export const useSecureForm = (options: SecureFormOptions = {}) => {
  const {
    enableRealTimeValidation = true,
    maxSubmissionAttempts = 5,
    rateLimitWindow = 300000 // 5 minutes
  } = options;

  const [securityState, setSecurityState] = useState<FormSecurityState>({
    isSubmitting: false,
    submissionAttempts: 0,
    lastSubmissionTime: 0,
    blockedUntil: 0,
    validationErrors: {},
    securityWarnings: []
  });

  const validateField = useCallback((name: string, value: string, type: 'text' | 'email' | 'phone' | 'url' = 'text'): ValidationResult => {
    const result = EnhancedInputValidator.validateInput(value, type);
    
    if (enableRealTimeValidation) {
      setSecurityState(prev => ({
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          [name]: result.errors
        },
        securityWarnings: result.riskScore > 30 
          ? [...prev.securityWarnings.filter(w => !w.includes(name)), `High risk input detected in ${name}`]
          : prev.securityWarnings.filter(w => !w.includes(name))
      }));
    }

    return result;
  }, [enableRealTimeValidation]);

  const sanitizeField = useCallback((value: string): string => {
    return EnhancedInputValidator.sanitizeInput(value);
  }, []);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    
    if (now < securityState.blockedUntil) {
      return false; // Still blocked
    }

    // Reset attempts if window has passed
    if (now - securityState.lastSubmissionTime > rateLimitWindow) {
      setSecurityState(prev => ({
        ...prev,
        submissionAttempts: 0
      }));
      return true;
    }

    // Check if attempts exceeded
    if (securityState.submissionAttempts >= maxSubmissionAttempts) {
      const blockDuration = 15 * 60 * 1000; // 15 minutes
      setSecurityState(prev => ({
        ...prev,
        blockedUntil: now + blockDuration,
        securityWarnings: [...prev.securityWarnings, 'Too many submission attempts. Temporarily blocked.']
      }));
      
      // Log security event
      logSecurityEvent('form_rate_limit_exceeded', {
        attempts: securityState.submissionAttempts,
        blockDuration: blockDuration
      });
      
      return false;
    }

    return true;
  }, [securityState, maxSubmissionAttempts, rateLimitWindow]);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const errors: Record<string, string[]> = {};
    let hasErrors = false;
    let totalRiskScore = 0;

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const result = EnhancedInputValidator.validateInput(value);
        if (!result.isValid) {
          errors[key] = result.errors;
          hasErrors = true;
        }
        totalRiskScore += result.riskScore;
      }
    });

    // Check overall form risk
    const warnings: string[] = [];
    if (totalRiskScore > 100) {
      warnings.push('High security risk detected in form submission');
    }
    if (totalRiskScore > 200) {
      warnings.push('Critical security threat detected - submission blocked');
      hasErrors = true;
    }

    setSecurityState(prev => ({
      ...prev,
      validationErrors: errors,
      securityWarnings: warnings
    }));

    if (totalRiskScore > 150) {
      logSecurityEvent('high_risk_form_submission_blocked', {
        riskScore: totalRiskScore,
        formFields: Object.keys(formData)
      });
    }

    return !hasErrors;
  }, []);

  const prepareSecureSubmission = useCallback(async (formData: Record<string, any>) => {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!validateForm(formData)) {
      throw new Error('Form validation failed');
    }

    // Increment submission attempt
    setSecurityState(prev => ({
      ...prev,
      isSubmitting: true,
      submissionAttempts: prev.submissionAttempts + 1,
      lastSubmissionTime: Date.now()
    }));

    // Sanitize all string values
    const sanitizedData = Object.entries(formData).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? sanitizeField(value) : value;
      return acc;
    }, {} as Record<string, any>);

    return sanitizedData;
  }, [checkRateLimit, validateForm, sanitizeField]);

  const completeSubmission = useCallback((success: boolean, error?: string) => {
    setSecurityState(prev => ({
      ...prev,
      isSubmitting: false,
      securityWarnings: error ? [...prev.securityWarnings, error] : prev.securityWarnings
    }));

    if (success) {
      // Reset on successful submission
      setSecurityState(prev => ({
        ...prev,
        submissionAttempts: 0,
        validationErrors: {},
        securityWarnings: []
      }));
    }
  }, []);

  const logSecurityEvent = useCallback(async (eventType: string, eventData: any) => {
    try {
      await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: eventType,
          severity: 'medium',
          event_data: eventData,
          source: 'secure_form'
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const resetForm = useCallback(() => {
    setSecurityState({
      isSubmitting: false,
      submissionAttempts: 0,
      lastSubmissionTime: 0,
      blockedUntil: 0,
      validationErrors: {},
      securityWarnings: []
    });
  }, []);

  return {
    validateField,
    sanitizeField,
    validateForm,
    prepareSecureSubmission,
    completeSubmission,
    resetForm,
    securityState,
    isBlocked: Date.now() < securityState.blockedUntil,
    canSubmit: !securityState.isSubmitting && Date.now() >= securityState.blockedUntil
  };
};