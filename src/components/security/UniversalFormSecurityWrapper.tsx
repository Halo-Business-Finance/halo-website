import React, { ComponentType } from 'react';
import { useSecureForm } from '@/hooks/useSecureForm';
import { useRateLimit } from '@/components/security/EnhancedRateLimiter';
import { ValidationResult } from '@/components/security/EnhancedInputValidator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface FormSecurityConfig {
  enableRateLimit: boolean;
  rateLimitAction: string;
  maxSubmissions?: number;
  enableInputValidation: boolean;
  requireCSRF?: boolean;
  enableBehavioralAnalysis?: boolean;
  securityLevel: 'basic' | 'enhanced' | 'strict';
}

interface SecureFormWrapperProps {
  config: FormSecurityConfig;
  children: React.ReactNode;
  onSecurityViolation?: (violation: string, details: any) => void;
}

export const UniversalFormSecurityWrapper: React.FC<SecureFormWrapperProps> = ({
  config,
  children,
  onSecurityViolation
}) => {
  const {
    validateField,
    sanitizeField,
    prepareSecureSubmission,
    completeSubmission,
    securityState,
    isBlocked,
    canSubmit
  } = useSecureForm({
    enableRealTimeValidation: config.enableInputValidation,
    maxSubmissionAttempts: config.maxSubmissions || 5,
    rateLimitWindow: 3600000 // 1 hour
  });

  const { checkRateLimit, getBehavioralScore } = useRateLimit();

  // Enhanced form wrapper with comprehensive security
  const wrapFormSubmission = React.useCallback(async (
    originalOnSubmit: (data: any) => void | Promise<void>,
    formData: any
  ) => {
    try {
      // Rate limiting check
      if (config.enableRateLimit) {
        const rateLimitPassed = await checkRateLimit(config.rateLimitAction);
        if (!rateLimitPassed) {
          onSecurityViolation?.('rate_limit_exceeded', { action: config.rateLimitAction });
          return;
        }
      }

      // Behavioral analysis (if enabled)
      if (config.enableBehavioralAnalysis) {
        const behavioralScore = getBehavioralScore();
        if (behavioralScore < 20) {
          onSecurityViolation?.('suspicious_behavior', { score: behavioralScore });
          return;
        }
      }

      // Prepare secure submission with validation and sanitization
      const secureData = await prepareSecureSubmission(formData);
      
      // Execute original submission
      await originalOnSubmit(secureData);
      
      // Mark as successful
      completeSubmission(true);
    } catch (error) {
      completeSubmission(false, error instanceof Error ? error.message : 'Submission failed');
      throw error;
    }
  }, [config, checkRateLimit, getBehavioralScore, prepareSecureSubmission, completeSubmission, onSecurityViolation]);

  // Enhanced input validation wrapper
  const wrapInputValidation = React.useCallback((
    fieldName: string,
    value: string,
    fieldType: 'text' | 'email' | 'phone' | 'url' = 'text'
  ): ValidationResult => {
    const result = validateField(fieldName, value, fieldType);
    
    if (!result.isValid && result.riskScore > 50) {
      onSecurityViolation?.('high_risk_input', {
        field: fieldName,
        riskScore: result.riskScore,
        errors: result.errors
      });
    }
    
    return result;
  }, [validateField, onSecurityViolation]);

  // Security status indicators
  const renderSecurityStatus = () => {
    if (isBlocked) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Form submission blocked due to security restrictions. Please wait before trying again.
          </AlertDescription>
        </Alert>
      );
    }

    if (securityState.securityWarnings.length > 0) {
      return (
        <Alert variant="default" className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Security notice: {securityState.securityWarnings.join(', ')}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  // Create context for child components
  const securityContext = React.useMemo(() => ({
    wrapFormSubmission,
    wrapInputValidation,
    sanitizeField,
    securityState,
    isBlocked,
    canSubmit,
    config
  }), [wrapFormSubmission, wrapInputValidation, sanitizeField, securityState, isBlocked, canSubmit, config]);

  return (
    <FormSecurityContext.Provider value={securityContext}>
      <div className="form-security-wrapper">
        {renderSecurityStatus()}
        {children}
      </div>
    </FormSecurityContext.Provider>
  );
};

// Context for accessing security features in child components
export const FormSecurityContext = React.createContext<{
  wrapFormSubmission: (onSubmit: (data: any) => void | Promise<void>, formData: any) => Promise<void>;
  wrapInputValidation: (fieldName: string, value: string, fieldType?: 'text' | 'email' | 'phone' | 'url') => ValidationResult;
  sanitizeField: (value: string) => string;
  securityState: any;
  isBlocked: boolean;
  canSubmit: boolean;
  config: FormSecurityConfig;
} | null>(null);

export const useFormSecurity = () => {
  const context = React.useContext(FormSecurityContext);
  if (!context) {
    throw new Error('useFormSecurity must be used within a UniversalFormSecurityWrapper');
  }
  return context;
};

// HOC for automatically securing existing forms
export function withFormSecurity<T extends Record<string, any>>(
  Component: ComponentType<T>,
  securityConfig: FormSecurityConfig
) {
  const WrappedComponent = (props: T) => {
    return (
      <UniversalFormSecurityWrapper
        config={securityConfig}
        onSecurityViolation={(violation, details) => {
          console.warn('Security violation detected:', violation, details);
        }}
      >
        <Component {...props} />
      </UniversalFormSecurityWrapper>
    );
  };
  
  WrappedComponent.displayName = `withFormSecurity(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Pre-configured security levels
export const SECURITY_CONFIGS = {
  BASIC: {
    enableRateLimit: true,
    rateLimitAction: 'form_submit',
    enableInputValidation: true,
    securityLevel: 'basic' as const
  },
  ENHANCED: {
    enableRateLimit: true,
    rateLimitAction: 'form_submit',
    maxSubmissions: 3,
    enableInputValidation: true,
    requireCSRF: true,
    enableBehavioralAnalysis: true,
    securityLevel: 'enhanced' as const
  },
  STRICT: {
    enableRateLimit: true,
    rateLimitAction: 'sensitive_form_submit',
    maxSubmissions: 2,
    enableInputValidation: true,
    requireCSRF: true,
    enableBehavioralAnalysis: true,
    securityLevel: 'strict' as const
  }
};