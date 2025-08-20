import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CSRFTokenRequest {
  sessionId?: string;
  timestamp: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionId, timestamp }: CSRFTokenRequest = await req.json();
    
    // Validate timestamp (prevent replay attacks)
    const currentTime = Date.now();
    const timeDiff = Math.abs(currentTime - timestamp);
    
    if (timeDiff > 60000) { // 1 minute tolerance
      throw new Error('Timestamp too old or too far in future');
    }

    // Generate cryptographically secure token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Store token with expiration in security configs
    const { error: storeError } = await supabase
      .from('security_configs')
      .insert({
        config_key: `csrf_token_${token}`,
        config_value: {
          token,
          sessionId: sessionId || null,
          created: currentTime,
          expires: currentTime + (30 * 60 * 1000), // 30 minutes
          ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        },
        is_active: true
      });

    if (storeError) {
      console.error('Failed to store CSRF token:', storeError);
      throw new Error('Failed to generate secure token');
    }

    // Log token generation for security monitoring using optimized logger
    await supabase.functions.invoke('security-event-optimizer', {
      body: {
        event_type: 'csrf_token_generated',
        severity: 'info',
        event_data: {
          token_id: token.substring(0, 8) + '...',
          session_id: sessionId?.substring(0, 8) + '...' || null,
          expires_at: expiresAt.toISOString()
        }
      }
    });
        expires_in_minutes: 30
      },
      source: 'csrf_generation'
    });

    console.log(`CSRF token generated successfully: ${token.substring(0, 8)}...`);

    return new Response(JSON.stringify({ 
      token,
      expires: currentTime + (30 * 60 * 1000)
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in generate-csrf-token function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate CSRF token',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);