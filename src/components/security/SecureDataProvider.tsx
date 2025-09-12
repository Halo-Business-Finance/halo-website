import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureDataContextType {
  getSecureApplicationData: (applicationId: string, accessLevel?: string) => Promise<any>;
  maskSensitiveData: (data: string, type: 'email' | 'phone' | 'name' | 'ssn' | 'ein') => Promise<string>;
  enforceDataRetention: () => Promise<number>;
}

const SecureDataContext = createContext<SecureDataContextType | undefined>(undefined);

interface SecureDataProviderProps {
  children: ReactNode;
}

export const SecureDataProvider: React.FC<SecureDataProviderProps> = ({ children }) => {
  const getSecureApplicationData = async (applicationId: string, accessLevel: string = 'summary') => {
    try {
      const { data, error } = await supabase.rpc('get_secure_application_data', {
        application_id: applicationId
      });

      if (error) {
        console.error('Error fetching secure application data:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch secure application data:', error);
      throw error;
    }
  };

  const maskSensitiveData = async (data: string, type: 'email' | 'phone' | 'name' | 'ssn' | 'ein') => {
    try {
      const { data: maskedData, error } = await supabase.rpc('mask_sensitive_data', {
        data_value: data,
        data_type: type
      });

      if (error) {
        console.error('Error masking sensitive data:', error);
        return '***ERROR***';
      }

      return maskedData || '***MASKED***';
    } catch (error) {
      console.error('Failed to mask sensitive data:', error);
      return '***ERROR***';
    }
  };

  const enforceDataRetention = async () => {
    try {
      const { data, error } = await supabase.rpc('enforce_data_retention');

      if (error) {
        console.error('Error enforcing data retention:', error);
        throw error;
      }

      return data || 0;
    } catch (error) {
      console.error('Failed to enforce data retention:', error);
      throw error;
    }
  };

  const value: SecureDataContextType = {
    getSecureApplicationData,
    maskSensitiveData,
    enforceDataRetention
  };

  return (
    <SecureDataContext.Provider value={value}>
      {children}
    </SecureDataContext.Provider>
  );
};

export const useSecureData = (): SecureDataContextType => {
  const context = useContext(SecureDataContext);
  if (!context) {
    throw new Error('useSecureData must be used within a SecureDataProvider');
  }
  return context;
};