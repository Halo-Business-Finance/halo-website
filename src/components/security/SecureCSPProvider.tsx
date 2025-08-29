import React, { useEffect } from 'react';
import { contentSanitizer } from '@/utils/contentSanitizer';

interface SecureCSPProviderProps {
  children: React.ReactNode;
  enableStrictCSP?: boolean;
}

export const SecureCSPProvider: React.FC<SecureCSPProviderProps> = ({ 
  children, 
  enableStrictCSP = true 
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Generate nonces for inline scripts and styles
    const scriptNonce = contentSanitizer.generateSecureNonce();
    const styleNonce = contentSanitizer.generateSecureNonce();
    
    // Store nonces globally for components to use
    (window as any).__CSP_SCRIPT_NONCE__ = scriptNonce;
    (window as any).__CSP_STYLE_NONCE__ = styleNonce;

    if (enableStrictCSP) {
      // Create meta tag for Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${scriptNonce}' https://halobusinessfinance.com https://*.supabase.co`,
        `style-src 'self' 'unsafe-inline' 'nonce-${styleNonce}' https://fonts.googleapis.com`,
        `font-src 'self' https://fonts.gstatic.com`,
        `img-src 'self' data: https: blob:`,
        `connect-src 'self' https://*.supabase.co https://api.halobusinessfinance.com`,
        `frame-ancestors 'none'`,
        `form-action 'self'`,
        `base-uri 'self'`,
        `object-src 'none'`,
        `upgrade-insecure-requests`
      ].join('; ');
      
      // Only add if not already present
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        document.head.appendChild(cspMeta);
      }

      // Add additional security headers via meta tags
      const additionalHeaders = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' }
      ];

      additionalHeaders.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.httpEquiv = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    }

    // Security event logging for CSP violations
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      console.warn('CSP Violation detected:', {
        documentURI: event.documentURI,
        violatedDirective: event.violatedDirective,
        blockedURI: event.blockedURI,
        originalPolicy: event.originalPolicy
      });

      // Log to security monitoring if available
      if ((window as any).__SECURITY_LOGGER__) {
        (window as any).__SECURITY_LOGGER__.logEvent({
          type: 'csp_violation',
          severity: 'medium',
          data: {
            documentURI: event.documentURI,
            violatedDirective: event.violatedDirective,
            blockedURI: event.blockedURI
          }
        });
      }
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, [enableStrictCSP]);

  return <>{children}</>;
};

export default SecureCSPProvider;