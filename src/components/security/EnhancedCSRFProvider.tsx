import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { securityEnvironment } from '@/utils/securityEnvironment';

interface EnhancedCSRFContextType {
  csrfToken: string | null;
  refreshToken: () => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  generateSecureToken: () => Promise<string>;
  isLoading: boolean;
  tokenRotationEnabled: boolean;
}

const EnhancedCSRFContext = createContext<EnhancedCSRFContextType | undefined>(undefined);

interface EnhancedCSRFProviderProps {
  children: ReactNode;
  autoRotateInterval?: number; // in minutes, default 30
}

export const EnhancedCSRFProvider: React.FC<EnhancedCSRFProviderProps> = ({ 
  children, 
  autoRotateInterval = 30 
}) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenRotationEnabled, setTokenRotationEnabled] = useState(true);

  // Generate cryptographically secure token
  const generateSecureToken = useCallback(async (): Promise<string> => {
    try {
      // Use Web Crypto API for secure random generation
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      
      // Add timestamp and session ID for uniqueness
      const timestamp = Date.now().toString();
      const sessionData = sessionStorage.getItem('supabase.auth.token') || 'anonymous';
      const sessionHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sessionData));
      const sessionHashArray = new Uint8Array(sessionHash);
      
      // Combine all entropy sources
      const combined = new Uint8Array(array.length + timestamp.length + sessionHashArray.length);
      combined.set(array);
      combined.set(new TextEncoder().encode(timestamp), array.length);
      combined.set(sessionHashArray, array.length + timestamp.length);
      
      // Generate final token
      const finalHash = await crypto.subtle.digest('SHA-256', combined);
      const hashArray = new Uint8Array(finalHash);
      
      return Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Failed to generate secure token:', error);
      // Fallback to less secure method if Web Crypto fails
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }, []);

  const generateToken = useCallback(async (): Promise<void> => {
    try {
      const sessionId = sessionStorage.getItem('csrf_session_id') || 
        crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36);
      
      if (!sessionStorage.getItem('csrf_session_id')) {
        sessionStorage.setItem('csrf_session_id', sessionId);
      }

      const { data, error } = await supabase.functions.invoke('generate-csrf-token', {
        body: { 
          sessionId, 
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          entropy: await generateSecureToken()
        }
      });

      if (error) {
        console.error('CSRF token generation error:', error);
        // Generate client-side fallback token
        const fallbackToken = await generateSecureToken();
        setCsrfToken(fallbackToken);
        sessionStorage.setItem('csrf_token', fallbackToken);
        return;
      }

      setCsrfToken(data.token);
      sessionStorage.setItem('csrf_token', data.token);
      sessionStorage.setItem('csrf_token_expires', data.expiresAt);
    } catch (err) {
      console.error('Failed to generate CSRF token:', err);
      // Generate secure fallback
      const fallbackToken = await generateSecureToken();
      setCsrfToken(fallbackToken);
      sessionStorage.setItem('csrf_token', fallbackToken);
    } finally {
      setIsLoading(false);
    }
  }, [generateSecureToken]);

  const refreshToken = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await generateToken();
  }, [generateToken]);

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const sessionId = sessionStorage.getItem('csrf_session_id');
      
      // Use enhanced server-side validation
      const { data, error } = await supabase
        .rpc('validate_csrf_token_enhanced', {
          token,
          session_id: sessionId,
          max_age_minutes: 60
        });

      if (error) {
        console.error('CSRF token validation error:', error);
        return false;
      }

      const isValid = data || false;
      
      // Log validation result for security monitoring
      await supabase.from('security_events').insert({
        event_type: 'csrf_token_validation_result',
        severity: isValid ? 'info' : 'medium',
        event_data: {
          validation_result: isValid,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        },
        source: 'enhanced_csrf_provider'
      });

      return isValid;
    } catch (error) {
      console.error('Failed to validate CSRF token:', error);
      return false;
    }
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    generateToken();

    if (tokenRotationEnabled && autoRotateInterval > 0) {
      const interval = setInterval(() => {
        console.log('Auto-rotating CSRF token');
        generateToken();
      }, autoRotateInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [generateToken, tokenRotationEnabled, autoRotateInterval]);

  // Check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiresAt = sessionStorage.getItem('csrf_token_expires');
      if (expiresAt && new Date(expiresAt) < new Date()) {
        console.log('CSRF token expired, refreshing...');
        generateToken();
      }
    };

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [generateToken]);

  // Validate environment on mount
  useEffect(() => {
    try {
      securityEnvironment.validateSecurityRequirements();
    } catch (error) {
      console.error('Security environment validation failed:', error);
      setTokenRotationEnabled(false);
    }
  }, []);

  const contextValue: EnhancedCSRFContextType = {
    csrfToken,
    refreshToken,
    validateToken,
    generateSecureToken,
    isLoading,
    tokenRotationEnabled
  };

  return (
    <EnhancedCSRFContext.Provider value={contextValue}>
      {children}
    </EnhancedCSRFContext.Provider>
  );
};

export const useEnhancedCSRF = (): EnhancedCSRFContextType => {
  const context = useContext(EnhancedCSRFContext);
  if (!context) {
    throw new Error('useEnhancedCSRF must be used within an EnhancedCSRFProvider');
  }
  return context;
};