import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureAuthContextType {
  signUpSecure: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  resetPasswordSecure: (email: string) => Promise<{ error: any }>;
  validateRedirectUrl: (url: string) => Promise<boolean>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

interface SecureAuthProviderProps {
  children: ReactNode;
}

export const SecureAuthProvider: React.FC<SecureAuthProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const validateRedirectUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-redirect-url', {
        body: { redirectUrl: url }
      });

      if (error) {
        console.error('Redirect validation error:', error);
        return false;
      }

      return data?.isValid || false;
    } catch (error) {
      console.error('Failed to validate redirect URL:', error);
      return false;
    }
  }, []);

  const signUpSecure = useCallback(async (
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<{ error: any }> => {
    try {
      // Generate secure redirect URL
      const redirectUrl = `${window.location.origin}/`;
      
      // Validate redirect URL before using it
      const isValidRedirect = await validateRedirectUrl(redirectUrl);
      if (!isValidRedirect) {
        return { 
          error: { 
            message: 'Invalid redirect configuration. Please contact support.' 
          } 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || '',
          }
        }
      });

      if (error) {
        // Log security event for failed signup attempts
        await supabase.functions.invoke('log-security-event', {
          body: {
            event_type: 'signup_attempt_failed',
            severity: 'medium',
            event_data: {
              email_domain: email.split('@')[1],
              error_type: error.message,
              timestamp: new Date().toISOString()
            },
            source: 'secure_auth'
          }
        });
      } else if (data.user) {
        // Log successful signup
        await supabase.functions.invoke('log-security-event', {
          body: {
            event_type: 'user_signup_success',
            severity: 'info',
            event_data: {
              user_id: data.user.id,
              email_domain: email.split('@')[1],
              confirmation_required: !data.session,
              timestamp: new Date().toISOString()
            },
            source: 'secure_auth'
          }
        });
      }

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }, [validateRedirectUrl]);

  const resetPasswordSecure = useCallback(async (email: string): Promise<{ error: any }> => {
    try {
      // Generate secure redirect URL for password reset
      const redirectUrl = `${window.location.origin}/auth?tab=reset-password`;
      
      // Validate redirect URL
      const isValidRedirect = await validateRedirectUrl(redirectUrl);
      if (!isValidRedirect) {
        return { 
          error: { 
            message: 'Invalid redirect configuration. Please contact support.' 
          } 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      // Log password reset attempt
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'password_reset_requested',
          severity: error ? 'medium' : 'info',
          event_data: {
            email_domain: email.split('@')[1],
            success: !error,
            timestamp: new Date().toISOString()
          },
          source: 'secure_auth'
        }
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }, [validateRedirectUrl]);

  const contextValue: SecureAuthContextType = {
    signUpSecure,
    resetPasswordSecure,
    validateRedirectUrl
  };

  return (
    <SecureAuthContext.Provider value={contextValue}>
      {children}
    </SecureAuthContext.Provider>
  );
};

export const useSecureAuth = (): SecureAuthContextType => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};