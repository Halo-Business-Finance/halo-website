import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionValidationRequest {
  deviceFingerprint: string;
  timestamp: number;
}

interface SessionValidationResponse {
  valid: boolean;
  reason?: string;
  actions?: string[];
  securityLevel: 'normal' | 'enhanced' | 'critical';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        valid: false,
        reason: 'No authorization header',
        securityLevel: 'critical'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user.user) {
      return new Response(JSON.stringify({
        valid: false,
        reason: 'Invalid or expired token',
        securityLevel: 'critical'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validationData: SessionValidationRequest = await req.json();
    
    let valid = true;
    let reason = '';
    const actions: string[] = [];
    let securityLevel: 'normal' | 'enhanced' | 'critical' = 'normal';

    // Check active session in database
    const { data: activeSessions, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (sessionError || !activeSessions || activeSessions.length === 0) {
      valid = false;
      reason = 'No active session found';
      securityLevel = 'critical';
    } else {
      // Validate device fingerprint
      const currentSession = activeSessions.find(s => 
        s.client_fingerprint === validationData.deviceFingerprint
      );

      if (!currentSession) {
        // Check if this is a known device
        const { data: knownDevices } = await supabase
          .from('user_sessions')
          .select('client_fingerprint')
          .eq('user_id', user.user.id)
          .eq('client_fingerprint', validationData.deviceFingerprint)
          .limit(1);

        if (!knownDevices || knownDevices.length === 0) {
          valid = false;
          reason = 'Unknown device fingerprint';
          securityLevel = 'critical';
          actions.push('Device verification required');
        } else {
          // Known device but no active session - require re-authentication
          valid = false;
          reason = 'Session expired for this device';
          securityLevel = 'enhanced';
          actions.push('Re-authentication required');
        }
      } else {
        // Session exists - check for security anomalies
        const sessionAge = Date.now() - new Date(currentSession.created_at).getTime();
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge > maxSessionAge) {
          valid = false;
          reason = 'Session too old';
          securityLevel = 'enhanced';
          actions.push('Session refresh required');
        }

        // Check for suspicious activity patterns
        const { data: recentEvents } = await supabase
          .from('security_events')
          .select('event_type, severity, created_at, ip_address')
          .eq('user_id', user.user.id)
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
          .order('created_at', { ascending: false });

        if (recentEvents && recentEvents.length > 0) {
          const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
          const highEvents = recentEvents.filter(e => e.severity === 'high').length;
          const uniqueIPs = [...new Set(recentEvents.map(e => e.ip_address))].length;

          if (criticalEvents > 0) {
            valid = false;
            reason = 'Critical security events detected';
            securityLevel = 'critical';
            actions.push('Immediate security review required');
          } else if (highEvents > 3) {
            securityLevel = 'enhanced';
            actions.push('Enhanced monitoring active');
          } else if (uniqueIPs > 2) {
            securityLevel = 'enhanced';
            actions.push('Multiple IP addresses detected');
          }

          // Check for rapid consecutive events (potential automated attacks)
          const eventTimes = recentEvents.map(e => new Date(e.created_at).getTime());
          const rapidEvents = eventTimes.filter((time, index) => 
            index > 0 && time - eventTimes[index - 1] < 1000 // Less than 1 second apart
          ).length;

          if (rapidEvents > 5) {
            valid = false;
            reason = 'Rapid consecutive events detected - potential automated attack';
            securityLevel = 'critical';
            actions.push('Account lockdown initiated');
          }
        }

        // Update session activity if valid
        if (valid) {
          await supabase
            .from('user_sessions')
            .update({ 
              last_activity: new Date().toISOString(),
              last_security_check: new Date().toISOString(),
              security_level: securityLevel
            })
            .eq('id', currentSession.id);
        }
      }
    }

    // Log session validation
    await supabase.from('security_events').insert({
      event_type: 'session_validation',
      user_id: user.user.id,
      severity: valid ? 'info' : 'medium',
      event_data: {
        valid,
        reason: reason || 'Session validation successful',
        securityLevel,
        actions,
        deviceFingerprint: validationData.deviceFingerprint,
        validationTimestamp: validationData.timestamp
      },
      source: 'session_validation'
    });

    const response: SessionValidationResponse = {
      valid,
      reason: valid ? undefined : reason,
      actions: actions.length > 0 ? actions : undefined,
      securityLevel
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Session validation error:', error);
    
    return new Response(JSON.stringify({
      valid: false,
      reason: 'Session validation system error',
      securityLevel: 'critical',
      actions: ['Contact system administrator']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);