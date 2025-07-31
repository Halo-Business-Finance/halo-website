import { useEffect } from 'react';

// Security headers and CSP configuration
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://supabase.co https://*.supabase.co;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://supabase.co https://*.supabase.co wss://*.supabase.co;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(meta);

    // Set additional security headers via meta tags
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=()' }
    ];

    securityHeaders.forEach(header => {
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = header.name;
      metaTag.content = header.content;
      document.head.appendChild(metaTag);
    });

    // Enforce HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }

    // Disable right-click in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('keydown', (e) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
        }
      });
    }

    // Clean up on unmount
    return () => {
      document.head.removeChild(meta);
      securityHeaders.forEach(() => {
        const metaTags = document.querySelectorAll('meta[http-equiv]');
        metaTags.forEach(tag => {
          if (securityHeaders.some(h => tag.getAttribute('http-equiv') === h.name)) {
            document.head.removeChild(tag);
          }
        });
      });
    };
  }, []);

  return null;
};