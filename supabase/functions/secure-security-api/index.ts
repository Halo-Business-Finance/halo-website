import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityDataRequest {
  action: 'get_events' | 'get_alerts' | 'get_dashboard_metrics' | 'update_alert_status' | 'get_user_sessions';
  filters?: {
    severity?: string;
    event_type?: string;
    limit?: number;
    offset?: number;
    user_id?: string;
    time_range?: string;
  };
  alert_id?: string;
  new_status?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      console.log('No authorization header provided')
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user's JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authorization.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.log('Invalid token or user not found:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check user role using our secure function
    const { data: userRole, error: roleError } = await supabase
      .rpc('get_user_role', { _user_id: user.id })

    if (roleError) {
      console.log('Error getting user role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Only allow admin and moderator access
    if (!['admin', 'moderator'].includes(userRole)) {
      console.log(`Access denied for user role: ${userRole}`)
      
      // Log unauthorized access attempt using optimized logger
      await supabase.functions.invoke('security-event-optimizer', {
        body: {
          event_type: 'unauthorized_security_api_access',
          severity: 'high',
          event_data: {
            user_id: user.id,
            user_role: userRole,
            attempted_access: 'security_api',
            ip_address: req.headers.get('cf-connecting-ip') || 'unknown'
          }
        }
      });

      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestData: SecurityDataRequest = await req.json()
    console.log(`Security API request from ${userRole}: ${requestData.action}`)

    // Log all security API access using optimized logger
    await supabase.functions.invoke('security-event-optimizer', {
      body: {
        event_type: 'security_api_access',
        severity: 'info',
        event_data: {
          user_id: user.id,
          user_role: userRole,
          action: requestData.action,
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown'
        }
      }
    });

    let responseData = null

    switch (requestData.action) {
      case 'get_events': {
        let query = supabase
          .from('security_events')
          .select('id, event_type, severity, created_at, user_id, source, risk_score')
          .order('created_at', { ascending: false })

        // Apply filters securely
        if (requestData.filters?.severity) {
          query = query.eq('severity', requestData.filters.severity)
        }
        if (requestData.filters?.event_type) {
          query = query.eq('event_type', requestData.filters.event_type)
        }
        if (requestData.filters?.time_range) {
          const hours = parseInt(requestData.filters.time_range) || 24
          const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
          query = query.gte('created_at', timeThreshold)
        }

        // Limit results to prevent data exposure
        const limit = Math.min(requestData.filters?.limit || 50, 100)
        query = query.limit(limit)

        if (requestData.filters?.offset) {
          query = query.range(requestData.filters.offset, requestData.filters.offset + limit - 1)
        }

        const { data: events, error } = await query

        if (error) {
          console.log('Error fetching security events:', error)
          throw error
        }

        // Sanitize sensitive data - remove IP addresses and detailed event data
        responseData = events?.map(event => ({
          ...event,
          // Only include safe fields, exclude event_data, ip_address, user_agent
          event_data: userRole === 'admin' ? 'REDACTED_FOR_SECURITY' : null
        })) || []
        break
      }

      case 'get_alerts': {
        let query = supabase
          .from('security_alerts')
          .select('id, alert_type, priority, status, created_at, updated_at, notes')
          .order('created_at', { ascending: false })

        if (requestData.filters?.limit) {
          query = query.limit(Math.min(requestData.filters.limit, 50))
        } else {
          query = query.limit(20)
        }

        const { data: alerts, error } = await query

        if (error) {
          console.log('Error fetching security alerts:', error)
          throw error
        }

        responseData = alerts || []
        break
      }

      case 'get_dashboard_metrics': {
        // Fetch aggregated metrics without exposing raw data
        const now = new Date()
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

        const [
          { count: totalEvents },
          { count: criticalEvents },
          { count: openAlerts }
        ] = await Promise.all([
          supabase.from('security_events').select('*', { count: 'exact', head: true }).gte('created_at', last24Hours),
          supabase.from('security_events').select('*', { count: 'exact', head: true }).eq('severity', 'critical').gte('created_at', last7Days),
          supabase.from('security_alerts').select('*', { count: 'exact', head: true }).eq('status', 'open')
        ])

        // Get active sessions count through secure function
        const { data: sessionOverview, error: sessionError } = await supabase
          .rpc('get_session_overview_admin')
        
        const activeSessions = sessionError ? 0 : sessionOverview?.filter((s: any) => s.is_active)?.length || 0

        responseData = {
          events_24h: totalEvents || 0,
          critical_events_7d: criticalEvents || 0,
          open_alerts: openAlerts || 0,
          active_sessions: activeSessions || 0,
          last_updated: now.toISOString()
        }
        break
      }

      case 'update_alert_status': {
        if (!requestData.alert_id || !requestData.new_status) {
          return new Response(
            JSON.stringify({ error: 'Missing alert_id or new_status' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const { data, error } = await supabase
          .from('security_alerts')
          .update({ 
            status: requestData.new_status,
            updated_at: new Date().toISOString(),
            assigned_to: user.id
          })
          .eq('id', requestData.alert_id)
          .select()

        if (error) {
          console.log('Error updating alert status:', error)
          throw error
        }

        responseData = { success: true, updated_alert: data?.[0] }
        break
      }

      case 'get_user_sessions': {
        // Only admins can view user sessions
        if (userRole !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Admin access required for user sessions' }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Use secure function that masks sensitive data
        const { data: sessions, error } = await supabase
          .rpc('get_session_overview_admin')

        if (error) {
          console.log('Error fetching user sessions:', error)
          throw error
        }

        // Sanitize session data - never expose tokens or detailed fingerprints
        responseData = sessions?.map((session: any) => ({
          ...session,
          // Remove any sensitive session data
          session_token: 'HIDDEN',
          session_token_hash: 'HIDDEN',
          token_salt: 'HIDDEN',
          client_fingerprint: session.security_level === 'high' ? 'PRESENT' : 'NONE'
        })) || []
        break
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData,
        metadata: {
          user_role: userRole,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Security API error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})