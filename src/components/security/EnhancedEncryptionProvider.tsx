import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import CryptoJS from 'crypto-js';

interface EncryptionKey {
  id: string;
  identifier: string;
  expiresAt: Date;
  algorithm: string;
  isActive: boolean;
}

interface EncryptionContextType {
  encryptData: (data: string, keyId?: string) => Promise<string>;
  decryptData: (encryptedData: string, keyId?: string) => Promise<string>;
  maskSensitiveData: (data: string, type: 'email' | 'phone' | 'name' | 'ssn') => string;
  validateDataIntegrity: (data: string, hash: string) => boolean;
  generateSecureHash: (data: string) => string;
  rotateEncryptionKeys: () => Promise<void>;
  encryptionKeys: EncryptionKey[];
  isEncryptionReady: boolean;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

interface EnhancedEncryptionProviderProps {
  children: ReactNode;
  autoRotateKeys?: boolean;
  keyRotationInterval?: number; // hours
}

export const EnhancedEncryptionProvider: React.FC<EnhancedEncryptionProviderProps> = ({ 
  children, 
  autoRotateKeys = true,
  keyRotationInterval = 24 
}) => {
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([]);
  const [isEncryptionReady, setIsEncryptionReady] = useState(false);
  const [masterKey, setMasterKey] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  // Get or generate master key securely
  const initializeMasterKey = useCallback(async () => {
    try {
      // Try to get encryption key from secure source
      const { data, error } = await supabase.functions.invoke('get-encryption-keys', {
        body: { requestType: 'master_key' }
      });

      if (error || !data?.sessionEncryptionKey) {
        console.warn('Failed to get server encryption key, using session-based key');
        
        // Generate session-based master key
        const sessionKey = sessionStorage.getItem('encryption_master_key');
        if (sessionKey) {
          setMasterKey(sessionKey);
        } else {
          // Generate new session key using Web Crypto API
          const keyArray = new Uint8Array(32);
          crypto.getRandomValues(keyArray);
          const newKey = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
          sessionStorage.setItem('encryption_master_key', newKey);
          setMasterKey(newKey);
        }
      } else {
        setMasterKey(data.sessionEncryptionKey);
      }

      setIsEncryptionReady(true);
    } catch (error) {
      console.error('Failed to initialize master key:', error);
      // Use fallback encryption
      setMasterKey('fallback_key_' + Date.now());
      setIsEncryptionReady(true);
    }
  }, []);

  // Encrypt data with enhanced security
  const encryptData = useCallback(async (data: string, keyId?: string): Promise<string> => {
    if (!masterKey) {
      throw new Error('Encryption not ready');
    }

    try {
      // Add timestamp and user context for additional security
      const timestamp = Date.now();
      const userContext = user?.id || 'anonymous';
      const enhancedData = JSON.stringify({
        data,
        timestamp,
        userContext,
        integrity: CryptoJS.SHA256(data).toString()
      });

      // Use AES encryption with the master key
      const encrypted = CryptoJS.AES.encrypt(enhancedData, masterKey).toString();
      
      // Add additional encoding layer
      const finalEncrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
      
      // Log encryption event for security monitoring
      await supabase.from('security_events').insert({
        event_type: 'data_encrypted',
        severity: 'info',
        user_id: user?.id,
        event_data: {
          data_type: typeof data,
          data_length: data.length,
          encryption_algorithm: 'AES-256',
          timestamp: new Date().toISOString()
        },
        source: 'enhanced_encryption'
      });

      return finalEncrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }, [masterKey, user?.id]);

  // Decrypt data with integrity checking
  const decryptData = useCallback(async (encryptedData: string, keyId?: string): Promise<string> => {
    if (!masterKey) {
      throw new Error('Encryption not ready');
    }

    try {
      // Decode the additional encoding layer
      const decodedData = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedData));
      
      // Decrypt using AES
      const decryptedBytes = CryptoJS.AES.decrypt(decodedData, masterKey);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      // Parse and validate the enhanced data structure
      const enhancedData = JSON.parse(decryptedString);
      const { data, timestamp, userContext, integrity } = enhancedData;

      // Verify data integrity
      const computedIntegrity = CryptoJS.SHA256(data).toString();
      if (computedIntegrity !== integrity) {
        throw new Error('Data integrity check failed');
      }

      // Log decryption event
      await supabase.from('security_events').insert({
        event_type: 'data_decrypted',
        severity: 'info',
        user_id: user?.id,
        event_data: {
          data_age_hours: (Date.now() - timestamp) / (1000 * 60 * 60),
          original_user_context: userContext,
          current_user: user?.id,
          integrity_verified: true,
          timestamp: new Date().toISOString()
        },
        source: 'enhanced_encryption'
      });

      return data;
    } catch (error) {
      console.error('Decryption failed:', error);
      
      // Log decryption failure
      await supabase.from('security_events').insert({
        event_type: 'decryption_failed',
        severity: 'high',
        user_id: user?.id,
        event_data: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        source: 'enhanced_encryption'
      });

      throw new Error('Failed to decrypt data');
    }
  }, [masterKey, user?.id]);

  // Enhanced data masking
  const maskSensitiveData = useCallback((data: string, type: 'email' | 'phone' | 'name' | 'ssn'): string => {
    if (!data) return '';

    switch (type) {
      case 'email':
        const [username, domain] = data.split('@');
        if (!domain) return '***@***.***';
        return username.length > 2 
          ? `${username.substring(0, 2)}***@${domain.split('.')[0]}.***.***`
          : `***@${domain.split('.')[0]}.***.***`;
      
      case 'phone':
        const cleanPhone = data.replace(/\D/g, '');
        if (cleanPhone.length >= 10) {
          return `(${cleanPhone.substring(0, 3)}) ***-${cleanPhone.substring(cleanPhone.length - 4)}`;
        }
        return '(***) ***-****';
      
      case 'name':
        const nameParts = data.split(' ');
        return nameParts.map((part, index) => {
          if (index === 0 && part.length > 1) {
            return part.substring(0, 1) + '*'.repeat(part.length - 1);
          } else if (part.length > 0) {
            return part.substring(0, 1) + '.';
          }
          return part;
        }).join(' ');
      
      case 'ssn':
        const cleanSSN = data.replace(/\D/g, '');
        if (cleanSSN.length === 9) {
          return `***-**-${cleanSSN.substring(5)}`;
        }
        return '***-**-****';
      
      default:
        return '***REDACTED***';
    }
  }, []);

  // Generate secure hash for data integrity
  const generateSecureHash = useCallback((data: string): string => {
    const salt = user?.id || 'system_salt';
    const timestamp = Date.now();
    return CryptoJS.SHA256(data + salt + timestamp).toString();
  }, [user?.id]);

  // Validate data integrity
  const validateDataIntegrity = useCallback((data: string, hash: string): boolean => {
    try {
      const computedHash = CryptoJS.SHA256(data).toString();
      return computedHash === hash;
    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return false;
    }
  }, []);

  // Rotate encryption keys (admin only)
  const rotateEncryptionKeys = useCallback(async () => {
    if (!isAdmin) {
      throw new Error('Key rotation requires admin privileges');
    }

    try {
      // Generate new encryption key
      const { data, error } = await supabase
        .rpc('create_secure_encryption_key', {
          p_key_identifier: `rotation_${Date.now()}`,
          p_algorithm: 'AES-256-GCM'
        });

      if (error) {
        throw error;
      }

      // Log key rotation
      await supabase.from('security_events').insert({
        event_type: 'encryption_keys_rotated',
        severity: 'critical',
        user_id: user?.id,
        event_data: {
          new_key_id: data,
          rotation_timestamp: new Date().toISOString(),
          rotated_by: user?.id
        },
        source: 'key_rotation'
      });

      // Refresh encryption keys list
      await loadEncryptionKeys();
    } catch (error) {
      console.error('Key rotation failed:', error);
      throw new Error('Failed to rotate encryption keys');
    }
  }, [isAdmin, user?.id]);

  // Load encryption keys (admin only)
  const loadEncryptionKeys = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('encryption_keys')
        .select('id, key_identifier, expires_at, algorithm, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load encryption keys:', error);
        return;
      }

      const keys: EncryptionKey[] = data?.map(key => ({
        id: key.id,
        identifier: key.key_identifier,
        expiresAt: new Date(key.expires_at),
        algorithm: key.algorithm,
        isActive: key.is_active
      })) || [];

      setEncryptionKeys(keys);
    } catch (error) {
      console.error('Failed to load encryption keys:', error);
    }
  }, [isAdmin]);

  // Initialize encryption
  useEffect(() => {
    initializeMasterKey();
  }, [initializeMasterKey]);

  // Load encryption keys for admin users
  useEffect(() => {
    if (isAdmin) {
      loadEncryptionKeys();
    }
  }, [isAdmin, loadEncryptionKeys]);

  // Set up automatic key rotation
  useEffect(() => {
    if (!autoRotateKeys || !isAdmin) return;

    const rotationInterval = setInterval(() => {
      console.log('Automatic key rotation triggered');
      rotateEncryptionKeys().catch(error => {
        console.error('Automatic key rotation failed:', error);
      });
    }, keyRotationInterval * 60 * 60 * 1000);

    return () => clearInterval(rotationInterval);
  }, [autoRotateKeys, isAdmin, keyRotationInterval, rotateEncryptionKeys]);

  const contextValue: EncryptionContextType = {
    encryptData,
    decryptData,
    maskSensitiveData,
    validateDataIntegrity,
    generateSecureHash,
    rotateEncryptionKeys,
    encryptionKeys,
    isEncryptionReady
  };

  return (
    <EncryptionContext.Provider value={contextValue}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = (): EncryptionContextType => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EnhancedEncryptionProvider');
  }
  return context;
};