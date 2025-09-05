import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ElevationRequest {
  currentTrustScore: number;
  requiredLevel: 'normal' | 'elevated' | 'critical';
  deviceFingerprint: string;
  timestamp: number;
}

interface ElevationResponse {
  success: boolean;
  newTrustScore: number;
  method: string;
  additionalStepsRequired?: string[];
  message: string;
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
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user.user) {
      throw new Error('Invalid user token');
    }

    const elevationData: ElevationRequest = await req.json();
    
    const minimumScores = {
      normal: 70,
      elevated: 85,
      critical: 95
    };

    const requiredScore = minimumScores[elevationData.requiredLevel];
    const currentScore = elevationData.currentTrustScore;

    // Check if elevation is actually needed
    if (currentScore >= requiredScore) {
      return new Response(JSON.stringify({
        success: true,
        newTrustScore: currentScore,
        method: 'already_sufficient',
        message: 'Current trust score already meets requirements'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate score boost needed
    const scoreDeficit = requiredScore - currentScore;
    let scoreBoost = 0;
    let method = '';
    let additionalStepsRequired: string[] = [];

    // Determine elevation method based on current score and required level
    if (elevationData.requiredLevel === 'critical') {
      // Critical access requires maximum security
      method = 'critical_security_challenge';
      additionalStepsRequired = [
        'Multi-factor authentication required',
        'Device verification required',
        'Security question verification',
        'Time-limited access (1 hour maximum)'
      ];
      
      // For critical, we can only boost if current score is at least 75
      if (currentScore >= 75) {
        scoreBoost = Math.min(scoreDeficit, 20); // Maximum 20 point boost
      } else {
        return new Response(JSON.stringify({
          success: false,
          newTrustScore: currentScore,
          method: 'insufficient_base_score',
          message: 'Trust score too low for critical access elevation',
          additionalStepsRequired: ['Complete full re-authentication', 'Contact administrator for manual verification']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (elevationData.requiredLevel === 'elevated') {
      // Elevated access requires additional verification
      method = 'enhanced_verification';
      additionalStepsRequired = [
        'Additional authentication factor required',
        'Device confirmation needed'
      ];
      
      if (currentScore >= 60) {
        scoreBoost = Math.min(scoreDeficit, 25); // Maximum 25 point boost
      } else {
        return new Response(JSON.stringify({
          success: false,
          newTrustScore: currentScore,
          method: 'insufficient_base_score',
          message: 'Trust score too low for elevated access',
          additionalStepsRequired: ['Complete identity re-verification']
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Normal access elevation
      method = 'basic_verification';
      if (currentScore >= 50) {
        scoreBoost = Math.min(scoreDeficit, 20); // Maximum 20 point boost
      }
    }

    // Apply additional verification based on user's security history
    const { data: recentEvents } = await supabase
      .from('security_events')
      .select('event_type, severity, created_at')
      .eq('user_id', user.user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .in('severity', ['high', 'critical']);

    // Reduce score boost if there are recent security events
    if (recentEvents && recentEvents.length > 0) {
      const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
      const highEvents = recentEvents.filter(e => e.severity === 'high').length;
      
      scoreBoost -= criticalEvents * 5 + highEvents * 2;
      
      if (criticalEvents > 0) {
        additionalStepsRequired.push('Security incident review required');
      }
    }

    // Check device fingerprint history
    const { data: deviceHistory } = await supabase
      .from('security_events')
      .select('event_data')
      .eq('user_id', user.user.id)
      .eq('event_type', 'zero_trust_verification')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (deviceHistory && deviceHistory.length > 0) {
      const knownFingerprints = deviceHistory
        .map(e => e.event_data?.deviceFingerprint)
        .filter(fp => fp);
      
      if (!knownFingerprints.includes(elevationData.deviceFingerprint)) {
        scoreBoost -= 10; // Reduce boost for unknown device
        additionalStepsRequired.push('New device verification required');
      }
    }

    // Ensure we don't boost below 0
    scoreBoost = Math.max(0, scoreBoost);
    const newTrustScore = Math.min(100, currentScore + scoreBoost);

    // Check if the elevation was successful
    const success = newTrustScore >= requiredScore;

    // Log the elevation attempt
    await supabase.from('security_events').insert({
      event_type: 'access_elevation_attempt',
      user_id: user.user.id,
      severity: success ? 'info' : 'medium',
      event_data: {
        requiredLevel: elevationData.requiredLevel,
        currentScore,
        newTrustScore,
        scoreBoost,
        method,
        success,
        deviceFingerprint: elevationData.deviceFingerprint,
        additionalStepsRequired
      },
      source: 'access_elevation'
    });

    const response: ElevationResponse = {
      success,
      newTrustScore,
      method,
      additionalStepsRequired: additionalStepsRequired.length > 0 ? additionalStepsRequired : undefined,
      message: success 
        ? `Access elevated successfully using ${method}`
        : `Elevation failed - additional verification required`
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Access elevation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      newTrustScore: 0,
      method: 'error',
      message: 'Elevation system error',
      additionalStepsRequired: ['Contact system administrator']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);