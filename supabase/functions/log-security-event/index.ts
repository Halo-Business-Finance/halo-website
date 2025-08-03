import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { 
      event_type, 
      severity = 'info', 
      event_data = {}, 
      user_id = null,
      session_id = null,
      source = 'server'
    } = await req.json();

    // Get client IP and user agent
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    // Calculate risk score based on event type and severity
    let risk_score = 0;
    switch (severity) {
      case 'critical':
        risk_score = 100;
        break;
      case 'high':
        risk_score = 75;
        break;
      case 'medium':
        risk_score = 50;
        break;
      case 'low':
        risk_score = 25;
        break;
      default:
        risk_score = 10;
    }

    // Adjust risk score based on event type
    const highRiskEvents = [
      'failed_login_attempt',
      'suspicious_activity',
      'rate_limit_exceeded',
      'csrf_token_invalid',
      'injection_attempt',
      'unauthorized_access'
    ];

    if (highRiskEvents.includes(event_type)) {
      risk_score = Math.min(100, risk_score + 25);
    }

    // Log the security event
    const { data: eventData, error: eventError } = await supabase
      .from('security_events')
      .insert({
        event_type,
        severity,
        event_data,
        user_id,
        session_id,
        source,
        ip_address,
        user_agent,
        risk_score
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error logging security event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Failed to log security event' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if we need to create an audit log entry for critical events
    if (severity === 'critical' && user_id) {
      await supabase
        .from('audit_logs')
        .insert({
          user_id,
          action: 'security_event',
          resource: 'security',
          resource_id: eventData.id,
          new_values: { event_type, severity, risk_score },
          ip_address,
          user_agent
        });
    }

    console.log(`Security event logged: ${event_type} (${severity}) - Risk Score: ${risk_score}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventData.id,
        risk_score 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in log-security-event function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});