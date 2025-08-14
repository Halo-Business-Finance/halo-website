import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityMetricsRequest {
  timeframe: string;
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

    const { timeframe }: SecurityMetricsRequest = await req.json();
    const hours = timeframe === '24h' ? 24 : 168; // 24h or 7d

    // Get security events count
    const { count: totalEvents } = await supabase
      .from('security_events')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

    // Get critical alerts count
    const { count: criticalAlerts } = await supabase
      .from('security_events')
      .select('id', { count: 'exact' })
      .eq('severity', 'critical')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

    // Get active threats (unresolved high/critical events)
    const { count: activeThreats } = await supabase
      .from('security_events')
      .select('id', { count: 'exact' })
      .in('severity', ['high', 'critical'])
      .is('resolved_at', null)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Determine security status levels
    const sessionSecurity = criticalAlerts > 5 ? 'critical' : activeThreats > 10 ? 'warning' : 'healthy';
    const dataSecurity = totalEvents > 100 ? 'warning' : criticalAlerts > 2 ? 'critical' : 'healthy';
    const systemSecurity = activeThreats > 15 ? 'critical' : totalEvents > 50 ? 'warning' : 'healthy';

    console.log(`Security metrics generated: ${totalEvents} events, ${criticalAlerts} critical, ${activeThreats} threats`);

    return new Response(JSON.stringify({
      totalEvents: totalEvents || 0,
      criticalAlerts: criticalAlerts || 0,
      activeThreats: activeThreats || 0,
      sessionSecurity,
      dataSecurity,
      systemSecurity
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in get-security-metrics function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch security metrics',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);