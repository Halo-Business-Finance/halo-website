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
    // Fetch session-specific encryption key from enhanced secure endpoint
    const fetchEncryptionKey = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        const sessionId = sessionStorage.getItem('sessionId') || crypto.randomUUID();
        sessionStorage.setItem('sessionId', sessionId);
        
        if (!session?.access_token) {
          // Generate a secure random key instead of using predictable fallback
          const randomKey = crypto.getRandomValues(new Uint8Array(32));
          const secureKey = Array.from(randomKey, byte => byte.toString(16).padStart(2, '0')).join('');
          setEncryptionKey(secureKey);
          return;
        }

        const response = await supabase.functions.invoke('enhanced-encryption-key', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: {
            sessionId,
            keyPurpose: 'form_encryption',
            rotationRequested: false
          }
        });
        
        if (response.data?.sessionEncryptionKey) {
          setEncryptionKey(response.data.sessionEncryptionKey);
        } else {
          // Generate secure random key if server key unavailable
          const randomKey = crypto.getRandomValues(new Uint8Array(32));
          const secureKey = Array.from(randomKey, byte => byte.toString(16).padStart(2, '0')).join('');
          setEncryptionKey(secureKey);
        }
      } catch (error) {
        console.warn('Enhanced encryption key service unavailable, using secure fallback');
        // Generate secure random key on error
        const randomKey = crypto.getRandomValues(new Uint8Array(32));
        const secureKey = Array.from(randomKey, byte => byte.toString(16).padStart(2, '0')).join('');
        setEncryptionKey(secureKey);
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
        // Fail securely - don't store unencrypted sensitive data
        throw new Error('Encryption unavailable');
      }
      return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } catch (error) {
      // Fail securely - don't return unencrypted data
      throw new Error('Data encryption failed');
    }
  };

  const decryptSensitiveData = (encryptedData: string): string => {
    try {
      if (!encryptionKey) {
        throw new Error('Decryption key unavailable');
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Decryption produced empty result');
      }
      return decrypted;
    } catch (error) {
      throw new Error('Data decryption failed');
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