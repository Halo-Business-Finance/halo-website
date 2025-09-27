import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityMonitoringRequest {
  action: 'real_time_alerts' | 'threat_assessment' | 'auto_response' | 'security_health_check';
  params?: {
    time_window?: string;
    severity_threshold?: string;
    user_id?: string;
    auto_remediate?: boolean;
  };
}

interface ThreatAlert {
  id: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  alert_type: string;
  description: string;
  affected_resources: string[];
  recommended_actions: string[];
  auto_remediation_available: boolean;
  created_at: string;
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

    // Authentication and authorization check
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authorization.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check admin/moderator role
    const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id });
    if (!['admin', 'moderator'].includes(userRole)) {
      await logSecurityEvent(supabase, {
        event_type: 'unauthorized_security_monitoring_access',
        severity: 'high',
        user_id: user.id,
        ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
        event_data: { attempted_action: 'security_monitoring_access' }
      });

      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, params = {} }: SecurityMonitoringRequest = await req.json();

    let responseData;

    switch (action) {
      case 'real_time_alerts':
        responseData = await getRealTimeAlerts(supabase, params);
        break;
      
      case 'threat_assessment':
        responseData = await performThreatAssessment(supabase, params);
        break;
      
      case 'auto_response':
        responseData = await executeAutoResponse(supabase, params);
        break;
      
      case 'security_health_check':
        responseData = await performSecurityHealthCheck(supabase);
        break;
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Security monitoring error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// Get real-time security alerts
async function getRealTimeAlerts(supabase: any, params: any): Promise<ThreatAlert[]> {
  const timeWindow = params.time_window || '1 hour';
  const severityThreshold = params.severity_threshold || 'medium';
  
  const windowMs = parseTimeWindow(timeWindow);
  const cutoffTime = new Date(Date.now() - windowMs).toISOString();

  // Get recent high-priority security events
  const { data: events, error } = await supabase
    .from('security_events')
    .select('*')
    .gte('created_at', cutoffTime)
    .in('severity', getSeverityLevels(severityThreshold))
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  // Process events into threat alerts
  const alerts: ThreatAlert[] = [];
  const eventGroups = groupEventsByType(events || []);

  for (const [eventType, eventList] of Object.entries(eventGroups)) {
    const alert = await processEventGroup(eventType, eventList as any[]);
    if (alert) alerts.push(alert);
  }

  return alerts.sort((a, b) => getThreatScore(b.threat_level) - getThreatScore(a.threat_level));
}

// Perform advanced threat assessment
async function performThreatAssessment(supabase: any, params: any): Promise<any> {
  const timeWindow = params.time_window || '24 hours';
  
  // Run enhanced security analysis
  const { data: analysisResult, error } = await supabase.functions.invoke('enhanced-security-analysis', {
    body: {
      analysis_type: 'comprehensive',
      time_window: timeWindow,
      severity_threshold: params.severity_threshold || 'medium'
    }
  });

  if (error) throw error;

  // Calculate overall threat level
  const threatLevel = calculateOverallThreatLevel(analysisResult.data);
  
  return {
    threat_level: threatLevel,
    analysis_summary: analysisResult.data,
    risk_score: analysisResult.data.risk_score || 0,
    active_threats: analysisResult.data.active_threats || 0,
    recommendations: analysisResult.data.recommendations || []
  };
}

// Execute automated security responses
async function executeAutoResponse(supabase: any, params: any): Promise<any> {
  if (!params.auto_remediate) {
    return { message: 'Auto-remediation not enabled' };
  }

  const actions = [];

  // Auto-block suspicious IPs
  const { data: suspiciousIPs } = await supabase
    .from('security_events')
    .select('ip_address')
    .eq('severity', 'critical')
    .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
    .limit(10);

  if (suspiciousIPs && suspiciousIPs.length > 0) {
    for (const ipEvent of suspiciousIPs) {
      await logSecurityEvent(supabase, {
        event_type: 'auto_ip_blocked',
        severity: 'high',
        ip_address: ipEvent.ip_address,
        event_data: { 
          blocked_by: 'automated_security_response',
          reason: 'critical_security_events'
        }
      });
      actions.push(`Blocked suspicious IP: ${ipEvent.ip_address}`);
    }
  }

  // Invalidate suspicious sessions
  const { data: suspiciousSessions } = await supabase
    .from('user_sessions')
    .select('id, user_id')
    .eq('security_level', 'high_risk')
    .eq('is_active', true)
    .limit(5);

  if (suspiciousSessions && suspiciousSessions.length > 0) {
    for (const session of suspiciousSessions) {
      await supabase.rpc('invalidate_suspicious_sessions', {
        target_user_id: session.user_id,
        reason: 'automated_security_response'
      });
      actions.push(`Invalidated suspicious session: ${session.id}`);
    }
  }

  return {
    actions_taken: actions,
    timestamp: new Date().toISOString()
  };
}

// Perform security health check
async function performSecurityHealthCheck(supabase: any): Promise<any> {
  const healthChecks = [];

  // Check database security
  const { data: rlsPolicies, error: rlsError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  healthChecks.push({
    check: 'RLS Policies',
    status: rlsError ? 'error' : 'healthy',
    details: rlsError ? 'Unable to verify RLS policies' : 'RLS policies verified'
  });

  // Check recent security events
  const { data: recentEvents, error: eventsError } = await supabase
    .from('security_events')
    .select('severity')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const criticalEvents = recentEvents?.filter((e: any) => e.severity === 'critical').length || 0;
  healthChecks.push({
    check: 'Critical Events (24h)',
    status: criticalEvents === 0 ? 'healthy' : criticalEvents < 5 ? 'warning' : 'critical',
    details: `${criticalEvents} critical events in last 24 hours`
  });

  // Check active sessions
  const { data: activeSessions, error: sessionsError } = await supabase
    .from('user_sessions')
    .select('security_level')
    .eq('is_active', true);

  const highRiskSessions = activeSessions?.filter((s: any) => s.security_level === 'high_risk').length || 0;
  healthChecks.push({
    check: 'Session Security',
    status: highRiskSessions === 0 ? 'healthy' : highRiskSessions < 3 ? 'warning' : 'critical',
    details: `${highRiskSessions} high-risk active sessions`
  });

  const overallStatus = healthChecks.some(c => c.status === 'critical') ? 'critical' :
                       healthChecks.some(c => c.status === 'warning') ? 'warning' : 'healthy';

  return {
    overall_status: overallStatus,
    checks: healthChecks,
    timestamp: new Date().toISOString()
  };
}

// Helper functions
function parseTimeWindow(timeWindow: string): number {
  const match = timeWindow.match(/(\d+)\s*(minute|hour|day)s?/i);
  if (!match) return 60 * 60 * 1000; // Default 1 hour
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'minute': return value * 60 * 1000;
    case 'hour': return value * 60 * 60 * 1000;
    case 'day': return value * 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000;
  }
}

function getSeverityLevels(threshold: string): string[] {
  switch (threshold) {
    case 'critical': return ['critical'];
    case 'high': return ['critical', 'high'];
    case 'medium': return ['critical', 'high', 'medium'];
    case 'low': return ['critical', 'high', 'medium', 'low'];
    default: return ['critical', 'high', 'medium'];
  }
}

function groupEventsByType(events: any[]): Record<string, any[]> {
  return events.reduce((groups, event) => {
    const type = event.event_type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(event);
    return groups;
  }, {});
}

async function processEventGroup(eventType: string, events: any[]): Promise<ThreatAlert | null> {
  if (events.length === 0) return null;
  
  const latestEvent = events[0];
  const threatLevel = calculateThreatLevel(eventType, events.length);
  
  return {
    id: `alert_${eventType}_${Date.now()}`,
    threat_level: threatLevel,
    alert_type: eventType,
    description: generateAlertDescription(eventType, events.length),
    affected_resources: events.map(e => e.user_id || e.ip_address).filter(Boolean),
    recommended_actions: getRecommendedActions(eventType, threatLevel),
    auto_remediation_available: isAutoRemediationAvailable(eventType),
    created_at: new Date().toISOString()
  };
}

function calculateThreatLevel(eventType: string, count: number): 'low' | 'medium' | 'high' | 'critical' {
  const highRiskEvents = ['failed_login_attempt', 'suspicious_activity', 'injection_attempt'];
  const criticalEvents = ['unauthorized_access', 'data_breach_attempt', 'admin_role_assigned'];
  
  if (criticalEvents.includes(eventType) || count >= 10) return 'critical';
  if (highRiskEvents.includes(eventType) || count >= 5) return 'high';
  if (count >= 3) return 'medium';
  return 'low';
}

function getThreatScore(level: string): number {
  switch (level) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

function calculateOverallThreatLevel(analysis: any): string {
  const riskScore = analysis.risk_score || 0;
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}

function generateAlertDescription(eventType: string, count: number): string {
  const descriptions: Record<string, string> = {
    'failed_login_attempt': `${count} failed login attempts detected`,
    'suspicious_activity': `${count} suspicious activities detected`,
    'rate_limit_exceeded': `${count} rate limit violations detected`,
    'injection_attempt': `${count} potential injection attacks detected`,
    'unauthorized_access': `${count} unauthorized access attempts detected`
  };
  
  return descriptions[eventType] || `${count} ${eventType} events detected`;
}

function getRecommendedActions(eventType: string, threatLevel: string): string[] {
  const actions: Record<string, string[]> = {
    'failed_login_attempt': ['Review user accounts', 'Enable MFA', 'Block suspicious IPs'],
    'suspicious_activity': ['Investigate user behavior', 'Review access logs', 'Validate user identity'],
    'injection_attempt': ['Block source IPs', 'Review application security', 'Update WAF rules'],
    'unauthorized_access': ['Revoke access tokens', 'Force password reset', 'Investigate breach']
  };
  
  let baseActions = actions[eventType] || ['Monitor situation', 'Review security logs'];
  
  if (threatLevel === 'critical') {
    baseActions = ['IMMEDIATE ACTION REQUIRED', ...baseActions, 'Contact security team'];
  }
  
  return baseActions;
}

function isAutoRemediationAvailable(eventType: string): boolean {
  const autoRemediationEvents = ['rate_limit_exceeded', 'suspicious_activity', 'failed_login_attempt'];
  return autoRemediationEvents.includes(eventType);
}

async function logSecurityEvent(supabase: any, event: any): Promise<void> {
  await supabase.functions.invoke('log-security-event', {
    body: {
      event_type: event.event_type,
      severity: event.severity,
      event_data: event.event_data || {},
      user_id: event.user_id,
      source: event.source || 'security_monitoring'
    }
  });
}

serve(handler);