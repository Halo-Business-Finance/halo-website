/**
 * Content Security Policy Implementation
 * Provides XSS protection and secure content loading
 */

export interface CSPConfig {
  // Control script sources
  scriptSrc: string[];
  // Control style sources  
  styleSrc: string[];
  // Control image sources
  imgSrc: string[];
  // Control font sources
  fontSrc: string[];
  // Control connection sources (XHR, WebSocket, EventSource)
  connectSrc: string[];
  // Control frame sources
  frameSrc: string[];
  // Control object sources (plugins)
  objectSrc: string[];
  // Control media sources
  mediaSrc: string[];
  // Control worker sources
  workerSrc: string[];
  // Control manifest sources
  manifestSrc: string[];
  // Base URI restriction
  baseUri: string[];
  // Form action restriction
  formAction: string[];
}

// Default secure CSP configuration for Halo Business Finance
export const defaultCSPConfig: CSPConfig = {
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for React development (should be removed in production)
    "https://zwqtewpycdbvjgkntejd.supabase.co",
    "https://*.lovable.dev",
    "https://vitejs.dev",
    // Add specific script hashes/nonces in production
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
    "https://fonts.googleapis.com",
    "https://*.lovable.dev"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "https://zwqtewpycdbvjgkntejd.supabase.co",
    "https://*.lovable.dev"
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "https://*.lovable.dev"
  ],
  connectSrc: [
    "'self'",
    "https://zwqtewpycdbvjgkntejd.supabase.co",
    "https://*.supabase.co",
    "https://*.lovable.dev",
    "wss://zwqtewpycdbvjgkntejd.supabase.co",
    // Allow local development
    "ws://localhost:*",
    "http://localhost:*",
    "https://localhost:*"
  ],
  frameSrc: [
    "'self'",
    "https://zwqtewpycdbvjgkntejd.supabase.co"
  ],
  objectSrc: ["'none'"], // Disable plugins for security
  mediaSrc: [
    "'self'",
    "https://zwqtewpycdbvjgkntejd.supabase.co"
  ],
  workerSrc: [
    "'self'",
    "blob:"
  ],
  manifestSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: [
    "'self'",
    "https://zwqtewpycdbvjgkntejd.supabase.co"
  ]
};

/**
 * Generate CSP header string from configuration
 */
export function generateCSPHeader(config: CSPConfig = defaultCSPConfig): string {
  const directives = [
    `default-src 'self'`,
    `script-src ${config.scriptSrc.join(' ')}`,
    `style-src ${config.styleSrc.join(' ')}`,
    `img-src ${config.imgSrc.join(' ')}`,
    `font-src ${config.fontSrc.join(' ')}`,
    `connect-src ${config.connectSrc.join(' ')}`,
    `frame-src ${config.frameSrc.join(' ')}`,
    `object-src ${config.objectSrc.join(' ')}`,
    `media-src ${config.mediaSrc.join(' ')}`,
    `worker-src ${config.workerSrc.join(' ')}`,
    `manifest-src ${config.manifestSrc.join(' ')}`,
    `base-uri ${config.baseUri.join(' ')}`,
    `form-action ${config.formAction.join(' ')}`,
    // Additional security directives
    `frame-ancestors 'self' https://*.lovable.app`, // Allow embedding in Lovable editor while preventing unauthorized framing
    `upgrade-insecure-requests`, // Upgrade HTTP to HTTPS
    `block-all-mixed-content` // Block mixed HTTP/HTTPS content
  ];

  return directives.join('; ');
}

/**
 * Apply CSP to document (for client-side enforcement)
 */
export function applyCSPToDocument(config: CSPConfig = defaultCSPConfig): void {
  // Check if CSP meta tag already exists
  const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCSP) {
    console.warn('CSP meta tag already exists, not overriding');
    return;
  }

  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCSPHeader(config);
  document.head.appendChild(meta);

  console.log('CSP applied:', meta.content);
}

/**
 * Security headers configuration for enhanced protection
 */
export const securityHeaders = {
  // Prevent XSS attacks
  'X-Content-Type-Options': 'nosniff',
  // Allow same-origin framing so Lovable preview can embed the app
  'X-Frame-Options': 'SAMEORIGIN',
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  // Require HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions policy (replace Feature-Policy)
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site'
};

/**
 * Validate if a URL is allowed by CSP
 */
export function isURLAllowed(url: string, directive: keyof CSPConfig, config: CSPConfig = defaultCSPConfig): boolean {
  const allowedSources = config[directive];
  
  // Check for exact matches
  if (allowedSources.includes(url)) return true;
  
  // Check for self
  if (allowedSources.includes("'self'") && url.startsWith(window.location.origin)) return true;
  
  // Check for wildcard matches
  for (const source of allowedSources) {
    if (source.includes('*')) {
      const pattern = source.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(url)) return true;
    }
  }
  
  return false;
}

/**
 * Initialize CSP and security headers
 */
export function initializeSecurity(): void {
  // Apply CSP
  applyCSPToDocument();
  
  // Log security initialization
  console.log('[SECURITY] Content Security Policy initialized');
  
  // Set up security monitoring
  window.addEventListener('securitypolicyviolation', (event) => {
    console.error('[CSP VIOLATION]', {
      directive: event.violatedDirective,
      blocked: event.blockedURI,
      source: event.sourceFile,
      line: event.lineNumber,
      column: event.columnNumber
    });
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send CSP violation to monitoring service
      fetch('/api/security/csp-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directive: event.violatedDirective,
          blocked: event.blockedURI,
          source: event.sourceFile,
          timestamp: Date.now()
        })
      }).catch(console.error);
    }
  });
}

// Auto-initialize security when module is loaded
if (typeof window !== 'undefined') {
  // Delay initialization to ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurity);
  } else {
    initializeSecurity();
  }
}