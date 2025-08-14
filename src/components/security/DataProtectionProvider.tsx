import React, { createContext, useContext, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface DataProtectionContextType {
  encryptPII: (data: string) => string;
  decryptPII: (encryptedData: string) => string;
  maskPII: (data: string, type: 'email' | 'phone' | 'name' | 'ssn') => string;
  validatePIIAccess: (requiredRole: string) => boolean;
  sanitizeForStorage: (data: Record<string, any>) => Record<string, any>;
  sanitizeForDisplay: (data: Record<string, any>, userRole: string) => Record<string, any>;
}

const DataProtectionContext = createContext<DataProtectionContextType | undefined>(undefined);

interface DataProtectionProviderProps {
  children: ReactNode;
  encryptionKey: string;
  userRole?: string;
}

export const DataProtectionProvider: React.FC<DataProtectionProviderProps> = ({
  children,
  encryptionKey,
  userRole = 'user'
}) => {
  const encryptPII = (data: string): string => {
    if (!data || !encryptionKey) return data;
    
    try {
      return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  };

  const decryptPII = (encryptedData: string): string => {
    if (!encryptedData || !encryptionKey) return encryptedData;
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  };

  const maskPII = (data: string, type: 'email' | 'phone' | 'name' | 'ssn'): string => {
    if (!data) return data;

    switch (type) {
      case 'email':
        const emailParts = data.split('@');
        if (emailParts.length !== 2) return '***@***.***';
        const username = emailParts[0];
        const domain = emailParts[1];
        const maskedUsername = username.length > 2 
          ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
          : '*'.repeat(username.length);
        const domainParts = domain.split('.');
        const maskedDomain = domainParts.length > 1
          ? domainParts[0][0] + '*'.repeat(Math.max(0, domainParts[0].length - 1)) + '.' + domainParts.slice(1).join('.')
          : '*'.repeat(domain.length);
        return `${maskedUsername}@${maskedDomain}`;

      case 'phone':
        const cleaned = data.replace(/\D/g, '');
        if (cleaned.length >= 10) {
          return `(***) ***-${cleaned.slice(-4)}`;
        }
        return '*'.repeat(data.length);

      case 'name':
        const words = data.split(' ');
        return words.map(word => 
          word.length > 1 ? word[0] + '*'.repeat(word.length - 1) : '*'
        ).join(' ');

      case 'ssn':
        const ssnDigits = data.replace(/\D/g, '');
        if (ssnDigits.length === 9) {
          return `***-**-${ssnDigits.slice(-4)}`;
        }
        return '*'.repeat(data.length);

      default:
        return '*'.repeat(data.length);
    }
  };

  const validatePIIAccess = (requiredRole: string): boolean => {
    const roleHierarchy = {
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;

    return userLevel >= requiredLevel;
  };

  const sanitizeForStorage = (data: Record<string, any>): Record<string, any> => {
    const sanitized = { ...data };
    
    // Remove script tags and dangerous content
    const sanitizeString = (str: string): string => {
      return str
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    };

    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitizeString(sanitized[key]);
      }
    });

    return sanitized;
  };

  const sanitizeForDisplay = (data: Record<string, any>, displayUserRole: string): Record<string, any> => {
    const sanitized = { ...data };
    
    // Mask PII based on user role
    if (!validatePIIAccess('admin')) {
      const piiFields = {
        email: 'email',
        phone: 'phone',
        name: 'name',
        ssn: 'ssn'
      };

      Object.entries(piiFields).forEach(([field, type]) => {
        if (sanitized[field]) {
          sanitized[field] = maskPII(sanitized[field], type as any);
        }
      });
    }

    return sanitized;
  };

  const contextValue: DataProtectionContextType = {
    encryptPII,
    decryptPII,
    maskPII,
    validatePIIAccess,
    sanitizeForStorage,
    sanitizeForDisplay
  };

  return (
    <DataProtectionContext.Provider value={contextValue}>
      {children}
    </DataProtectionContext.Provider>
  );
};

export const useDataProtection = (): DataProtectionContextType => {
  const context = useContext(DataProtectionContext);
  if (!context) {
    throw new Error('useDataProtection must be used within a DataProtectionProvider');
  }
  return context;
};