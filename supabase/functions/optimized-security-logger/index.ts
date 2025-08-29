import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityEventRequest {
  event_type: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  event_data?: Record<string, any>
  source?: string
  user_id?: string
  session_id?: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event_type, severity, event_data = {}, source = 'client', user_id, session_id }: SecurityEventRequest = await req.json()

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1'
    const userAgent = req.headers.get('user-agent') || 'Unknown'

    console.log('Processing security event:', { event_type, severity, source })

    // Check if we should log this event using the intelligent filtering
    const { data: shouldLog, error: filterError } = await supabase.rpc(
      'should_log_security_event', 
      {
        p_event_type: event_type,
        p_severity: severity,
        p_source: source
      }
    )

    if (filterError) {
      console.error('Error checking event filter:', filterError)
      // If filter check fails, default to logging critical/high events only
      if (!['critical', 'high'].includes(severity)) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            logged: false, 
            reason: 'filter_check_failed_defaulting_to_conservative' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }
    }

    // If filtering says no, skip logging
    if (shouldLog === false) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          logged: false, 
          reason: 'filtered_out_by_intelligent_filter' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Enhanced event data with security context
    const enhancedEventData = {
      ...event_data,
      client_ip: clientIP,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      security_context: {
        request_id: crypto.randomUUID(),
        source_verified: source !== 'client' || severity === 'critical',
        filtering_applied: true
      }
    }

    // Log the security event
    const { error: insertError } = await supabase
      .from('security_events')
      .insert({
        event_type,
        severity,
        user_id,
        session_id,
        ip_address: clientIP,
        user_agent: userAgent,
        event_data: enhancedEventData,
        source
      })

    if (insertError) {
      console.error('Failed to insert security event:', insertError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to log security event',
          logged: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // For critical events, also create an alert
    if (severity === 'critical') {
      const { error: alertError } = await supabase
        .from('security_alerts')
        .insert({
          alert_type: event_type,
          priority: 'critical',
          status: 'open',
          notes: `Critical security event detected: ${event_type}`
        })

      if (alertError) {
        console.error('Failed to create security alert:', alertError)
      } else {
        console.log('Created critical security alert for event:', event_type)
      }
    }

    console.log('Successfully logged security event:', event_type)

    return new Response(
      JSON.stringify({ 
        success: true, 
        logged: true,
        event_type,
        severity,
        filtered: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Security logger error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error in security logger',
        logged: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}

serve(handler)