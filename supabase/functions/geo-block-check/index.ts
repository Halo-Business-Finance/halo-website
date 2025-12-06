import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Allowed countries for admin access (ISO 3166-1 alpha-2 codes)
const ALLOWED_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'CH', 'JP', 'SG'];

// High-risk countries that should always be blocked
const BLOCKED_COUNTRIES = ['KP', 'IR', 'SY', 'CU', 'RU', 'CN', 'BY'];

interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  org: string;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  is_vpn: boolean;
  is_proxy: boolean;
  is_tor: boolean;
  is_datacenter: boolean;
}

interface GeoCheckResult {
  allowed: boolean;
  reason?: string;
  geo_data?: GeoData;
  risk_score: number;
}

async function getGeoLocation(ip: string): Promise<GeoData | null> {
  try {
    // Use ip-api.com for geolocation (free tier: 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,city,isp,org,proxy,hosting`);
    
    if (!response.ok) {
      console.error('[Geo-Block] Geolocation API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      console.error('[Geo-Block] Geolocation lookup failed:', data.message);
      return null;
    }
    
    // Determine threat level based on various factors
    let threat_level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (BLOCKED_COUNTRIES.includes(data.countryCode)) {
      threat_level = 'critical';
    } else if (data.proxy || data.hosting) {
      threat_level = 'high';
    } else if (!ALLOWED_COUNTRIES.includes(data.countryCode)) {
      threat_level = 'medium';
    }
    
    return {
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      isp: data.isp || 'Unknown',
      org: data.org || 'Unknown',
      threat_level,
      is_vpn: false, // Would require premium API
      is_proxy: data.proxy || false,
      is_tor: false, // Would require premium API
      is_datacenter: data.hosting || false,
    };
  } catch (error) {
    console.error('[Geo-Block] Geolocation error:', error);
    return null;
  }
}

function calculateRiskScore(geoData: GeoData | null, adminId: string | null): number {
  let score = 0;
  
  if (!geoData) {
    return 50; // Unknown location is medium risk
  }
  
  // Country-based scoring
  if (BLOCKED_COUNTRIES.includes(geoData.countryCode)) {
    score += 100; // Blocked country
  } else if (!ALLOWED_COUNTRIES.includes(geoData.countryCode)) {
    score += 40; // Unusual country
  }
  
  // Proxy/VPN detection
  if (geoData.is_proxy) score += 30;
  if (geoData.is_vpn) score += 25;
  if (geoData.is_tor) score += 50;
  if (geoData.is_datacenter) score += 20;
  
  return Math.min(score, 100);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { ip_address, admin_email, action = 'login' } = await req.json();

    if (!ip_address) {
      return new Response(
        JSON.stringify({ allowed: false, reason: 'IP address required', risk_score: 100 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Geo-Block] Checking IP: ${ip_address} for action: ${action}`);

    // Skip check for localhost/private IPs
    if (ip_address === '127.0.0.1' || 
        ip_address === 'localhost' || 
        ip_address.startsWith('192.168.') || 
        ip_address.startsWith('10.') || 
        ip_address.startsWith('172.')) {
      console.log('[Geo-Block] Local/private IP - allowing access');
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          reason: 'Local/private network', 
          risk_score: 0,
          geo_data: { country: 'Local', countryCode: 'LO', threat_level: 'low' }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get geolocation data
    const geoData = await getGeoLocation(ip_address);
    
    // Check if admin has known locations
    let knownLocations: string[] = [];
    if (admin_email) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id, credential_audit_trail')
        .eq('email', admin_email.toLowerCase())
        .single();
      
      if (adminUser?.credential_audit_trail) {
        const auditTrail = adminUser.credential_audit_trail as { known_locations?: string[] };
        knownLocations = auditTrail.known_locations || [];
      }
    }

    const riskScore = calculateRiskScore(geoData, null);
    let result: GeoCheckResult;

    // Determine if access should be blocked
    if (geoData && BLOCKED_COUNTRIES.includes(geoData.countryCode)) {
      result = {
        allowed: false,
        reason: `Access blocked from ${geoData.country} - high-risk region`,
        geo_data: geoData,
        risk_score: 100
      };
    } else if (riskScore >= 70) {
      result = {
        allowed: false,
        reason: `High risk detected (score: ${riskScore}) - ${geoData?.is_proxy ? 'Proxy detected' : geoData?.is_datacenter ? 'Datacenter IP' : 'Unusual location'}`,
        geo_data: geoData || undefined,
        risk_score: riskScore
      };
    } else if (riskScore >= 40 && geoData) {
      // Medium risk - allow but flag for review
      result = {
        allowed: true,
        reason: `Medium risk location (${geoData.country}) - logged for review`,
        geo_data: geoData,
        risk_score: riskScore
      };
    } else {
      result = {
        allowed: true,
        geo_data: geoData || undefined,
        risk_score: riskScore
      };
    }

    // Log security event
    await supabase.from('security_events').insert({
      event_type: result.allowed ? 'geo_check_passed' : 'geo_check_blocked',
      severity: result.allowed ? (riskScore >= 40 ? 'warning' : 'info') : 'critical',
      event_data: {
        ip_address,
        admin_email,
        action,
        geo_data: geoData,
        risk_score: riskScore,
        result: result.allowed ? 'allowed' : 'blocked',
        reason: result.reason
      },
      ip_address,
      risk_score: riskScore,
      source: 'geo-block-check'
    });

    console.log(`[Geo-Block] Result for ${ip_address}: ${result.allowed ? 'ALLOWED' : 'BLOCKED'} (risk: ${riskScore})`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Geo-Block] Error:', error);
    return new Response(
      JSON.stringify({ allowed: false, reason: 'Geo-check failed', risk_score: 50 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
