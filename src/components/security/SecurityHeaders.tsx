import { useEffect } from 'react';

// Security headers and CSP configuration
export const SecurityHeaders = () => {
  useEffect(() => {
    // Generate nonce for inline scripts
    const nonce = btoa(Math.random().toString()).substring(0, 16);
    
    // Enhanced Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ');

    // Security Headers
    const securityHeaders = {
      'Content-Security-Policy': csp,
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'interest-cohort=()'
      ].join(', '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
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

    // Enforce HTTPS in production
    if (process.env.NODE_ENV === 'production' && location.protocol !== 'https:' && location.hostname !== 'localhost') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    // Enhanced developer tools protection
    if (process.env.NODE_ENV === 'production') {
      // Disable right-click context menu
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Disable common developer shortcuts
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'K') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          console.clear();
        }
      });

      // Detect dev tools opening
      let devtools = {open: false, orientation: null};
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.warn('Developer tools detected. Some features may be disabled for security.');
          }
        } else {
          devtools.open = false;
        }
      }, 500);
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