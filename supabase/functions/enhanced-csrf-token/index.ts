import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancedCSRFTokenRequest {
  sessionId: string;
  timestamp: number;
  userAgent?: string;
  entropy?: string;
  rotationScheduled?: boolean;
  behavioralFingerprint?: string;
  additionalEntropy?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { 
      sessionId, 
      timestamp, 
      userAgent, 
      entropy, 
      rotationScheduled,
      behavioralFingerprint,
      additionalEntropy 
    }: EnhancedCSRFTokenRequest = await req.json()

    // Enhanced timestamp validation (prevent replay attacks)
    const currentTime = Date.now()
    const timeDiff = Math.abs(currentTime - timestamp)
    
    // Allow 2 minute window for time differences (more strict)
    if (timeDiff > 2 * 60 * 1000) {
      return new Response(
        JSON.stringify({ error: 'Invalid timestamp - potential replay attack' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate session ID format for additional security
    if (!sessionId || sessionId.length < 16 || !/^[a-zA-Z0-9\-_]+$/.test(sessionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid session identifier format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate enhanced cryptographically secure token with additional entropy sources
    const randomBytes = crypto.getRandomValues(new Uint8Array(64))
    const timestampBytes = new TextEncoder().encode(timestamp.toString())
    const sessionBytes = new TextEncoder().encode(sessionId)
    const entropyBytes = entropy ? new TextEncoder().encode(entropy) : new Uint8Array(0)
    const userAgentBytes = userAgent ? new TextEncoder().encode(userAgent) : new Uint8Array(0)
    const behavioralBytes = behavioralFingerprint ? new TextEncoder().encode(behavioralFingerprint) : new Uint8Array(0)
    const additionalBytes = additionalEntropy ? new TextEncoder().encode(additionalEntropy) : new Uint8Array(0)
    const serverEntropyBytes = crypto.getRandomValues(new Uint8Array(32)) // Additional server entropy
    
    // Combine all entropy sources for maximum security
    const combinedBytes = new Uint8Array(
      randomBytes.length + 
      timestampBytes.length + 
      sessionBytes.length + 
      entropyBytes.length + 
      userAgentBytes.length +
      behavioralBytes.length +
      additionalBytes.length +
      serverEntropyBytes.length
    )
    
    let offset = 0
    combinedBytes.set(randomBytes, offset)
    offset += randomBytes.length
    combinedBytes.set(timestampBytes, offset)
    offset += timestampBytes.length
    combinedBytes.set(sessionBytes, offset)
    offset += sessionBytes.length
    combinedBytes.set(entropyBytes, offset)
    offset += entropyBytes.length
    combinedBytes.set(userAgentBytes, offset)
    offset += userAgentBytes.length
    combinedBytes.set(behavioralBytes, offset)
    offset += behavioralBytes.length
    combinedBytes.set(additionalBytes, offset)
    offset += additionalBytes.length
    combinedBytes.set(serverEntropyBytes, offset)

    // Generate final token using SHA-512
    const hashBuffer = await crypto.subtle.digest('SHA-512', combinedBytes)
    const hashArray = new Uint8Array(hashBuffer)
    const token = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('')

    // Calculate expiration (default 1 hour, shorter for high-risk scenarios)
    const expirationHours = rotationScheduled ? 0.5 : 1 // 30 minutes if rotation is scheduled
    const expiresAt = new Date(currentTime + (expirationHours * 60 * 60 * 1000))

    // Store token in database with enhanced metadata
    const { error: insertError } = await supabase
      .from('security_configs')
      .insert({
        config_key: `csrf_token_${sessionId}`,
        config_value: {
          token_hash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)),
          session_id: sessionId,
          created_at: new Date(currentTime).toISOString(),
          expires_at: expiresAt.toISOString(),
          user_agent_hash: userAgent ? await crypto.subtle.digest('SHA-256', new TextEncoder().encode(userAgent)) : null,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          entropy_provided: !!entropy,
          rotation_scheduled: rotationScheduled || false,
          security_level: 'enhanced'
        },
        is_active: true
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store token securely' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log enhanced security event using optimized logger
    await supabase.functions.invoke('security-event-optimizer', {
      body: {
        event_type: 'enhanced_csrf_token_generated',
        severity: 'info',
        event_data: {
          session_id: sessionId,
          token_expiration: expiresAt.toISOString(),
          security_level: 'enhanced',
          entropy_sources: {
            crypto_random: true,
            timestamp: true,
            session_id: true,
            user_agent: !!userAgent,
            client_entropy: !!entropy
          },
          rotation_scheduled: rotationScheduled || false
        },
        user_agent: userAgent,
        source: 'enhanced_csrf_generation'
      }
    })

    return new Response(
      JSON.stringify({
        token,
        expiresAt: expiresAt.toISOString(),
        securityLevel: 'enhanced',
        rotationScheduled: rotationScheduled || false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Enhanced CSRF token generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during token generation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})