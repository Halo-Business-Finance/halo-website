import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CSRFContextType {
  csrfToken: string | null;
  refreshToken: () => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  isLoading: boolean;
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined);

interface CSRFProviderProps {
  children: React.ReactNode;
}

export const ServerSideCSRFProvider: React.FC<CSRFProviderProps> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateToken();
    
    // Refresh token every 30 minutes
    const interval = setInterval(generateToken, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const generateToken = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-csrf-token', {
        body: {
          sessionId: localStorage.getItem('secure_session'),
          timestamp: Date.now()
        }
      });

      if (error) throw error;
      
      setCsrfToken(data.token);
      
      // Store token securely with expiration
      sessionStorage.setItem('csrf_token', JSON.stringify({
        token: data.token,
        expires: Date.now() + (30 * 60 * 1000) // 30 minutes
      }));
      
    } catch (error) {
      console.error('Failed to generate CSRF token:', error);
      
      // Log security event for failed token generation
      await supabase.functions.invoke('log-client-security-event', {
        body: {
          event_type: 'csrf_token_generation_failed',
          severity: 'medium',
          event_data: {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now()
          },
          source: 'csrf_provider'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    await generateToken();
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-csrf-token', {
        body: {
          token,
          sessionId: localStorage.getItem('secure_session')
        }
      });

      if (error) return false;
      return data?.isValid || false;
    } catch (error) {
      console.error('CSRF token validation failed:', error);
      return false;
    }
  };

  return (
    <CSRFContext.Provider value={{
      csrfToken,
      refreshToken,
      validateToken,
      isLoading
    }}>
      {children}
    </CSRFContext.Provider>
  );
};

export const useCSRF = (): CSRFContextType => {
  const context = useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRF must be used within a ServerSideCSRFProvider');
  }
  return context;
};