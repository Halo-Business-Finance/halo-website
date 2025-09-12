import { useEffect } from 'react';

// Security headers and CSP configuration
export const SecurityHeaders = () => {
  useEffect(() => {
    // Generate nonce for inline scripts
    const nonce = btoa(Math.random().toString()).substring(0, 16);
    
    // Security Headers - Updated for Lovable compatibility
    const securityHeaders = {
      'X-Frame-Options': 'ALLOWALL', // Allow embedding (Lovable preview, public site)
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'interest-cohort=()',
        'payment=(self)',
        'autoplay=()'
      ].join(', '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Permitted-Cross-Domain-Policies': 'none'
    };

    // Apply headers via meta tags for client-side
    Object.entries(securityHeaders).forEach(([name, value]) => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.remove();
      }
      
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = value;
      document.head.appendChild(meta);
    });

    // Store nonce for script validation
    (window as any).__security_nonce = nonce;

    // Enforce HTTPS in production - server-side only
    // REMOVED: Client-side environment detection is insecure

    // Development tools protection - using build-time detection
    const isProductionBuild = import.meta.env.PROD;
    
    if (isProductionBuild) {
      // Production-only security measures
      
      // Disable common developer shortcuts (less aggressive)
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I')
        ) {
          e.preventDefault();
        }
      });
    }

    return () => {
      // Cleanup on unmount
      Object.keys(securityHeaders).forEach(name => {
        const meta = document.querySelector(`meta[http-equiv="${name}"]`);
        if (meta) meta.remove();
      });
    };
  }, []);

  return null;
};