import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body once
    const requestBody = await req.json()
    const { action } = requestBody

    if (action === 'optimize') {
      // Run the optimization function
      const { data, error } = await supabaseClient.rpc('optimize_security_events')
      
      if (error) {
        throw error
      }

      console.log(`Security optimization completed. Cleaned ${data} events.`)

      return new Response(
        JSON.stringify({
          success: true,
          cleaned_events: data,
          message: `Optimized security events. Removed ${data} duplicate entries.`
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    // Enhanced security event logging with intelligent rate limiting
    const { 
      event_type, 
      severity = 'info', 
      event_data = {}, 
      source = 'client',
      user_agent,
      ip_address 
    } = requestBody

    // Client IP detection
    const clientIP = ip_address || 
      req.headers.get('cf-connecting-ip') || 
      req.headers.get('x-real-ip') || 
      req.headers.get('x-forwarded-for')?.split(',')[0] || 
      '127.0.0.1'

    // Enhanced event data with context
    const enhancedEventData = {
      ...event_data,
      client_ip: clientIP,
      user_agent: user_agent || req.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      source_function: 'security-event-optimizer'
    }

    // Log with enhanced data
    const { data: insertResult, error: insertError } = await supabaseClient
      .from('security_events')
      .insert({
        event_type,
        severity,
        event_data: enhancedEventData,
        source,
        ip_address: clientIP,
        user_agent: user_agent || req.headers.get('user-agent')
      })

    if (insertError) {
      console.error('Failed to log security event:', insertError)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to log security event',
          details: insertError.message
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Security event logged successfully',
        event_id: insertResult?.[0]?.id
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )

  } catch (error) {
    console.error('Security event optimizer error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Security event processing failed',
        message: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
})