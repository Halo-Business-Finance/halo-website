import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

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
  
  // Encryption key - in production, this should come from secure environment
  const ENCRYPTION_KEY = 'your-secure-encryption-key-32-chars!!';

  useEffect(() => {
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
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  };

  const decryptSensitiveData = (encryptedData: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
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