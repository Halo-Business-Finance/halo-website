import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminAuthRequest {
  action: 'login' | 'profile' | 'update_profile'
  email?: string
  password_hash?: string
  full_name?: string
  security_clearance_level?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, email, password_hash, full_name, security_clearance_level }: AdminAuthRequest = await req.json()
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    console.log(`Secure admin auth request: ${action} from IP: ${clientIP}`)

    switch (action) {
      case 'login':
        if (!email || !password_hash) {
          return new Response(
            JSON.stringify({ success: false, error: 'Email and password hash required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Use secure login function that doesn't expose sensitive data
        const { data: loginResult, error: loginError } = await supabase.rpc('secure_admin_login', {
          p_email: email,
          p_password_hash: password_hash
        })

        if (loginError) {
          console.error('Admin login error:', loginError)
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication failed' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify(loginResult),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'profile':
        // Get JWT token from Authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Authorization required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create authenticated client
        const token = authHeader.replace('Bearer ', '')
        const authSupabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: {
                Authorization: authHeader
              }
            }
          }
        )

        // Use secure profile function
        const { data: profileData, error: profileError } = await authSupabase.rpc('get_admin_profile_secure')

        if (profileError) {
          console.error('Admin profile error:', profileError)
          return new Response(
            JSON.stringify({ success: false, error: 'Profile access failed' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, profile: profileData?.[0] || null }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update_profile':
        // Get JWT token from Authorization header
        const updateAuthHeader = req.headers.get('Authorization')
        if (!updateAuthHeader?.startsWith('Bearer ')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Authorization required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create authenticated client
        const updateAuthSupabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: {
                Authorization: updateAuthHeader
              }
            }
          }
        )

        // Use secure update function
        const { data: updateResult, error: updateError } = await updateAuthSupabase.rpc('update_admin_profile_secure', {
          p_full_name: full_name || null,
          p_security_clearance_level: security_clearance_level || null
        })

        if (updateError) {
          console.error('Admin profile update error:', updateError)
          return new Response(
            JSON.stringify({ success: false, error: 'Profile update failed' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, updated: updateResult }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Secure admin auth error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})