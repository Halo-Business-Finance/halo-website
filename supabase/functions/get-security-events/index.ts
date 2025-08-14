import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityEventsRequest {
  limit: number;
  severities: string[];
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

    const { limit, severities }: SecurityEventsRequest = await req.json();

    // Fetch recent security events with filtering
    const { data: events, error } = await supabase
      .from('security_events')
      .select(`
        id,
        event_type,
        severity,
        created_at,
        user_id,
        event_data
      `)
      .in('severity', severities.length ? severities : ['critical', 'high', 'medium', 'low'])
      .order('created_at', { ascending: false })
      .limit(limit || 20);

    if (error) {
      throw error;
    }

    // Sanitize event data to remove sensitive information
    const sanitizedEvents = events?.map(event => ({
      ...event,
      event_data: event.event_data ? {
        event_type: event.event_data.event_type || event.event_type,
        severity: event.severity,
        source: event.event_data.source || 'system',
        // Remove potentially sensitive data
        details: 'Details available to authorized personnel'
      } : {}
    })) || [];

    console.log(`Retrieved ${sanitizedEvents.length} security events`);

    return new Response(JSON.stringify(sanitizedEvents), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in get-security-events function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch security events',
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