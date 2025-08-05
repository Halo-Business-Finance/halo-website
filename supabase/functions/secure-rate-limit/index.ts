import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitRequest {
  identifier: string;
  action: string;
  limit: number;
  windowMs: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { identifier, action, limit, windowMs }: RateLimitRequest = await req.json();

    // Get client IP for additional tracking
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Calculate window start time
    const windowStart = new Date(Date.now() - windowMs);
    const rateLimitKey = `${identifier}:${action}`;

    // Check current rate limit status
    const { data: existingAttempts, error: fetchError } = await supabase
      .from('security_events')
      .select('id')
      .eq('event_type', 'rate_limit_attempt')
      .eq('source', rateLimitKey)
      .gte('created_at', windowStart.toISOString());

    if (fetchError) {
      console.error('Error fetching rate limit data:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Rate limit check failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const currentAttempts = existingAttempts?.length || 0;
    const isBlocked = currentAttempts >= limit;

    // Log this rate limit check
    const { error: logError } = await supabase
      .from('security_events')
      .insert({
        event_type: 'rate_limit_attempt',
        severity: isBlocked ? 'high' : 'info',
        source: rateLimitKey,
        event_data: {
          identifier,
          action,
          currentAttempts,
          limit,
          windowMs,
          clientIP,
          blocked: isBlocked
        },
        ip_address: clientIP,
        risk_score: isBlocked ? 75 : 25
      });

    if (logError) {
      console.error('Error logging rate limit event:', logError);
    }

    // If blocked, log additional security event
    if (isBlocked) {
      await supabase
        .from('security_events')
        .insert({
          event_type: 'rate_limit_exceeded',
          severity: 'high',
          source: rateLimitKey,
          event_data: {
            identifier,
            action,
            attemptsInWindow: currentAttempts,
            limit,
            clientIP
          },
          ip_address: clientIP,
          risk_score: 85
        });
    }

    return new Response(
      JSON.stringify({
        allowed: !isBlocked,
        currentAttempts,
        limit,
        resetTime: Date.now() + windowMs,
        blocked: isBlocked
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in secure rate limit:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit service error',
        allowed: false // Fail securely by blocking
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});