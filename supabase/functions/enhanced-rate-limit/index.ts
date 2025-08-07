import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitRequest {
  endpoint: string;
  identifier: string;
  action?: string;
}

interface RateLimitConfig {
  max_requests: number;
  window_seconds: number;
  block_duration_seconds: number;
}

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { endpoint, identifier, action = 'access' }: RateLimitRequest = await req.json();
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';

    console.log(`Rate limit check for endpoint: ${endpoint}, identifier: ${identifier}, IP: ${clientIP}`);

    // Get rate limit configuration for this endpoint
    const { data: config, error: configError } = await supabase
      .from('rate_limit_configs')
      .select('max_requests, window_seconds, block_duration_seconds')
      .eq('endpoint', endpoint)
      .eq('is_active', true)
      .maybeSingle();

    if (configError) {
      console.error('Error fetching rate limit config:', configError);
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          message: 'Rate limiting unavailable',
          attempts: 0,
          resetTime: null 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Use default config if none found
    const rateLimitConfig: RateLimitConfig = config || {
      max_requests: 100,
      window_seconds: 3600,
      block_duration_seconds: 3600
    };

    const windowStart = new Date(Date.now() - (rateLimitConfig.window_seconds * 1000));

    // Count recent attempts for this identifier and endpoint
    const { data: recentAttempts, error: attemptsError } = await supabase
      .from('security_events')
      .select('id, created_at, event_data')
      .eq('event_type', 'rate_limit_attempt')
      .gte('created_at', windowStart.toISOString())
      .or(`event_data->>identifier.eq.${identifier},ip_address.eq.${clientIP}`)
      .eq('event_data->>endpoint', endpoint);

    if (attemptsError) {
      console.error('Error checking recent attempts:', attemptsError);
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          message: 'Rate limiting check failed',
          attempts: 0,
          resetTime: null 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const attemptCount = recentAttempts?.length || 0;
    const isBlocked = attemptCount >= rateLimitConfig.max_requests;

    // Log this rate limit attempt
    const { error: logError } = await supabase
      .from('security_events')
      .insert({
        event_type: 'rate_limit_attempt',
        severity: isBlocked ? 'high' : 'info',
        ip_address: clientIP,
        event_data: {
          endpoint,
          identifier,
          action,
          attempt_count: attemptCount + 1,
          max_requests: rateLimitConfig.max_requests,
          window_seconds: rateLimitConfig.window_seconds,
          blocked: isBlocked
        },
        source: 'server'
      });

    if (logError) {
      console.error('Error logging rate limit attempt:', logError);
    }

    // If blocked, also log a rate limit exceeded event
    if (isBlocked) {
      const { error: blockLogError } = await supabase
        .from('security_events')
        .insert({
          event_type: 'rate_limit_exceeded',
          severity: 'high',
          ip_address: clientIP,
          event_data: {
            endpoint,
            identifier,
            action,
            attempt_count: attemptCount + 1,
            max_requests: rateLimitConfig.max_requests,
            window_seconds: rateLimitConfig.window_seconds,
            block_duration_seconds: rateLimitConfig.block_duration_seconds
          },
          source: 'server'
        });

      if (blockLogError) {
        console.error('Error logging rate limit exceeded:', blockLogError);
      }
    }

    const resetTime = new Date(Date.now() + (rateLimitConfig.window_seconds * 1000));

    return new Response(
      JSON.stringify({
        allowed: !isBlocked,
        attempts: attemptCount + 1,
        maxAttempts: rateLimitConfig.max_requests,
        resetTime: resetTime.toISOString(),
        blockDuration: isBlocked ? rateLimitConfig.block_duration_seconds : null,
        message: isBlocked ? 
          `Rate limit exceeded. Try again in ${Math.ceil(rateLimitConfig.block_duration_seconds / 60)} minutes.` :
          'Request allowed'
      }),
      { 
        status: isBlocked ? 429 : 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitConfig.max_requests.toString(),
          'X-RateLimit-Remaining': Math.max(0, rateLimitConfig.max_requests - attemptCount - 1).toString(),
          'X-RateLimit-Reset': resetTime.getTime().toString()
        }
      }
    );
  } catch (error) {
    console.error('Enhanced rate limiting error:', error);
    
    return new Response(
      JSON.stringify({ 
        allowed: true, 
        message: 'Rate limiting service error',
        attempts: 0,
        resetTime: null 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}