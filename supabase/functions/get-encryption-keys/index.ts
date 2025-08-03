import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get encryption keys from environment
    const formEncryptionKey = Deno.env.get('FORM_ENCRYPTION_KEY');
    const sessionEncryptionKey = Deno.env.get('SESSION_ENCRYPTION_KEY');

    if (!formEncryptionKey || !sessionEncryptionKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Encryption keys not configured properly' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the keys (this is secure since it's server-side)
    return new Response(
      JSON.stringify({
        formEncryptionKey,
        sessionEncryptionKey
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error getting encryption keys:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve encryption keys' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});