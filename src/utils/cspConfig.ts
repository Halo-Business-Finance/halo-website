/**
 * Content Security Policy Configuration
 * Implements CSP headers to prevent XSS attacks
 */

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for React DevTools
    'https://zwqtewpycdbvjgkntejd.supabase.co',
    'https://*.lovable.app'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled components
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.lovable.app'
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com'
  ],
  'connect-src': [
    "'self'",
    'https://zwqtewpycdbvjgkntejd.supabase.co',
    'https://*.lovable.app',
    'wss://zwqtewpycdbvjgkntejd.supabase.co'
  ],
  'frame-ancestors': ["'self'", 'https://*.lovable.app', 'https://*.lovableproject.com'], // Allow Lovable editor preview iframe while preventing untrusted framing
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [] // Upgrade HTTP to HTTPS
};

export function generateCSPHeader(): string {
  const directives = Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  return directives;
}

export function applyCSPMeta(): void {
  if (typeof document !== 'undefined') {
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = generateCSPHeader();
      document.head.appendChild(meta);
    }
  }
}
