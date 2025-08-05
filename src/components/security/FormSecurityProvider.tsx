import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import { supabase } from '@/integrations/supabase/client';

interface FormSecurityContextType {
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  encryptSensitiveData: (data: string) => string;
  decryptSensitiveData: (encryptedData: string) => string;
  sanitizeInput: (input: string) => string;
  validateInput: (input: string, type: 'email' | 'phone' | 'ssn' | 'text' | 'number') => boolean;
  csrfToken: string;
}

const FormSecurityContext = createContext<FormSecurityContextType | undefined>(undefined);

interface FormSecurityProviderProps {
  children: ReactNode;
}

export const FormSecurityProvider: React.FC<FormSecurityProviderProps> = ({ children }) => {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [sessionTokens, setSessionTokens] = useState<Set<string>>(new Set());
  const [encryptionKey, setEncryptionKey] = useState<string>('');

  useEffect(() => {
    // Fetch session-specific encryption key from secure endpoint
    const fetchEncryptionKey = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          console.warn('No active session - using fallback encryption');
          setEncryptionKey('dev-fallback-key-not-secure-32char');
          return;
        }

        const response = await fetch('https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/get-encryption-keys', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const { sessionEncryptionKey } = await response.json();
          setEncryptionKey(sessionEncryptionKey);
        } else {
          console.warn('Failed to fetch encryption key, using fallback');
          setEncryptionKey('dev-fallback-key-not-secure-32char');
        }
      } catch (error) {
        console.error('Failed to fetch encryption key:', error);
        // Fallback for development
        setEncryptionKey('dev-fallback-key-not-secure-32char');
      }
    };

    fetchEncryptionKey();
    
    // Generate initial CSRF token
    const token = generateCSRFToken();
    setCSRFToken(token);
  }, []);

  const generateCSRFToken = (): string => {
    const token = CryptoJS.lib.WordArray.random(32).toString();
    setSessionTokens(prev => new Set([...prev, token]));
    
    // Token expires after 1 hour
    setTimeout(() => {
      setSessionTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(token);
        return newSet;
      });
    }, 3600000);
    
    return token;
  };

  const validateCSRFToken = (token: string): boolean => {
    return sessionTokens.has(token);
  };

  const encryptSensitiveData = (data: string): string => {
    try {
      if (!encryptionKey) {
        console.warn('Encryption key not available, data not encrypted');
        return data;
      }
      return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  };

  const decryptSensitiveData = (encryptedData: string): string => {
    try {
      if (!encryptionKey) {
        console.warn('Encryption key not available, returning encrypted data');
        return encryptedData;
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  };

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const validateInput = (input: string, type: 'email' | 'phone' | 'ssn' | 'text' | 'number'): boolean => {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s\-\(\)]{10,}$/,
      ssn: /^\d{3}-?\d{2}-?\d{4}$/,
      text: /^[a-zA-Z0-9\s\-.,!?'"]+$/,
      number: /^[\d,.]+$/
    };

    if (!patterns[type]) return true;
    
    const sanitized = sanitizeInput(input);
    return patterns[type].test(sanitized) && sanitized.length > 0;
  };

  const contextValue: FormSecurityContextType = {
    generateCSRFToken,
    validateCSRFToken,
    encryptSensitiveData,
    decryptSensitiveData,
    sanitizeInput,
    validateInput,
    csrfToken
  };

  return (
    <FormSecurityContext.Provider value={contextValue}>
      {children}
    </FormSecurityContext.Provider>
  );
};

export const useFormSecurity = (): FormSecurityContextType => {
  const context = useContext(FormSecurityContext);
  if (!context) {
    throw new Error('useFormSecurity must be used within a FormSecurityProvider');
  }
  return context;
};