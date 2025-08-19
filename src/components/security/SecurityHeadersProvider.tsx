import { useEffect } from 'react';

export const SecurityHeadersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Set up Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.supabase.co https://zwqtewpycdbvjgkntejd.supabase.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.supabase.co https://zwqtewpycdbvjgkntejd.supabase.co wss://zwqtewpycdbvjgkntejd.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    // Remove existing CSP meta tag if present
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCsp) {
      existingCsp.remove();
    }
    
    document.head.appendChild(cspMeta);

    // Set additional security headers via meta tags where possible
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      
      // Remove existing header if present
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(meta);
    });

    // Set up Strict Transport Security via meta (note: this is less effective than server headers)
    const hstsMeta = document.createElement('meta');
    hstsMeta.httpEquiv = 'Strict-Transport-Security';
    hstsMeta.content = 'max-age=31536000; includeSubDomains; preload';
    
    const existingHsts = document.querySelector('meta[http-equiv="Strict-Transport-Security"]');
    if (existingHsts) {
      existingHsts.remove();
    }
    
    document.head.appendChild(hstsMeta);

    // Cleanup function
    return () => {
      // Remove security headers on unmount (optional)
      securityHeaders.forEach(({ name }) => {
        const existing = document.querySelector(`meta[http-equiv="${name}"]`);
        if (existing) {
          existing.remove();
        }
      });
    };
  }, []);

  return <>{children}</>;
};