import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SecurityHeaders } from './SecurityHeaders';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isProductionMode: boolean;
  enableDebugMode: boolean;
  securityLevel: 'development' | 'staging' | 'production';
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface ProductionSecurityProviderProps {
  children: ReactNode;
}

export const ProductionSecurityProvider: React.FC<ProductionSecurityProviderProps> = ({ 
  children 
}) => {
  const { toast } = useToast();
  const isProductionMode = import.meta.env.PROD;
  
  // Determine security level based on environment
  const securityLevel = isProductionMode ? 'production' : 'development';
  
  // Only enable debug mode in development
  const enableDebugMode = !isProductionMode;

  useEffect(() => {
    // Production security hardening
    if (isProductionMode) {
      // Disable eval for security
      try {
        (window as any).eval = () => {
          throw new Error('eval is disabled for security reasons');
        };
      } catch (e) {
        // eval might already be disabled
      }

      // Remove development tools from window object
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;

      // Monitor for unauthorized access attempts
      const securityMonitor = () => {
        // Check for suspicious global variables
        const suspiciousGlobals = ['webpackJsonp', '__webpack_require__'];
        for (const global of suspiciousGlobals) {
          if ((window as any)[global]) {
            console.warn('[SECURITY] Potential unauthorized access detected');
            break;
          }
        }
      };

      // Run security monitor every 30 seconds in production
      const monitorInterval = setInterval(securityMonitor, 30000);

      return () => clearInterval(monitorInterval);
    }
  }, [isProductionMode]);

  const contextValue: SecurityContextType = {
    isProductionMode,
    enableDebugMode,
    securityLevel
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      <SecurityHeaders />
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a ProductionSecurityProvider');
  }
  return context;
};

/**
 * Higher-order component to conditionally render components based on security level
 */
export const withSecurityLevel = <P extends object>(
  Component: React.ComponentType<P>,
  requiredLevel: 'development' | 'staging' | 'production' = 'development'
) => {
  return (props: P) => {
    const { securityLevel } = useSecurity();
    
    // Only render if security level matches or is less restrictive
    const levelHierarchy = { development: 0, staging: 1, production: 2 };
    const currentLevel = levelHierarchy[securityLevel];
    const requiredLevelValue = levelHierarchy[requiredLevel];
    
    if (currentLevel >= requiredLevelValue) {
      return <Component {...props} />;
    }
    
    return null;
  };
};