import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface SecurityContext {
  sessionValid: boolean;
  securityLevel: 'normal' | 'enhanced' | 'high';
  csrfToken: string | null;
  validateSession: () => Promise<boolean>;
  elevateSecurityLevel: (level: 'enhanced' | 'high') => Promise<boolean>;
  refreshCSRFToken: () => Promise<void>;
}

const HardenedSecurityContext = createContext<SecurityContext | undefined>(undefined);

interface HardenedSecurityProviderProps {
  children: ReactNode;
}

export const HardenedSecurityProvider: React.FC<HardenedSecurityProviderProps> = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'enhanced' | 'high'>('normal');
  const [csrfToken, setCSRFToken] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      validateSession();
      generateCSRFToken();
    } else {
      setSessionValid(false);
      setCSRFToken(null);
      setSecurityLevel('normal');
    }
  }, [session]);

  // Periodic session validation
  useEffect(() => {
    if (!sessionValid) return;

    const interval = setInterval(() => {
      validateSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [sessionValid]);

  const validateSession = async (): Promise<boolean> => {
    if (!user || !session) {
      setSessionValid(false);
      return false;
    }

    try {
      const { data: isValid, error } = await supabase
        .rpc('verify_active_session_with_mfa', {
          required_security_level: securityLevel,
          max_idle_minutes: securityLevel === 'high' ? 10 : 30
        });

      if (error) {
        console.error('Session validation error:', error);
        setSessionValid(false);
        
        // Log security event
        await supabase.from('security_events').insert({
          event_type: 'session_validation_failed',
          severity: 'high',
          user_id: user.id,
          event_data: {
            error: error.message,
            security_level: securityLevel,
            timestamp: new Date().toISOString()
          },
          source: 'hardened_security_provider'
        });
        
        return false;
      }

      setSessionValid(isValid || false);
      
      if (!isValid) {
        toast({
          title: 'Session Security Warning',
          description: 'Your session security level has been downgraded. Please re-authenticate for sensitive operations.',
          variant: 'destructive',
        });
      }

      return isValid || false;
    } catch (error) {
      console.error('Critical session validation error:', error);
      setSessionValid(false);
      return false;
    }
  };

  const elevateSecurityLevel = async (level: 'enhanced' | 'high'): Promise<boolean> => {
    if (!user || !sessionValid) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access this feature.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Check if current session supports the requested security level
      const { data: canElevate, error } = await supabase
        .rpc('verify_active_session_with_mfa', {
          required_security_level: level,
          max_idle_minutes: level === 'high' ? 5 : 15
        });

      if (error || !canElevate) {
        toast({
          title: 'Security Elevation Required',
          description: `Your current session does not meet the ${level} security requirements. Please re-authenticate.`,
          variant: 'destructive',
        });
        return false;
      }

      setSecurityLevel(level);
      
      // Log security level elevation
      await supabase.from('security_events').insert({
        event_type: 'security_level_elevated',
        severity: 'medium',
        user_id: user.id,
        event_data: {
          from_level: securityLevel,
          to_level: level,
          timestamp: new Date().toISOString()
        },
        source: 'hardened_security_provider'
      });

      toast({
        title: 'Security Level Elevated',
        description: `Security level elevated to ${level}.`,
      });

      return true;
    } catch (error) {
      console.error('Security elevation error:', error);
      toast({
        title: 'Security Error',
        description: 'Failed to elevate security level.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const generateCSRFToken = async (): Promise<void> => {
    if (!session) return;

    try {
      const { data: tokenData, error } = await supabase.functions.invoke('enhanced-csrf-token', {
        body: {
          session_id: session.access_token.substring(0, 16), // Use part of access token as session ID
          security_level: securityLevel
        }
      });

      if (error) throw error;

      setCSRFToken(tokenData.token);
    } catch (error) {
      console.error('CSRF token generation error:', error);
      
      // Fallback to client-side generation for non-critical operations
      const fallbackToken = btoa(Math.random().toString(36).substring(2, 15) + 
                                 Math.random().toString(36).substring(2, 15));
      setCSRFToken(fallbackToken);
    }
  };

  const refreshCSRFToken = async (): Promise<void> => {
    await generateCSRFToken();
  };

  const contextValue: SecurityContext = {
    sessionValid,
    securityLevel,
    csrfToken,
    validateSession,
    elevateSecurityLevel,
    refreshCSRFToken
  };

  return (
    <HardenedSecurityContext.Provider value={contextValue}>
      {children}
    </HardenedSecurityContext.Provider>
  );
};

export const useHardenedSecurity = (): SecurityContext => {
  const context = useContext(HardenedSecurityContext);
  if (!context) {
    throw new Error('useHardenedSecurity must be used within a HardenedSecurityProvider');
  }
  return context;
};