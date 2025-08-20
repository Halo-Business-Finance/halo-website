import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateRequest {
  redirectUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { redirectUrl }: ValidateRequest = await req.json();

    if (!redirectUrl) {
      return new Response(
        JSON.stringify({ isValid: false, reason: 'No redirect URL provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Client-side URL validation to avoid database recursion issues
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      'halobusinessfinance.com',
      'lovable.dev',
      'lovable.app',
      'supabase.co'
    ];

    let isValid = false;
    let reason = 'Invalid domain';

    try {
      const url = new URL(redirectUrl);
      const hostname = url.hostname;
      
      // Check if domain is in allowed list or is a subdomain of allowed domains
      isValid = allowedDomains.some(domain => 
        hostname === domain || 
        hostname.endsWith('.' + domain)
      );

      if (!isValid) {
        reason = `Domain ${hostname} is not in allowed list`;
      }
    } catch (urlError) {
      isValid = false;
      reason = 'Invalid URL format';
    }

    // Log suspicious redirect attempts (but don't fail if logging fails)
    if (!isValid) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabaseClient.from('security_events').insert({
          event_type: 'suspicious_redirect_url_detected',
          severity: 'high',
          event_data: {
            attempted_url: redirectUrl,
            validation_reason: reason,
            user_agent: req.headers.get('user-agent') || 'unknown'
          },
          source: 'redirect_validation',
          ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        });
      } catch (logError) {
        console.warn('Failed to log security event:', logError);
      }
    }

    return new Response(
      JSON.stringify({ 
        isValid,
        redirectUrl: isValid ? redirectUrl : null,
        reason: isValid ? 'Valid domain' : reason
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Redirect validation error:', error);
    return new Response(
      JSON.stringify({ isValid: false, reason: 'Server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});