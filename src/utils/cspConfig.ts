/**
 * Content Security Policy Configuration
 * Implements CSP headers to prevent XSS attacks
 */

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://zwqtewpycdbvjgkntejd.supabase.co',
    'https://*.lovable.app',
    'https://*.lovableproject.com',
    'blob:',
    'data:'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.lovable.app',
    'https://*.lovableproject.com'
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
    'https://*.lovableproject.com',
    'wss://zwqtewpycdbvjgkntejd.supabase.co',
    'blob:',
    'data:'
  ],
  'frame-ancestors': ["'self'", 'https://*.lovable.app', 'https://*.lovableproject.com'],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
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
