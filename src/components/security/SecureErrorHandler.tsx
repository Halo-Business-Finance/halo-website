import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, AlertTriangle, Shield, Info } from 'lucide-react';

interface SecureErrorHandlerProps {
  error: Error | null;
  context?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

interface SecurityError {
  type: 'security' | 'validation' | 'network' | 'permission' | 'system';
  message: string;
  userMessage: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  showToUser: boolean;
  suggestedAction?: string;
}

export const SecureErrorHandler: React.FC<SecureErrorHandlerProps> = ({
  error,
  context = 'system',
  onRetry,
  showDetails = false,
  className = ''
}) => {
  if (!error) return null;

  const classifyError = (error: Error): SecurityError => {
    const message = error.message.toLowerCase();
    
    // Security-related errors
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return {
        type: 'permission',
        message: error.message,
        userMessage: 'You do not have permission to perform this action.',
        severity: 'high',
        showToUser: true,
        suggestedAction: 'Please contact an administrator if you believe this is an error.'
      };
    }
    
    if (message.includes('lockout') || message.includes('admin')) {
      return {
        type: 'security',
        message: error.message,
        userMessage: 'Security measure activated to protect system integrity.',
        severity: 'critical',
        showToUser: true,
        suggestedAction: 'This action is restricted for security reasons.'
      };
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return {
        type: 'validation',
        message: error.message,
        userMessage: 'Please check your input and try again.',
        severity: 'medium',
        showToUser: true,
        suggestedAction: 'Verify all fields contain valid information.'
      };
    }
    
    // Network errors
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return {
        type: 'network',
        message: error.message,
        userMessage: 'Connection error. Please check your internet connection.',
        severity: 'medium',
        showToUser: true,
        suggestedAction: 'Try again in a few moments.'
      };
    }
    
    // Generic system errors (don't expose details)
    return {
      type: 'system',
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'medium',
      showToUser: true,
      suggestedAction: 'If the problem persists, please contact support.'
    };
  };

  const securityError = classifyError(error);
  
  if (!securityError.showToUser) {
    // Log error for monitoring but don't show to user
    console.error('Hidden security error:', securityError.message);
    return null;
  }

  const getIcon = () => {
    switch (securityError.type) {
      case 'security':
      case 'permission':
        return <Shield className="h-4 w-4" />;
      case 'validation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'network':
        return <Info className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (securityError.severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getTitle = () => {
    switch (securityError.type) {
      case 'security':
        return 'Security Protection Active';
      case 'permission':
        return 'Access Denied';
      case 'validation':
        return 'Input Validation Error';
      case 'network':
        return 'Connection Error';
      default:
        return 'Error';
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{getTitle()}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{securityError.userMessage}</p>
        {securityError.suggestedAction && (
          <p className="text-sm text-muted-foreground">{securityError.suggestedAction}</p>
        )}
        {showDetails && process.env.NODE_ENV === 'development' && (
          <details className="mt-2">
            <summary className="text-xs cursor-pointer">Technical Details (Development Only)</summary>
            <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
        {onRetry && securityError.type !== 'security' && securityError.type !== 'permission' && (
          <button
            onClick={onRetry}
            className="text-sm underline hover:no-underline mt-2"
          >
            Try Again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// React Error Boundary for catching and handling errors securely
interface SecureErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SecureErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>,
  SecureErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SecureErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error securely without exposing sensitive information
    console.error('Secure Error Boundary caught an error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    // In production, send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send sanitized error to monitoring service
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // Sanitize error before reporting
    const sanitizedError = {
      message: error.message.replace(/['"]/g, ''), // Remove quotes that might break JSON
      name: error.name,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      // Don't include full stack trace in production reports
      hasStack: !!error.stack
    };
    
    // Report to monitoring service (implementation depends on your monitoring setup)
    console.log('Error reported to monitoring:', sanitizedError);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }
      
      return (
        <SecureErrorHandler 
          error={this.state.error} 
          context="application"
          showDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}