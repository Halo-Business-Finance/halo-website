import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role for key rotation
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[Key Rotation] Starting encryption key rotation check...');

    // Check key health first
    const { data: healthData, error: healthError } = await supabase
      .rpc('check_encryption_key_health');

    if (healthError) {
      console.error('[Key Rotation] Health check failed:', healthError);
      // Continue with rotation even if health check fails
    } else {
      console.log('[Key Rotation] Key health status:', JSON.stringify(healthData));
    }

    // Execute key rotation
    const { data: rotationResult, error: rotationError } = await supabase
      .rpc('rotate_encryption_keys');

    if (rotationError) {
      console.error('[Key Rotation] Rotation failed:', rotationError);
      
      // Log failure event
      await supabase.from('security_events').insert({
        event_type: 'key_rotation_failed',
        severity: 'critical',
        event_data: {
          error: rotationError.message,
          timestamp: new Date().toISOString()
        },
        source: 'rotate-encryption-keys-function'
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: rotationError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[Key Rotation] Rotation completed:', JSON.stringify(rotationResult));

    // Clean up expired admin sessions as part of maintenance
    const { data: sessionCleanup, error: sessionError } = await supabase
      .rpc('cleanup_expired_admin_sessions');

    if (sessionError) {
      console.warn('[Key Rotation] Session cleanup warning:', sessionError);
    } else {
      console.log('[Key Rotation] Cleaned up expired sessions:', sessionCleanup);
    }

    // Clean up old security events
    const { data: eventCleanup, error: eventError } = await supabase
      .rpc('intelligent_security_event_cleanup');

    if (eventError) {
      console.warn('[Key Rotation] Event cleanup warning:', eventError);
    } else {
      console.log('[Key Rotation] Cleaned up security events:', eventCleanup);
    }

    return new Response(
      JSON.stringify({
        success: true,
        rotation: rotationResult,
        maintenance: {
          sessions_cleaned: sessionCleanup || 0,
          events_cleaned: eventCleanup || 0
        },
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[Key Rotation] Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});