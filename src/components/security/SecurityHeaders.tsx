import { useEffect } from 'react';

// Security headers and CSP configuration
export const SecurityHeaders = () => {
  useEffect(() => {
    // Generate nonce for inline scripts
    const nonce = btoa(Math.random().toString()).substring(0, 16);
    
    // Enhanced Content Security Policy - Tightened for security
    const csp = [
      "default-src 'self'",
      "script-src 'self' https://zwqtewpycdbvjgkntejd.supabase.co https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://zwqtewpycdbvjgkntejd.supabase.co https://*.supabase.co https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev",
      "upgrade-insecure-requests"
    ].join('; ');

    // Security Headers - Updated for Lovable compatibility
    const securityHeaders = {
      'Content-Security-Policy': csp,
      'X-Frame-Options': 'SAMEORIGIN', // Changed from DENY to allow Lovable iframe
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