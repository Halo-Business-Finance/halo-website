import { useEffect } from 'react';

/**
 * Simplified Security Headers Provider
 * Focuses on essential security headers without breaking Lovable functionality
 */
export const SimplifiedSecurityHeaders = () => {
  useEffect(() => {
    // Only apply security headers in production
    if (!import.meta.env.PROD) return;

    // Set essential security headers via meta tags for client-side applications
    const setSecurityHeaders = () => {
      // X-Content-Type-Options
      const noSniffMeta = document.createElement('meta');
      noSniffMeta.setAttribute('http-equiv', 'X-Content-Type-Options');
      noSniffMeta.content = 'nosniff';

      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.setAttribute('http-equiv', 'Referrer-Policy');
      referrerMeta.content = 'strict-origin-when-cross-origin';

      // X-Frame-Options - Allow for Lovable iframe functionality
      const frameMeta = document.createElement('meta');
      frameMeta.setAttribute('http-equiv', 'X-Frame-Options');
      frameMeta.content = 'SAMEORIGIN'; // Changed from DENY to allow Lovable

      // Only add if not already present
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        document.head.appendChild(noSniffMeta);
      }
      if (!document.querySelector('meta[http-equiv="Referrer-Policy"]')) {
        document.head.appendChild(referrerMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        document.head.appendChild(frameMeta);
      }
    };

    setSecurityHeaders();
  }, []);

  return null; // This component doesn't render anything
};