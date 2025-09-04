import React, { ReactNode } from 'react';
import { EnhancedSecurityProvider } from './EnhancedSecurityProvider';
import { ProductionSecurityProvider } from './ProductionSecurityProvider';

interface OptimizedSecurityProviderProps {
  children: ReactNode;
}

/**
 * Optimized Security Provider that combines essential security features
 * while reducing overhead and excessive logging
 */
export const OptimizedSecurityProvider = ({ children }: OptimizedSecurityProviderProps) => {
  // Only enable comprehensive security monitoring in production
  if (import.meta.env.PROD) {
    return (
      <ProductionSecurityProvider>
        <EnhancedSecurityProvider>
          {children}
        </EnhancedSecurityProvider>
      </ProductionSecurityProvider>
    );
  }

  // In development, use minimal security overhead
  return <>{children}</>;
};