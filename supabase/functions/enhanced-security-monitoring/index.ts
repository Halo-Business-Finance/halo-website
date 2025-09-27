import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityMonitoringRequest {
  eventType: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  eventData: Record<string, any>;
  source: string;
  userId?: string;
}

interface ThreatDetectionRule {
  name: string;
  pattern: string;
  severity: string;
  action: 'log' | 'alert' | 'block';
  threshold: number;
  timeWindow: number; // minutes
}

const threatDetectionRules: ThreatDetectionRule[] = [
  {
    name: 'multiple_failed_logins',
    pattern: 'role_fetch_failed|login_failed|auth_failed',
    severity: 'high',
    action: 'block',
    threshold: 5,
    timeWindow: 15
  },
  {
    name: 'privilege_escalation_attempt',
    pattern: 'unauthorized_role_assignment|unauthorized_admin_access',
    severity: 'critical',
    action: 'block',
    threshold: 1,
    timeWindow: 60
  },
  {
    name: 'data_access_anomaly',
    pattern: 'unauthorized_pii_access|encryption_key_access_attempt',
    severity: 'high',
    action: 'alert',
    threshold: 3,
    timeWindow: 30
  },
  {
    name: 'session_anomaly',
    pattern: 'session_ip_mismatch|session_fingerprint_mismatch',
    severity: 'medium',
    action: 'alert',
    threshold: 2,
    timeWindow: 10
  }
];

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
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const { eventType, severity, eventData, source, userId }: SecurityMonitoringRequest = await req.json();

    // Validate required fields
    if (!eventType || !severity || !source) {
      return new Response('Missing required fields', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Enhanced threat detection
    const detectedThreats = await detectThreats(supabase, eventType, clientIP, userId);
    
    // Apply automated responses for detected threats
    for (const threat of detectedThreats) {
      await executeAutomatedResponse(supabase, threat, userId, clientIP);
    }

    // Log the security event with enhanced context
    const { error: logError } = await supabase.from('security_events').insert({
      event_type: eventType,
      severity,
      user_id: userId,
      ip_address: clientIP,
      user_agent: userAgent,
      event_data: {
        ...eventData,
        threats_detected: detectedThreats.length,
        detection_rules_triggered: detectedThreats.map(t => t.name),
        enhanced_monitoring: true,
        source_function: 'enhanced-security-monitoring'
      },
      source
    });

    if (logError) {
      console.error('Failed to log security event:', logError);
      return new Response('Failed to log security event', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Update security metrics
    await updateSecurityMetrics(supabase, severity, detectedThreats);

    return new Response(JSON.stringify({
      success: true,
      threatsDetected: detectedThreats.length,
      automatedActionsExecuted: detectedThreats.filter(t => t.action !== 'log').length,
      eventLogged: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Security monitoring error:', error);
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function detectThreats(
  supabase: any, 
  eventType: string, 
  clientIP: string, 
  userId?: string
): Promise<ThreatDetectionRule[]> {
  const detectedThreats: ThreatDetectionRule[] = [];

  for (const rule of threatDetectionRules) {
    try {
      // Check if event matches pattern
      const regex = new RegExp(rule.pattern, 'i');
      if (!regex.test(eventType)) continue;

      // Count recent events matching the pattern
      const timeThreshold = new Date(Date.now() - rule.timeWindow * 60 * 1000);
      
      const { data: recentEvents, error } = await supabase
        .from('security_events')
        .select('id, created_at')
        .gte('created_at', timeThreshold.toISOString())
        .or(`ip_address.eq.${clientIP}${userId ? `,user_id.eq.${userId}` : ''}`);

      if (error) {
        console.error(`Error checking rule ${rule.name}:`, error);
        continue;
      }

      const matchingEvents = recentEvents?.filter((event: any) => 
        regex.test(event.event_type || '')
      ) || [];

      if (matchingEvents.length >= rule.threshold) {
        detectedThreats.push(rule);
      }
    } catch (error) {
      console.error(`Error processing threat detection rule ${rule.name}:`, error);
    }
  }

  return detectedThreats;
}

async function executeAutomatedResponse(
  supabase: any, 
  threat: ThreatDetectionRule, 
  userId?: string, 
  clientIP?: string
): Promise<void> {
  try {
    switch (threat.action) {
      case 'block':
        // Create security alert
        await supabase.from('security_alerts').insert({
          alert_type: 'automated_threat_response',
          priority: threat.severity,
          status: 'open',
          notes: `Automated block triggered by rule: ${threat.name}`,
          event_id: null
        });

        // Block user sessions if userId is available
        if (userId) {
          await supabase.from('user_sessions')
            .update({ is_active: false, security_level: 'blocked' })
            .eq('user_id', userId);
        }

        // Log the automated action
        await supabase.from('security_events').insert({
          event_type: 'automated_security_block',
          severity: 'critical',
          user_id: userId,
          ip_address: clientIP,
          event_data: {
            rule_name: threat.name,
            action_taken: 'block',
            automated: true
          },
          source: 'automated_response'
        });
        break;

      case 'alert':
        // Create high-priority security alert
        await supabase.from('security_alerts').insert({
          alert_type: 'automated_threat_detection',
          priority: threat.severity,
          status: 'open',
          notes: `Threat detected by rule: ${threat.name}`,
          event_id: null
        });
        break;

      case 'log':
        // Already logged by the main function
        break;
    }
  } catch (error) {
    console.error(`Error executing automated response for ${threat.name}:`, error);
  }
}

async function updateSecurityMetrics(
  supabase: any, 
  severity: string, 
  detectedThreats: ThreatDetectionRule[]
): Promise<void> {
  try {
    // Update real-time security metrics
    const metricData = {
      timestamp: new Date().toISOString(),
      threats_detected: detectedThreats.length,
      severity_level: severity,
      automated_responses: detectedThreats.filter(t => t.action !== 'log').length
    };

    await supabase.from('security_events').insert({
      event_type: 'security_metrics_update',
      severity: 'info',
      event_data: metricData,
      source: 'security_metrics'
    });
  } catch (error) {
    console.error('Error updating security metrics:', error);
  }
}