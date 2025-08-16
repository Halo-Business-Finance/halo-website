import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class EnhancedSecureErrorHandler extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substring(7)
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.logSecureError(error, errorInfo);
  }

  private logSecureError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Sanitize error information before logging
      const sanitizedError = this.sanitizeErrorData({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

      await supabase.functions.invoke('log-client-security-event', {
        body: {
          event_type: 'client_error_boundary_triggered',
          severity: 'high',
          event_data: sanitizedError,
          source: 'error_boundary'
        }
      });
    } catch (logError) {
      console.error('Failed to log error securely:', logError);
    }
  };

  private sanitizeErrorData = (errorData: any) => {
    // Enhanced sensitive data patterns
    const sensitivePatterns = [
      /password/gi,
      /token/gi,
      /key/gi,
      /secret/gi,
      /api[_-]?key/gi,
      /auth[_-]?token/gi,
      /session[_-]?id/gi,
      /bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, // Bearer tokens
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email addresses
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card patterns
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN patterns
      /\b\d{9}\b/g, // Tax ID patterns
      /localhost:\d+/g, // Development URLs
      /127\.0\.0\.1:\d+/g, // Local IP addresses
      /file:\/\/[^\s]*/g, // File paths
      /c:\\[^\s]*/gi, // Windows paths
      /\/home\/[^\s]*/g, // Unix paths
      /\.env[^\s]*/g // Environment files
    ];

    const sanitized = { ...errorData };
    
    // Sanitize string values recursively
    const sanitizeValue = (obj: any): any => {
      if (typeof obj === 'string') {
        let sanitizedString = obj;
        sensitivePatterns.forEach(pattern => {
          sanitizedString = sanitizedString.replace(pattern, '[REDACTED]');
        });
        return sanitizedString;
      } else if (typeof obj === 'object' && obj !== null) {
        const sanitizedObj: any = {};
        Object.keys(obj).forEach(key => {
          sanitizedObj[key] = sanitizeValue(obj[key]);
        });
        return sanitizedObj;
      }
      return obj;
    };
    
    Object.keys(sanitized).forEach(key => {
      sanitized[key] = sanitizeValue(sanitized[key]);
    });

    // Remove potentially sensitive keys entirely in production
    const isProduction = import.meta.env.PROD;
    if (isProduction) {
      const sensitiveKeys = ['stack', 'componentStack', 'url'];
      sensitiveKeys.forEach(key => {
        if (sanitized[key]) {
          sanitized[key] = '[REDACTED_IN_PRODUCTION]';
        }
      });
    }

    return sanitized;
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  private handleReportIssue = async () => {
    try {
      await supabase.functions.invoke('log-client-security-event', {
        body: {
          event_type: 'user_reported_error',
          severity: 'medium',
          event_data: {
            errorId: this.state.errorId,
            userAction: 'report_issue',
            timestamp: new Date().toISOString()
          },
          source: 'user_report'
        }
      });
    } catch (error) {
      console.error('Failed to report issue:', error);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm text-muted-foreground">
                    We've encountered an unexpected error. Our security team has been notified.
                  </p>
                  {this.state.errorId && (
                    <p className="text-xs font-mono text-muted-foreground">
                      Error ID: {this.state.errorId}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={this.handleRetry}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Try Again
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={this.handleReportIssue}
                    >
                      Report Issue
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}