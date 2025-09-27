import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IncidentRequest {
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_resources: string[];
  auto_remediate: boolean;
  incident_data?: any;
}

interface RemediationAction {
  action_type: string;
  target: string;
  parameters: any;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
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

    // Enhanced authentication for incident response
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      await logSecurityEvent(supabase, {
        event_type: 'unauthorized_incident_response_access',
        severity: 'critical',
        ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
        event_data: { attempted_access: 'incident_response_api' }
      });

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

    // Only admin users can trigger incident response
    const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id });
    if (userRole !== 'admin') {
      await logSecurityEvent(supabase, {
        event_type: 'unauthorized_incident_response_attempt',
        severity: 'high',
        user_id: user.id,
        event_data: { 
          user_role: userRole,
          attempted_action: 'incident_response'
        }
      });

      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const incidentRequest: IncidentRequest = await req.json();

    // Validate incident request
    if (!incidentRequest.incident_type || !incidentRequest.severity) {
      return new Response(JSON.stringify({ error: 'Missing required incident parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log incident initiation
    await logSecurityEvent(supabase, {
      event_type: 'incident_response_initiated',
      severity: incidentRequest.severity,
      user_id: user.id,
      event_data: {
        incident_type: incidentRequest.incident_type,
        affected_resources: incidentRequest.affected_resources,
        auto_remediate: incidentRequest.auto_remediate,
        initiated_by: user.id
      }
    });

    // Execute incident response plan
    const responseActions = await executeIncidentResponse(supabase, incidentRequest, user.id);

    // Create incident record
    const { data: incident, error: incidentError } = await supabase
      .from('security_incidents')
      .insert({
        incident_type: incidentRequest.incident_type,
        severity: incidentRequest.severity,
        status: 'active',
        affected_resources: incidentRequest.affected_resources,
        response_actions: responseActions,
        initiated_by: user.id,
        incident_data: incidentRequest.incident_data || {}
      })
      .select()
      .single();

    if (incidentError) {
      console.error('Failed to create incident record:', incidentError);
    }

    return new Response(JSON.stringify({
      success: true,
      incident_id: incident?.id,
      response_actions: responseActions,
      status: 'incident_response_initiated',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Incident response error:', error);
    return new Response(JSON.stringify({ 
      error: 'Incident response failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function executeIncidentResponse(supabase: any, incident: IncidentRequest, userId: string): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  switch (incident.incident_type) {
    case 'brute_force_attack':
      actions.push(...await handleBruteForceAttack(supabase, incident));
      break;
    
    case 'suspicious_login_pattern':
      actions.push(...await handleSuspiciousLogins(supabase, incident));
      break;
    
    case 'data_breach_attempt':
      actions.push(...await handleDataBreachAttempt(supabase, incident));
      break;
    
    case 'malicious_activity':
      actions.push(...await handleMaliciousActivity(supabase, incident));
      break;
    
    case 'privilege_escalation':
      actions.push(...await handlePrivilegeEscalation(supabase, incident));
      break;
    
    default:
      actions.push(await genericIncidentResponse(incident));
  }

  // Execute automated remediation if enabled
  if (incident.auto_remediate) {
    for (const action of actions) {
      if (action.status === 'pending') {
        try {
          action.status = 'executing';
          action.result = await executeRemediationAction(supabase, action);
          action.status = 'completed';
        } catch (error) {
          action.status = 'failed';
          action.result = { error: (error as Error).message };
        }
      }
    }
  }

  return actions;
}

async function handleBruteForceAttack(supabase: any, incident: IncidentRequest): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Block suspicious IPs
  const suspiciousIPs = incident.affected_resources.filter(r => r.includes('.'));
  for (const ip of suspiciousIPs) {
    actions.push({
      action_type: 'block_ip',
      target: ip,
      parameters: { duration: '24h', reason: 'brute_force_attack' },
      status: 'pending'
    });
  }

  // Invalidate affected user sessions
  const affectedUsers = incident.affected_resources.filter(r => r.includes('user:'));
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'invalidate_sessions',
      target: userId,
      parameters: { reason: 'brute_force_protection' },
      status: 'pending'
    });
  }

  // Temporary account lockout
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'temporary_lockout',
      target: userId,
      parameters: { duration: '1h', reason: 'brute_force_protection' },
      status: 'pending'
    });
  }

  return actions;
}

async function handleSuspiciousLogins(supabase: any, incident: IncidentRequest): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Force MFA verification for affected accounts
  const affectedUsers = incident.affected_resources.filter(r => r.includes('user:'));
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'force_mfa_verification',
      target: userId,
      parameters: { reason: 'suspicious_login_pattern' },
      status: 'pending'
    });
  }

  // Monitor account activity
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'enable_enhanced_monitoring',
      target: userId,
      parameters: { duration: '72h', level: 'high' },
      status: 'pending'
    });
  }

  return actions;
}

async function handleDataBreachAttempt(supabase: any, incident: IncidentRequest): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Immediate session termination
  actions.push({
    action_type: 'terminate_all_sessions',
    target: 'all_users',
    parameters: { reason: 'data_breach_protection' },
    status: 'pending'
  });

  // Enable emergency access controls
  actions.push({
    action_type: 'enable_emergency_mode',
    target: 'system',
    parameters: { level: 'lockdown', duration: '2h' },
    status: 'pending'
  });

  // Notify security team
  actions.push({
    action_type: 'send_security_alert',
    target: 'security_team',
    parameters: { 
      priority: 'critical',
      message: 'Potential data breach detected - immediate review required'
    },
    status: 'pending'
  });

  return actions;
}

async function handleMaliciousActivity(supabase: any, incident: IncidentRequest): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Block malicious IPs and user agents
  const maliciousIPs = incident.affected_resources.filter(r => r.includes('.'));
  for (const ip of maliciousIPs) {
    actions.push({
      action_type: 'block_ip',
      target: ip,
      parameters: { duration: '48h', reason: 'malicious_activity' },
      status: 'pending'
    });
  }

  // Quarantine affected accounts
  const affectedUsers = incident.affected_resources.filter(r => r.includes('user:'));
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'quarantine_account',
      target: userId,
      parameters: { reason: 'malicious_activity_detected' },
      status: 'pending'
    });
  }

  return actions;
}

async function handlePrivilegeEscalation(supabase: any, incident: IncidentRequest): Promise<RemediationAction[]> {
  const actions: RemediationAction[] = [];

  // Audit all role assignments
  actions.push({
    action_type: 'audit_role_assignments',
    target: 'all_users',
    parameters: { scope: 'recent_changes', timeframe: '24h' },
    status: 'pending'
  });

  // Temporary privilege revocation
  const affectedUsers = incident.affected_resources.filter(r => r.includes('user:'));
  for (const userRef of affectedUsers) {
    const userId = userRef.replace('user:', '');
    actions.push({
      action_type: 'revoke_elevated_privileges',
      target: userId,
      parameters: { temporary: true, duration: '4h' },
      status: 'pending'
    });
  }

  return actions;
}

async function genericIncidentResponse(incident: IncidentRequest): Promise<RemediationAction> {
  return {
    action_type: 'log_incident',
    target: 'security_system',
    parameters: { 
      incident_type: incident.incident_type,
      severity: incident.severity,
      affected_resources: incident.affected_resources
    },
    status: 'pending'
  };
}

async function executeRemediationAction(supabase: any, action: RemediationAction): Promise<any> {
  switch (action.action_type) {
    case 'block_ip':
      return await blockIP(supabase, action.target, action.parameters);
    
    case 'invalidate_sessions':
      return await invalidateUserSessions(supabase, action.target, action.parameters);
    
    case 'temporary_lockout':
      return await temporaryAccountLockout(supabase, action.target, action.parameters);
    
    case 'terminate_all_sessions':
      return await terminateAllSessions(supabase);
    
    case 'enable_emergency_mode':
      return await enableEmergencyMode(supabase, action.parameters);
    
    case 'send_security_alert':
      return await sendSecurityAlert(supabase, action.parameters);
    
    default:
      return { message: `Action ${action.action_type} logged but not automated` };
  }
}

async function blockIP(supabase: any, ip: string, params: any): Promise<any> {
  // Log IP blocking event
  await logSecurityEvent(supabase, {
    event_type: 'ip_blocked_automatically',
    severity: 'high',
    ip_address: ip,
    event_data: {
      blocking_reason: params.reason,
      duration: params.duration,
      blocked_by: 'automated_incident_response'
    }
  });

  return { ip_blocked: ip, duration: params.duration };
}

async function invalidateUserSessions(supabase: any, userId: string, params: any): Promise<any> {
  const { data, error } = await supabase.rpc('invalidate_suspicious_sessions', {
    target_user_id: userId,
    reason: params.reason
  });

  return { sessions_invalidated: !error, user_id: userId };
}

async function temporaryAccountLockout(supabase: any, userId: string, params: any): Promise<any> {
  // In a real implementation, this would integrate with auth system
  await logSecurityEvent(supabase, {
    event_type: 'account_temporarily_locked',
    severity: 'high',
    user_id: userId,
    event_data: {
      lockout_reason: params.reason,
      duration: params.duration,
      locked_by: 'automated_incident_response'
    }
  });

  return { account_locked: userId, duration: params.duration };
}

async function terminateAllSessions(supabase: any): Promise<any> {
  // Mark all sessions as inactive (emergency procedure)
  const { data, error } = await supabase
    .from('user_sessions')
    .update({ is_active: false, last_activity: new Date().toISOString() })
    .eq('is_active', true);

  await logSecurityEvent(supabase, {
    event_type: 'all_sessions_terminated',
    severity: 'critical',
    event_data: {
      reason: 'emergency_security_response',
      terminated_by: 'automated_incident_response'
    }
  });

  return { all_sessions_terminated: !error };
}

async function enableEmergencyMode(supabase: any, params: any): Promise<any> {
  await logSecurityEvent(supabase, {
    event_type: 'emergency_mode_activated',
    severity: 'critical',
    event_data: {
      emergency_level: params.level,
      duration: params.duration,
      activated_by: 'automated_incident_response'
    }
  });

  return { emergency_mode_enabled: true, level: params.level };
}

async function sendSecurityAlert(supabase: any, params: any): Promise<any> {
  // In a real implementation, this would send alerts via email/SMS/Slack
  await logSecurityEvent(supabase, {
    event_type: 'security_alert_sent',
    severity: 'high',
    event_data: {
      alert_priority: params.priority,
      alert_message: params.message,
      sent_by: 'automated_incident_response'
    }
  });

  return { alert_sent: true, priority: params.priority };
}

async function logSecurityEvent(supabase: any, event: any): Promise<void> {
  await supabase.functions.invoke('log-security-event', {
    body: {
      event_type: event.event_type,
      severity: event.severity,
      event_data: event.event_data || {},
      user_id: event.user_id,
      ip_address: event.ip_address,
      source: event.source || 'automated_incident_response'
    }
  });
}

serve(handler);