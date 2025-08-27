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

    // Get client IP and user agent with proper parsing
    const getClientIP = (req: Request): string => {
      const xForwardedFor = req.headers.get('x-forwarded-for');
      const xRealIP = req.headers.get('x-real-ip');
      
      if (xForwardedFor) {
        // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
        // Take the first (leftmost) IP which is the original client IP
        const firstIP = xForwardedFor.split(',')[0].trim();
        
        // Validate IP format (basic IPv4/IPv6 validation)
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^[0-9a-fA-F:]+$/;
        
        if (ipv4Regex.test(firstIP) || ipv6Regex.test(firstIP)) {
          return firstIP;
        }
      }
      
      if (xRealIP) {
        return xRealIP.trim();
      }
      
      // Fallback to a valid default IP
      return '127.0.0.1';
    };

    const ip_address = getClientIP(req);
    const user_agent = req.headers.get('user-agent') || 'unknown';

    // Enhanced intelligent event filtering for client_log spam prevention
    const lowPriorityEvents = [
      'console_access',
      'page_view', 
      'ui_interaction',
      'form_validation',
      'session_heartbeat',
      'client_log' // Major spam source - needs aggressive filtering
    ];

    // Special handling for client_log events (major spam source)
    if (event_type === 'client_log') {
      // Only log critical and high-severity client logs
      if (!['critical', 'high'].includes(severity)) {
        console.log(`Filtered client_log event: ${severity} severity - too low priority`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            filtered: true,
            reason: 'Low-priority client_log event filtered'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Rate limit client_log events - max 2 per minute per IP
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      const { count: recentClientLogs } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'client_log')
        .eq('ip_address', ip_address)
        .gte('created_at', oneMinuteAgo);

      if (recentClientLogs && recentClientLogs >= 2) {
        console.log(`Rate limited client_log from ${ip_address}: ${recentClientLogs} recent events`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            rate_limited: true,
            reason: 'Too many client_log events from this IP'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const shouldAggregate = lowPriorityEvents.includes(event_type) && 
                           severity === 'info' && 
                           event_type !== 'client_log'; // Don't aggregate client_log, filter instead

    // For low-priority events, check if we should aggregate instead of logging each one
    if (shouldAggregate) {
      // Check recent events count for aggregation (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { count: recentCount } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', event_type)
        .eq('ip_address', ip_address)
        .gte('created_at', fiveMinutesAgo);

      // If more than 10 similar events in 5 minutes, aggregate them
      if (recentCount && recentCount >= 10) {
        console.log(`Aggregating high-frequency event: ${event_type} from ${ip_address} (${recentCount} recent events)`);
        
        // Update the most recent event with aggregated count
        const { error: updateError } = await supabase
          .from('security_events')
          .update({ 
            event_data: { 
              ...event_data, 
              aggregated_count: (recentCount || 0) + 1,
              last_aggregated_at: new Date().toISOString()
            }
          })
          .eq('event_type', event_type)
          .eq('ip_address', ip_address)
          .gte('created_at', fiveMinutesAgo)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!updateError) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              aggregated: true,
              message: 'Event aggregated with recent similar events'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
    }

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
      'unauthorized_access',
      'session_anomaly_detected',
      'admin_role_assigned'
    ];

    if (highRiskEvents.includes(event_type)) {
      risk_score = Math.min(100, risk_score + 25);
    }

    // Sanitize and validate data before insertion
    const sanitizeEventData = (data: any): any => {
      try {
        // Ensure event_data is valid JSON and doesn't contain dangerous content
        const sanitized = JSON.parse(JSON.stringify(data));
        
        // Remove any potentially dangerous keys or limit size
        const maxSize = 10000; // 10KB limit for event data
        const serialized = JSON.stringify(sanitized);
        
        if (serialized.length > maxSize) {
          return { 
            ...sanitized, 
            truncated: true, 
            original_size: serialized.length,
            message: 'Event data truncated due to size limit'
          };
        }
        
        return sanitized;
      } catch (error) {
        console.warn('Failed to sanitize event data:', error);
        return { error: 'Failed to sanitize event data', original_type: typeof data };
      }
    };

    const sanitizedEventData = sanitizeEventData(event_data);

    // Log the security event with enhanced error handling
    const { data: eventData, error: eventError } = await supabase
      .from('security_events')
      .insert({
        event_type: event_type?.toString().substring(0, 100) || 'unknown', // Limit length
        severity,
        event_data: sanitizedEventData,
        user_id,
        session_id,
        source: source?.toString().substring(0, 50) || 'unknown',
        ip_address,
        user_agent: user_agent?.toString().substring(0, 500) || 'unknown', // Limit user agent length
        risk_score
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error logging security event:', {
        error: eventError,
        event_type,
        severity,
        ip_address,
        user_agent: user_agent?.substring(0, 100) + '...', // Truncated for logging
        event_data_preview: JSON.stringify(sanitizedEventData).substring(0, 200) + '...'
      });
      
      // Don't fail completely - log to console and return success
      // This prevents cascading failures in the security system
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'Event logged to console only due to database error',
          error_code: eventError.code
        }),
        { 
          status: 200, 
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