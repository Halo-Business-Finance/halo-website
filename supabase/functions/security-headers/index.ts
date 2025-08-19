import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Comprehensive security headers for server-side implementation
    const securityHeaders = {
      // Content Security Policy - strict configuration
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.supabase.co https://zwqtewpycdbvjgkntejd.supabase.co",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.supabase.co https://zwqtewpycdbvjgkntejd.supabase.co wss://zwqtewpycdbvjgkntejd.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
        "block-all-mixed-content"
      ].join('; '),
      
      // HSTS - Force HTTPS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Prevent MIME sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Clickjacking protection
      'X-Frame-Options': 'DENY',
      
      // XSS protection
      'X-XSS-Protection': '1; mode=block',
      
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Permissions policy (formerly Feature Policy)
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'payment=()',
        'interest-cohort=()'
      ].join(', '),
      
      // Additional security headers
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-Download-Options': 'noopen',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // Cache control for security
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
      
      // Server information hiding
      'Server': 'HaloSecureServer/1.0',
      'X-Powered-By': 'HaloSecurity',
      
      // CORS headers
      ...corsHeaders
    }

    // Get request information for security logging
    const requestInfo = {
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent'),
      origin: req.headers.get('origin'),
      referer: req.headers.get('referer'),
      timestamp: new Date().toISOString()
    }

    // Security configuration based on environment
    const environment = Deno.env.get('ENVIRONMENT') || 'production'
    
    if (environment === 'development') {
      // Relaxed CSP for development
      securityHeaders['Content-Security-Policy'] = securityHeaders['Content-Security-Policy']
        .replace("'unsafe-inline'", "'unsafe-inline' 'unsafe-eval'")
        .replace("'self'", "'self' localhost:* 127.0.0.1:*")
    }

    // Log security headers request
    console.log('Security headers requested:', {
      ...requestInfo,
      environment,
      headersApplied: Object.keys(securityHeaders).length
    })

    return new Response(
      JSON.stringify({
        success: true,
        headers: securityHeaders,
        environment,
        timestamp: new Date().toISOString(),
        security_level: 'enhanced'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      }
    )

  } catch (error) {
    console.error('Security headers error:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to generate security headers',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})