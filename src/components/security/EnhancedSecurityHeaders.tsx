import { useEffect } from 'react';

interface SecurityHeadersConfig {
  enableHSTS?: boolean;
  enableCSP?: boolean;
  enableReferrerPolicy?: boolean;
  enablePermissionsPolicy?: boolean;
  customCSP?: string;
}

export const useSecurityHeaders = (config: SecurityHeadersConfig = {}) => {
  const {
    enableHSTS = true,
    enableCSP = true,
    enableReferrerPolicy = true,
    enablePermissionsPolicy = true,
    customCSP
  } = config;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const headers: Array<{ name: string; content: string }> = [];

    // HTTP Strict Transport Security
    if (enableHSTS && window.location.protocol === 'https:') {
      headers.push({
        name: 'Strict-Transport-Security',
        content: 'max-age=31536000; includeSubDomains; preload'
      });
    }

    // Content Security Policy
    if (enableCSP) {
      const cspContent = customCSP || [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://*.supabase.co https://halobusinessfinance.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://api.halobusinessfinance.com",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'"
      ].join('; ');

      headers.push({
        name: 'Content-Security-Policy',
        content: cspContent
      });
    }

    // Referrer Policy
    if (enableReferrerPolicy) {
      headers.push({
        name: 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin'
      });
    }

    // Permissions Policy
    if (enablePermissionsPolicy) {
      headers.push({
        name: 'Permissions-Policy',
        content: 'camera=(), microphone=(), geolocation=(), payment=()'
      });
    }

    // Additional security headers
    const additionalHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
      { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' }
    ];

    headers.push(...additionalHeaders);

    // Apply headers via meta tags (where possible)
    headers.forEach(({ name, content }) => {
      const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Log security headers application
    console.info('Security headers applied:', headers.map(h => h.name));

  }, [enableHSTS, enableCSP, enableReferrerPolicy, enablePermissionsPolicy, customCSP]);
};

export const EnhancedSecurityHeaders = (props: SecurityHeadersConfig) => {
  useSecurityHeaders(props);
  return null;
};