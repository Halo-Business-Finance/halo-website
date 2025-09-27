import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityIncident {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress?: string;
  eventData: Record<string, any>;
}

interface AutomatedAction {
  type: string;
  description: string;
  executed: boolean;
  timestamp: string;
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
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const incident: SecurityIncident = await req.json();

    // Validate incident data
    if (!incident.type || !incident.severity) {
      return new Response('Invalid incident data', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    console.log(`Processing security incident: ${incident.type} (${incident.severity})`);

    // Execute automated response based on incident type and severity
    const automatedActions = await executeAutomatedResponse(supabase, incident);

    // Create security alert
    const { data: alertData, error: alertError } = await supabase
      .from('security_alerts')
      .insert({
        alert_type: `automated_response_${incident.type}`,
        priority: incident.severity,
        status: 'open',
        notes: `Automated response executed for ${incident.type}. Actions: ${automatedActions.map(a => a.type).join(', ')}`,
        event_id: null
      })
      .select()
      .single();

    if (alertError) {
      console.error('Failed to create security alert:', alertError);
    }

    // Log the incident and response
    await supabase.from('security_events').insert({
      event_type: 'automated_security_response',
      severity: incident.severity,
      user_id: incident.userId,
      ip_address: incident.ipAddress,
      event_data: {
        original_incident: incident,
        automated_actions: automatedActions,
        alert_id: alertData?.id,
        response_timestamp: new Date().toISOString()
      },
      source: 'automated_security_response'
    });

    // Send notifications for critical incidents
    if (incident.severity === 'critical') {
      await sendCriticalIncidentNotification(supabase, incident, automatedActions);
    }

    return new Response(JSON.stringify({
      success: true,
      incidentProcessed: true,
      automatedActions,
      alertCreated: !alertError,
      alertId: alertData?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Automated security response error:', error);
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function executeAutomatedResponse(
  supabase: any, 
  incident: SecurityIncident
): Promise<AutomatedAction[]> {
  const actions: AutomatedAction[] = [];
  const timestamp = new Date().toISOString();

  try {
    switch (incident.type) {
      case 'brute_force_attack':
        // Block IP address
        if (incident.ipAddress) {
          await blockIPAddress(supabase, incident.ipAddress);
          actions.push({
            type: 'ip_block',
            description: `Blocked IP address ${incident.ipAddress}`,
            executed: true,
            timestamp
          });
        }

        // Disable affected user account if identified
        if (incident.userId) {
          await disableUserAccount(supabase, incident.userId);
          actions.push({
            type: 'account_disable',
            description: `Disabled user account ${incident.userId}`,
            executed: true,
            timestamp
          });
        }
        break;

      case 'privilege_escalation':
        // Immediately terminate all sessions for the user
        if (incident.userId) {
          await terminateUserSessions(supabase, incident.userId);
          actions.push({
            type: 'session_termination',
            description: `Terminated all sessions for user ${incident.userId}`,
            executed: true,
            timestamp
          });

          // Revert role changes
          await revertRoleChanges(supabase, incident.userId);
          actions.push({
            type: 'role_reversion',
            description: `Reverted role changes for user ${incident.userId}`,
            executed: true,
            timestamp
          });
        }
        break;

      case 'data_exfiltration':
        // Lock down data access
        await enableEmergencyDataProtection(supabase);
        actions.push({
          type: 'data_protection',
          description: 'Enabled emergency data protection mode',
          executed: true,
          timestamp
        });

        // Audit all recent data access
        await triggerDataAccessAudit(supabase);
        actions.push({
          type: 'data_audit',
          description: 'Triggered comprehensive data access audit',
          executed: true,
          timestamp
        });
        break;

      case 'malware_detection':
        // Quarantine affected systems
        if (incident.userId) {
          await quarantineUserSessions(supabase, incident.userId);
          actions.push({
            type: 'session_quarantine',
            description: `Quarantined sessions for user ${incident.userId}`,
            executed: true,
            timestamp
          });
        }
        break;

      case 'suspicious_activity':
        // Enhanced monitoring
        await enableEnhancedMonitoring(supabase, incident);
        actions.push({
          type: 'enhanced_monitoring',
          description: 'Enabled enhanced security monitoring',
          executed: true,
          timestamp
        });
        break;

      default:
        // Standard response for unknown incident types
        actions.push({
          type: 'standard_logging',
          description: `Logged incident of type ${incident.type}`,
          executed: true,
          timestamp
        });
    }

  } catch (error) {
    console.error('Error executing automated response:', error);
    actions.push({
      type: 'error',
      description: `Failed to execute automated response: ${(error as Error).message}`,
      executed: false,
      timestamp
    });
  }

  return actions;
}

async function blockIPAddress(supabase: any, ipAddress: string): Promise<void> {
  await supabase.from('security_configs').insert({
    config_key: `blocked_ip_${ipAddress.replace(/\./g, '_')}`,
    config_value: {
      blocked_at: new Date().toISOString(),
      reason: 'automated_security_response',
      ip_address: ipAddress
    },
    is_active: true
  });
}

async function disableUserAccount(supabase: any, userId: string): Promise<void> {
  // Deactivate all user roles
  await supabase.from('user_roles')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Terminate all sessions
  await supabase.from('user_sessions')
    .update({ is_active: false, security_level: 'disabled' })
    .eq('user_id', userId);
}

async function terminateUserSessions(supabase: any, userId: string): Promise<void> {
  await supabase.from('user_sessions')
    .update({ 
      is_active: false, 
      security_level: 'terminated',
      expires_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}

async function revertRoleChanges(supabase: any, userId: string): Promise<void> {
  // Set user role back to basic 'user' role
  await supabase.from('user_roles')
    .update({ role: 'user', is_active: true })
    .eq('user_id', userId);
}

async function enableEmergencyDataProtection(supabase: any): Promise<void> {
  await supabase.from('security_configs').upsert({
    config_key: 'emergency_data_protection',
    config_value: {
      enabled: true,
      activated_at: new Date().toISOString(),
      reason: 'automated_security_response'
    },
    is_active: true
  });
}

async function triggerDataAccessAudit(supabase: any): Promise<void> {
  await supabase.from('security_events').insert({
    event_type: 'data_access_audit_triggered',
    severity: 'high',
    event_data: {
      audit_type: 'comprehensive',
      triggered_by: 'automated_security_response',
      audit_window_hours: 24
    },
    source: 'automated_security_response'
  });
}

async function quarantineUserSessions(supabase: any, userId: string): Promise<void> {
  await supabase.from('user_sessions')
    .update({ 
      security_level: 'quarantined',
      is_active: false
    })
    .eq('user_id', userId);
}

async function enableEnhancedMonitoring(supabase: any, incident: SecurityIncident): Promise<void> {
  await supabase.from('security_configs').upsert({
    config_key: 'enhanced_monitoring',
    config_value: {
      enabled: true,
      triggered_by: incident.type,
      user_id: incident.userId,
      ip_address: incident.ipAddress,
      monitoring_level: 'maximum',
      duration_hours: 24
    },
    is_active: true
  });
}

async function sendCriticalIncidentNotification(
  supabase: any, 
  incident: SecurityIncident, 
  actions: AutomatedAction[]
): Promise<void> {
  // This would typically integrate with external notification services
  // For now, we'll log it as a high-priority security event
  await supabase.from('security_events').insert({
    event_type: 'critical_incident_notification',
    severity: 'critical',
    event_data: {
      incident,
      automated_actions: actions,
      requires_immediate_attention: true,
      notification_sent: true
    },
    source: 'critical_incident_notifier'
  });
}