import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityAnalysisRequest {
  analysis_type: 'behavioral' | 'pattern' | 'threat' | 'comprehensive';
  time_window?: string;
  user_id?: string;
  severity_threshold?: string;
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

    const { analysis_type, time_window = '24 hours', user_id, severity_threshold = 'medium' } = await req.json() as SecurityAnalysisRequest;

    console.log(`Starting ${analysis_type} security analysis for window: ${time_window}`);

    let analysisResults = {};

    switch (analysis_type) {
      case 'behavioral':
        analysisResults = await performBehavioralAnalysis(supabase, time_window, user_id);
        break;
      
      case 'pattern':
        analysisResults = await performPatternAnalysis(supabase, time_window, severity_threshold);
        break;
      
      case 'threat':
        analysisResults = await performThreatAnalysis(supabase, time_window);
        break;
      
      case 'comprehensive':
        analysisResults = await performComprehensiveAnalysis(supabase, time_window, severity_threshold);
        break;
      
      default:
        throw new Error(`Unknown analysis type: ${analysis_type}`);
    }

    // Log analysis completion
    await supabase.from('security_events').insert({
      event_type: 'security_analysis_completed',
      severity: 'info',
      event_data: {
        analysis_type,
        time_window,
        user_id,
        results_summary: {
          total_findings: Object.keys(analysisResults).length,
          analysis_timestamp: new Date().toISOString()
        }
      },
      source: 'security_analysis_function'
    });

    return new Response(
      JSON.stringify({
        success: true,
        analysis_type,
        time_window,
        results: analysisResults,
        generated_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Security analysis error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function performBehavioralAnalysis(supabase: any, timeWindow: string, userId?: string) {
  console.log('Performing behavioral analysis...');
  
  const query = supabase
    .from('security_events')
    .select('user_id, event_type, event_data, created_at, ip_address')
    .gte('created_at', new Date(Date.now() - parseTimeWindow(timeWindow)).toISOString())
    .in('event_type', ['session_created', 'session_validated', 'behavioral_pattern_deviation']);

  if (userId) {
    query.eq('user_id', userId);
  }

  const { data: events, error } = await query;
  if (error) throw error;

  // Analyze behavioral patterns
  const userBehaviors = new Map();
  
  events?.forEach(event => {
    if (!event.user_id) return;
    
    if (!userBehaviors.has(event.user_id)) {
      userBehaviors.set(event.user_id, {
        session_count: 0,
        ip_addresses: new Set(),
        unusual_patterns: 0,
        risk_score: 0
      });
    }
    
    const behavior = userBehaviors.get(event.user_id);
    
    if (event.event_type === 'session_created') {
      behavior.session_count++;
      if (event.ip_address) behavior.ip_addresses.add(event.ip_address);
    }
    
    if (event.event_type === 'behavioral_pattern_deviation') {
      behavior.unusual_patterns++;
      behavior.risk_score += 15;
    }
    
    // Multiple IP addresses increase risk
    if (behavior.ip_addresses.size > 3) {
      behavior.risk_score += 10;
    }
    
    // Too many sessions in time window
    if (behavior.session_count > 10) {
      behavior.risk_score += 20;
    }
  });

  // Convert to analysis results
  const behavioralFindings = [];
  userBehaviors.forEach((behavior, userId) => {
    if (behavior.risk_score > 30) {
      behavioralFindings.push({
        user_id: userId,
        risk_score: behavior.risk_score,
        anomalies: {
          multiple_ips: behavior.ip_addresses.size > 3,
          excessive_sessions: behavior.session_count > 10,
          pattern_deviations: behavior.unusual_patterns > 0
        },
        recommendation: behavior.risk_score > 70 ? 'immediate_review' : 'monitor_closely'
      });
    }
  });

  return {
    behavioral_analysis: {
      users_analyzed: userBehaviors.size,
      high_risk_users: behavioralFindings.length,
      findings: behavioralFindings
    }
  };
}

async function performPatternAnalysis(supabase: any, timeWindow: string, severityThreshold: string) {
  console.log('Performing pattern analysis...');
  
  const { data: patterns, error } = await supabase.rpc('analyze_security_events');
  if (error) throw error;

  // Enhanced pattern analysis
  const { data: recentEvents, error: eventsError } = await supabase
    .from('security_events')
    .select('event_type, severity, ip_address, created_at, event_data')
    .gte('created_at', new Date(Date.now() - parseTimeWindow(timeWindow)).toISOString())
    .gte('severity', severityThreshold);

  if (eventsError) throw eventsError;

  // Analyze IP clustering
  const ipClusters = new Map();
  recentEvents?.forEach(event => {
    if (!event.ip_address) return;
    
    if (!ipClusters.has(event.ip_address)) {
      ipClusters.set(event.ip_address, []);
    }
    ipClusters.get(event.ip_address).push(event);
  });

  const suspiciousIPs = Array.from(ipClusters.entries())
    .filter(([ip, events]) => events.length > 20)
    .map(([ip, events]) => ({
      ip_address: ip,
      event_count: events.length,
      event_types: [...new Set(events.map(e => e.event_type))],
      severity_levels: [...new Set(events.map(e => e.severity))],
      risk_level: events.length > 50 ? 'critical' : 'high'
    }));

  return {
    pattern_analysis: {
      detected_patterns: patterns || [],
      suspicious_ips: suspiciousIPs,
      total_events_analyzed: recentEvents?.length || 0
    }
  };
}

async function performThreatAnalysis(supabase: any, timeWindow: string) {
  console.log('Performing threat analysis...');
  
  const { data: criticalEvents, error } = await supabase
    .from('security_events')
    .select('*')
    .eq('severity', 'critical')
    .gte('created_at', new Date(Date.now() - parseTimeWindow(timeWindow)).toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Categorize threats
  const threatCategories = {
    session_hijacking: 0,
    privilege_escalation: 0,
    data_breach_attempt: 0,
    brute_force: 0,
    other: 0
  };

  const activeThreatIds = new Set();

  criticalEvents?.forEach(event => {
    activeThreatIds.add(event.user_id || event.ip_address);
    
    if (event.event_type.includes('session')) {
      threatCategories.session_hijacking++;
    } else if (event.event_type.includes('role') || event.event_type.includes('admin')) {
      threatCategories.privilege_escalation++;
    } else if (event.event_type.includes('consultation') || event.event_type.includes('data')) {
      threatCategories.data_breach_attempt++;
    } else if (event.event_type.includes('rate_limit') || event.event_type.includes('invalid')) {
      threatCategories.brute_force++;
    } else {
      threatCategories.other++;
    }
  });

  // Calculate threat level
  const totalThreats = Object.values(threatCategories).reduce((a, b) => a + b, 0);
  let threatLevel = 'low';
  
  if (totalThreats > 50) threatLevel = 'critical';
  else if (totalThreats > 20) threatLevel = 'high';
  else if (totalThreats > 5) threatLevel = 'medium';

  return {
    threat_analysis: {
      threat_level: threatLevel,
      total_critical_events: totalThreats,
      unique_threat_sources: activeThreatIds.size,
      threat_categories: threatCategories,
      recent_critical_events: criticalEvents?.slice(0, 10) || []
    }
  };
}

async function performComprehensiveAnalysis(supabase: any, timeWindow: string, severityThreshold: string) {
  console.log('Performing comprehensive security analysis...');
  
  const [behavioral, pattern, threat] = await Promise.all([
    performBehavioralAnalysis(supabase, timeWindow),
    performPatternAnalysis(supabase, timeWindow, severityThreshold),
    performThreatAnalysis(supabase, timeWindow)
  ]);

  // Calculate overall security posture
  const behavioralRisk = behavioral.behavioral_analysis.high_risk_users || 0;
  const patternRisk = pattern.pattern_analysis.suspicious_ips.length || 0;
  const threatRisk = threat.threat_analysis.total_critical_events || 0;

  const overallRiskScore = Math.min(100, (behavioralRisk * 10) + (patternRisk * 5) + (threatRisk * 2));
  
  let securityPosture = 'excellent';
  if (overallRiskScore > 70) securityPosture = 'critical';
  else if (overallRiskScore > 40) securityPosture = 'concerning';
  else if (overallRiskScore > 20) securityPosture = 'moderate';
  else if (overallRiskScore > 10) securityPosture = 'good';

  return {
    comprehensive_analysis: {
      security_posture: securityPosture,
      overall_risk_score: overallRiskScore,
      analysis_timestamp: new Date().toISOString(),
      component_analyses: {
        behavioral,
        pattern,
        threat
      },
      recommendations: generateSecurityRecommendations(overallRiskScore, {
        behavioral_risk: behavioralRisk,
        pattern_risk: patternRisk,
        threat_risk: threatRisk
      })
    }
  };
}

function generateSecurityRecommendations(riskScore: number, risks: any) {
  const recommendations = [];
  
  if (riskScore > 70) {
    recommendations.push('IMMEDIATE: Activate incident response protocol');
    recommendations.push('IMMEDIATE: Review and potentially suspend high-risk user accounts');
  }
  
  if (risks.behavioral_risk > 5) {
    recommendations.push('Implement additional authentication factors for flagged users');
    recommendations.push('Increase session monitoring frequency');
  }
  
  if (risks.pattern_risk > 3) {
    recommendations.push('Consider IP-based rate limiting or blocking');
    recommendations.push('Activate geographic access controls');
  }
  
  if (risks.threat_risk > 10) {
    recommendations.push('Escalate to security team for manual review');
    recommendations.push('Consider temporary security lockdown measures');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue standard security monitoring');
    recommendations.push('Schedule next comprehensive analysis in 24 hours');
  }
  
  return recommendations;
}

function parseTimeWindow(timeWindow: string): number {
  const match = timeWindow.match(/(\d+)\s*(minute|hour|day|week)s?/i);
  if (!match) return 24 * 60 * 60 * 1000; // Default 24 hours
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  const multipliers = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000
  };
  
  return value * (multipliers[unit as keyof typeof multipliers] || multipliers.hour);
}