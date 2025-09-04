import React, { ReactNode } from 'react';

interface OptimizedSecurityProviderProps {
  children: ReactNode;
}

/**
 * Simplified Security Provider to prevent blank page issues
 */
export const OptimizedSecurityProvider = ({ children }: OptimizedSecurityProviderProps) => {
  // Simplified provider that just passes through children
  // Security components were causing blank pages due to missing dependencies
  return <>{children}</>;
};