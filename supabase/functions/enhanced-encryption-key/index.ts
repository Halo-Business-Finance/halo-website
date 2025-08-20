import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancedKeyRequest {
  sessionId: string;
  keyPurpose: 'form_encryption' | 'data_protection' | 'session_security';
  rotationRequested?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Require authentication for key generation
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for key generation' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { sessionId, keyPurpose, rotationRequested }: EnhancedKeyRequest = await req.json()

    // Validate session ID format
    if (!sessionId || sessionId.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Invalid session identifier' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check for existing active key
    const { data: existingKey } = await supabase
      .from('encryption_keys')
      .select('*')
      .eq('key_identifier', `${keyPurpose}_${sessionId}`)
      .eq('is_active', true)
      .single()

    // If key exists and no rotation requested, return existing key info
    if (existingKey && !rotationRequested) {
      // Update last used timestamp
      await supabase
        .from('encryption_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', existingKey.id)

      return new Response(
        JSON.stringify({
          keyId: existingKey.key_identifier,
          algorithm: existingKey.algorithm,
          expiresAt: existingKey.expires_at,
          rotationScheduled: existingKey.rotation_scheduled_at,
          securityLevel: 'enhanced'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate master encryption material
    const masterKey = Deno.env.get('MASTER_ENCRYPTION_KEY') || 'fallback_development_key_change_in_production'
    
    // Generate session-specific key derivation material
    const timestamp = Date.now()
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    const userIdBytes = new TextEncoder().encode(user.id)
    const sessionBytes = new TextEncoder().encode(sessionId)
    const purposeBytes = new TextEncoder().encode(keyPurpose)
    const timestampBytes = new TextEncoder().encode(timestamp.toString())
    
    // Combine all key material
    const keyMaterial = new Uint8Array(
      randomBytes.length + 
      userIdBytes.length + 
      sessionBytes.length + 
      purposeBytes.length + 
      timestampBytes.length
    )
    
    let offset = 0
    keyMaterial.set(randomBytes, offset)
    offset += randomBytes.length
    keyMaterial.set(userIdBytes, offset)
    offset += userIdBytes.length
    keyMaterial.set(sessionBytes, offset)
    offset += sessionBytes.length
    keyMaterial.set(purposeBytes, offset)
    offset += purposeBytes.length
    keyMaterial.set(timestampBytes, offset)

    // Derive key using PBKDF2-like approach with SHA-512
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iterations = 10000
    
    let derivedKey = await crypto.subtle.digest('SHA-512', keyMaterial)
    for (let i = 0; i < iterations; i++) {
      const combined = new Uint8Array(derivedKey.byteLength + salt.length)
      combined.set(new Uint8Array(derivedKey))
      combined.set(salt, derivedKey.byteLength)
      derivedKey = await crypto.subtle.digest('SHA-512', combined)
    }

    const keyHash = Array.from(new Uint8Array(derivedKey))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Generate encryption salt for key storage
    const encryptionSalt = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Set expiration based on purpose
    const expirationHours = keyPurpose === 'session_security' ? 2 : 24
    const expiresAt = new Date(timestamp + (expirationHours * 60 * 60 * 1000))

    // Schedule automatic rotation
    const rotationDate = new Date(timestamp + (expirationHours * 0.8 * 60 * 60 * 1000)) // 80% of expiration

    // Deactivate existing keys for this purpose/session
    if (existingKey) {
      await supabase
        .from('encryption_keys')
        .update({ is_active: false })
        .eq('key_identifier', `${keyPurpose}_${sessionId}`)
    }

    // Store new key
    const { data: newKey, error: insertError } = await supabase
      .from('encryption_keys')
      .insert({
        key_identifier: `${keyPurpose}_${sessionId}`,
        key_hash: keyHash.substring(0, 64), // Store first 64 chars as identifier
        algorithm: 'AES-256-GCM',
        encrypted_key_data: keyHash, // In production, this should be encrypted
        key_encryption_salt: encryptionSalt,
        expires_at: expiresAt.toISOString(),
        rotation_scheduled_at: rotationDate.toISOString(),
        is_active: true,
        access_log_enabled: true,
        last_used_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to store encryption key:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store encryption key securely' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log key generation event using optimized logger
    await supabase.functions.invoke('security-event-optimizer', {
      body: {
        event_type: 'enhanced_encryption_key_generated',
        severity: 'info',
        event_data: {
          key_purpose: keyPurpose,
          session_id: sessionId,
          algorithm: algorithm
        }
      }
    });
        user_id: user.id,
        key_algorithm: 'AES-256-GCM',
        expires_at: expiresAt.toISOString(),
        rotation_scheduled: rotationDate.toISOString(),
        security_level: 'enhanced',
        key_derivation_iterations: iterations
      },
      source: 'enhanced_key_generation'
    })

    return new Response(
      JSON.stringify({
        keyId: newKey.key_identifier,
        sessionEncryptionKey: keyHash.substring(0, 32), // Return first 32 chars for client use
        algorithm: 'AES-256-GCM',
        expiresAt: expiresAt.toISOString(),
        rotationScheduled: rotationDate.toISOString(),
        securityLevel: 'enhanced'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Enhanced encryption key generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during key generation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})