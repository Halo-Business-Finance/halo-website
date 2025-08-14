import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

interface SecureFormValidatorProps {
  value: string;
  rules: ValidationRule[];
  showAllRules?: boolean;
  className?: string;
}

export const SecureFormValidator: React.FC<SecureFormValidatorProps> = ({
  value,
  rules,
  showAllRules = false,
  className = ''
}) => {
  const validationResults = rules.map(rule => ({
    ...rule,
    passed: rule.test(value)
  }));

  const failedRules = validationResults.filter(result => !result.passed);
  const highestSeverity = failedRules.length > 0 
    ? failedRules.reduce((highest, current) => {
        const severityOrder = { error: 3, warning: 2, info: 1 };
        return severityOrder[current.severity] > severityOrder[highest.severity] 
          ? current 
          : highest;
      }).severity
    : 'info';

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const getVariant = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!showAllRules && failedRules.length === 0) {
    return null;
  }

  const rulesToShow = showAllRules ? validationResults : failedRules;

  return (
    <div className={`space-y-2 ${className}`}>
      {rulesToShow.map((rule, index) => (
        <Alert 
          key={index} 
          variant={getVariant(rule.severity)}
          className={`text-sm ${rule.passed ? 'border-green-200 text-green-700' : ''}`}
        >
          {getIcon(rule.severity)}
          <AlertDescription className="flex items-center">
            <span className={rule.passed ? 'text-green-700' : ''}>
              {rule.message}
            </span>
            {rule.passed && (
              <ShieldCheck className="h-3 w-3 ml-2 text-green-600" />
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

// Common validation rules for security
export const securityValidationRules = {
  email: [
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Must be a valid email address',
      severity: 'error' as const
    },
    {
      test: (value: string) => !/<script|javascript:|data:|vbscript:|on\w+=/i.test(value),
      message: 'No script injections allowed',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.length <= 254,
      message: 'Email must be less than 254 characters',
      severity: 'error' as const
    }
  ],
  
  phone: [
    {
      test: (value: string) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
      message: 'Must be a valid phone number',
      severity: 'error' as const
    },
    {
      test: (value: string) => !/<script|javascript:|data:|vbscript:|on\w+=/i.test(value),
      message: 'No script injections allowed',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.length <= 20,
      message: 'Phone number must be less than 20 characters',
      severity: 'error' as const
    }
  ],
  
  name: [
    {
      test: (value: string) => /^[a-zA-Z\s\-\'\.]{2,50}$/.test(value),
      message: 'Name must contain only letters, spaces, hyphens, apostrophes, and periods',
      severity: 'error' as const
    },
    {
      test: (value: string) => !/<script|javascript:|data:|vbscript:|on\w+=/i.test(value),
      message: 'No script injections allowed',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.trim().length >= 2,
      message: 'Name must be at least 2 characters',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.length <= 50,
      message: 'Name must be less than 50 characters',
      severity: 'error' as const
    }
  ],
  
  company: [
    {
      test: (value: string) => /^[a-zA-Z0-9\s\-\'\.\,\&]{2,100}$/.test(value),
      message: 'Company name contains invalid characters',
      severity: 'error' as const
    },
    {
      test: (value: string) => !/<script|javascript:|data:|vbscript:|on\w+=/i.test(value),
      message: 'No script injections allowed',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.trim().length >= 2,
      message: 'Company name must be at least 2 characters',
      severity: 'warning' as const
    },
    {
      test: (value: string) => value.length <= 100,
      message: 'Company name must be less than 100 characters',
      severity: 'error' as const
    }
  ],
  
  message: [
    {
      test: (value: string) => !/<script|javascript:|data:|vbscript:|on\w+=/i.test(value),
      message: 'No script injections allowed',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.length <= 2000,
      message: 'Message must be less than 2000 characters',
      severity: 'error' as const
    },
    {
      test: (value: string) => value.trim().length >= 10,
      message: 'Message should be at least 10 characters for better assistance',
      severity: 'warning' as const
    },
    {
      test: (value: string) => !/\b(password|ssn|social\s*security|credit\s*card)\b/i.test(value),
      message: 'Please do not include sensitive information like passwords or SSN',
      severity: 'warning' as const
    }
  ]
};

// Utility function to validate all fields
export const validateFormData = (data: Record<string, string>, fieldRules: Record<string, ValidationRule[]>) => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.entries(fieldRules).forEach(([field, rules]) => {
    const value = data[field] || '';
    const fieldErrors = rules
      .filter(rule => !rule.test(value) && rule.severity === 'error')
      .map(rule => rule.message);
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};