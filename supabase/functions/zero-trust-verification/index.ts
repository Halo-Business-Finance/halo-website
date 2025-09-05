import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerificationRequest {
  userId: string;
  sessionToken: string;
  deviceFingerprint: string;
  timestamp: number;
  ipAddress: string;
  behavioralMetrics: {
    mouseMovements: number;
    keystrokes: number;
    scrollPatterns: number;
    sessionDuration: number;
    pageViews: number;
    clickPatterns: number;
  };
}

interface VerificationResponse {
  trustScore: number;
  sessionValid: boolean;
  anomalies: string[];
  riskFactors: string[];
  recommendations: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const verificationData: VerificationRequest = await req.json();
    
    // Initialize trust score
    let trustScore = 100;
    const anomalies: string[] = [];
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // 1. Session Token Validation (30 points)
    const { data: user, error: userError } = await supabase.auth.getUser(verificationData.sessionToken);
    if (userError || !user.user || user.user.id !== verificationData.userId) {
      trustScore -= 30;
      anomalies.push('Invalid or expired session token');
      riskFactors.push('Authentication failure');
    }

    // 2. Device Fingerprint Consistency (25 points)
    const { data: existingSessions } = await supabase
      .from('user_sessions')
      .select('client_fingerprint, created_at')
      .eq('user_id', verificationData.userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (existingSessions && existingSessions.length > 0) {
      const knownFingerprints = existingSessions.map(s => s.client_fingerprint);
      if (!knownFingerprints.includes(verificationData.deviceFingerprint)) {
        trustScore -= 25;
        anomalies.push('Unknown device fingerprint');
        riskFactors.push('New device detection');
        recommendations.push('Verify device identity through additional authentication');
      }
    }

    // 3. IP Address Geolocation Check (20 points)
    const { data: recentEvents } = await supabase
      .from('security_events')
      .select('ip_address, created_at')
      .eq('user_id', verificationData.userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentEvents && recentEvents.length > 0) {
      const recentIPs = [...new Set(recentEvents.map(e => e.ip_address))];
      if (recentIPs.length > 3) {
        trustScore -= 15;
        anomalies.push('Multiple IP addresses in short timeframe');
        riskFactors.push('Potential account sharing or compromise');
      }
      
      // Check for impossible travel (simplified)
      const ipChangeFrequency = recentIPs.length / recentEvents.length;
      if (ipChangeFrequency > 0.5) {
        trustScore -= 10;
        anomalies.push('Frequent IP address changes');
        riskFactors.push('Unusual location patterns');
      }
    }

    // 4. Behavioral Analysis (15 points)
    const behavioral = verificationData.behavioralMetrics;
    
    // Check for bot-like behavior
    if (behavioral.mouseMovements === 0 && behavioral.keystrokes > 100) {
      trustScore -= 10;
      anomalies.push('Automated behavior detected - no mouse movement with high keystroke activity');
      riskFactors.push('Potential bot activity');
    }
    
    // Check for excessive activity
    if (behavioral.pageViews > 100 || behavioral.clickPatterns > 1000) {
      trustScore -= 8;
      anomalies.push('Abnormally high activity levels');
      riskFactors.push('Potential automated browsing');
    }
    
    // Check for session duration anomalies
    const expectedSessionDuration = 30 * 60 * 1000; // 30 minutes
    if (behavioral.sessionDuration > 8 * 60 * 60 * 1000) { // 8 hours
      trustScore -= 5;
      anomalies.push('Unusually long session duration');
      riskFactors.push('Potential session hijacking');
    }

    // 5. Historical Security Events (10 points)
    const { data: securityEvents } = await supabase
      .from('security_events')
      .select('event_type, severity, created_at')
      .eq('user_id', verificationData.userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .in('severity', ['high', 'critical']);

    if (securityEvents && securityEvents.length > 0) {
      const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;
      const highEvents = securityEvents.filter(e => e.severity === 'high').length;
      
      trustScore -= criticalEvents * 10 + highEvents * 5;
      if (criticalEvents > 0) {
        anomalies.push(`${criticalEvents} critical security events in past week`);
        riskFactors.push('Recent critical security incidents');
      }
      if (highEvents > 2) {
        anomalies.push(`${highEvents} high-severity security events in past week`);
        riskFactors.push('Elevated security event history');
      }
    }

    // 6. Time-based Analysis (5 points)
    const currentHour = new Date().getHours();
    const isOffHours = currentHour < 6 || currentHour > 22; // 10 PM - 6 AM
    
    if (isOffHours) {
      const { data: typicalActivity } = await supabase
        .from('security_events')
        .select('created_at')
        .eq('user_id', verificationData.userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (typicalActivity) {
        const offHoursActivity = typicalActivity.filter(e => {
          const hour = new Date(e.created_at).getHours();
          return hour < 6 || hour > 22;
        }).length;
        
        const totalActivity = typicalActivity.length;
        const offHoursPercentage = offHoursActivity / totalActivity;
        
        if (offHoursPercentage < 0.1) { // Less than 10% typical off-hours activity
          trustScore -= 5;
          anomalies.push('Access during unusual hours');
          riskFactors.push('Atypical access time pattern');
        }
      }
    }

    // Ensure trust score doesn't go below 0
    trustScore = Math.max(0, trustScore);

    // Determine session validity
    const sessionValid = trustScore >= 50 && anomalies.length < 3;

    // Add recommendations based on trust score
    if (trustScore < 70) {
      recommendations.push('Consider additional authentication factors');
    }
    if (trustScore < 50) {
      recommendations.push('Immediate security review required');
      recommendations.push('Consider terminating session and requiring re-authentication');
    }
    if (anomalies.length > 2) {
      recommendations.push('Implement enhanced monitoring for this session');
    }

    // Log the verification attempt
    await supabase.from('security_events').insert({
      event_type: 'zero_trust_verification',
      user_id: verificationData.userId,
      severity: trustScore < 50 ? 'high' : trustScore < 70 ? 'medium' : 'info',
      ip_address: verificationData.ipAddress,
      event_data: {
        trustScore,
        anomalyCount: anomalies.length,
        riskFactorCount: riskFactors.length,
        deviceFingerprint: verificationData.deviceFingerprint,
        sessionValid,
        verificationTimestamp: verificationData.timestamp
      },
      source: 'zero_trust_verification'
    });

    const response: VerificationResponse = {
      trustScore,
      sessionValid,
      anomalies,
      riskFactors,
      recommendations
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Zero trust verification error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Verification failed',
        trustScore: 0,
        sessionValid: false,
        anomalies: ['System error during verification'],
        riskFactors: ['Verification system failure'],
        recommendations: ['Retry verification or contact support']
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 but with failed verification
      }
    );
  }
};

serve(handler);