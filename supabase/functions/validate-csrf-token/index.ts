import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CSRFValidationRequest {
  token: string;
  sessionId?: string;
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

    const { token, sessionId }: CSRFValidationRequest = await req.json();
    
    if (!token) {
      throw new Error('Token is required');
    }

    // Retrieve and validate token from security configs
    const { data: tokenData, error: fetchError } = await supabase
      .from('security_configs')
      .select('*')
      .eq('config_key', `csrf_token_${token}`)
      .eq('is_active', true)
      .single();

    if (fetchError || !tokenData) {
      // Log failed validation attempt using optimized logger
      await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: 'csrf_token_validation_failed',
          severity: 'medium',
          event_data: {
            token_preview: token.substring(0, 8) + '...',
            reason: 'token_not_found',
            session_id: sessionId?.substring(0, 8) + '...' || null
          }
        }
      });
          session_id: sessionId?.substring(0, 8) + '...' || null
        },
        source: 'csrf_validation'
      });

      return new Response(JSON.stringify({ 
        isValid: false,
        reason: 'Invalid token'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const tokenConfig = tokenData.config_value;
    const currentTime = Date.now();

    // Check if token has expired
    if (currentTime > tokenConfig.expires) {
      // Deactivate expired token
      await supabase
        .from('security_configs')
        .update({ is_active: false })
        .eq('id', tokenData.id);

      await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: 'csrf_token_validation_failed',
          severity: 'low',
          event_data: {
            token_preview: token.substring(0, 8) + '...',
            reason: 'token_expired',
            expired_at: tokenConfig.expiresAt
          }
        }
      });
          expired_by_ms: currentTime - tokenConfig.expires
        },
        source: 'csrf_validation'
      });

      return new Response(JSON.stringify({ 
        isValid: false,
        reason: 'Token expired'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Validate session matching if provided
    if (sessionId && tokenConfig.sessionId && tokenConfig.sessionId !== sessionId) {
      await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: 'csrf_token_session_mismatch',
          severity: 'high',
          event_data: {
            token_preview: token.substring(0, 8) + '...',
            expected_session: tokenConfig.sessionId?.substring(0, 8) + '...',
            provided_session: sessionId?.substring(0, 8) + '...'
          }
        }
      });
          provided_session: sessionId.substring(0, 8) + '...'
        },
        source: 'csrf_validation'
      });

      return new Response(JSON.stringify({ 
        isValid: false,
        reason: 'Session mismatch'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Token is valid - mark as used (one-time use)
    await supabase
      .from('security_configs')
      .update({ 
        is_active: false,
        config_value: {
          ...tokenConfig,
          used_at: currentTime,
          used_ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      })
      .eq('id', tokenData.id);

    // Log successful validation using optimized logger
    await supabase.functions.invoke('security-event-optimizer', {
      body: {
        event_type: 'csrf_token_validated_successfully',
        severity: 'info',
        event_data: {
          token_preview: token.substring(0, 8) + '...',
          session_id: sessionId?.substring(0, 8) + '...' || null,
          validation_time: new Date().toISOString()
        }
      }
    });
        token_age_ms: currentTime - tokenConfig.created
      },
      source: 'csrf_validation'
    });

    console.log(`CSRF token validated successfully: ${token.substring(0, 8)}...`);

    return new Response(JSON.stringify({ 
      isValid: true,
      used: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in validate-csrf-token function:', error);
    
    return new Response(
      JSON.stringify({ 
        isValid: false,
        error: 'Validation failed',
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