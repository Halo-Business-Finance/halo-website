import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface LoginRequest {
  email: string
  password: string
}

interface AuthResponse {
  success: boolean
  token?: string
  user?: any
  error?: string
}

// Geo-blocking check helper
async function checkGeoBlock(ip: string, email?: string): Promise<{ allowed: boolean; reason?: string; risk_score: number }> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const response = await fetch(`${supabaseUrl}/functions/v1/geo-block-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ ip_address: ip, admin_email: email, action: 'login' })
    });
    
    if (!response.ok) {
      console.warn('[Admin Auth] Geo-block check failed, allowing access');
      return { allowed: true, risk_score: 0 };
    }
    
    return await response.json();
  } catch (error) {
    console.error('[Admin Auth] Geo-block check error:', error);
    return { allowed: true, risk_score: 0 }; // Fail open for availability
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get client IP early for geo-blocking
    const xff = req.headers.get('x-forwarded-for')
    const clientIp = xff ? xff.split(',')[0].trim() : (req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || '127.0.0.1')
    
    if (req.method === 'POST') {
      const payload: Partial<LoginRequest & { action?: string; token?: string }> = await req.json()
      
      // Profile/session verification
      if (payload.action === 'profile') {
        const token = payload.token
        if (!token) {
          return new Response(
            JSON.stringify({ success: false, error: 'Token required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Validate admin session
        const { data: session, error: sessionError } = await supabase
          .from('admin_sessions')
          .select('admin_user_id, expires_at')
          .eq('session_token', token)
          .single()

        if (sessionError || !session) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid or expired session' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Check expiration
        if (session.expires_at && new Date(session.expires_at as unknown as string) < new Date()) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session expired' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Get admin email from session to use secure profile function
        const { data: sessionAdmin, error: sessionAdminError } = await supabase
          .from('admin_sessions')
          .select('admin_user_id')
          .eq('session_token', token)
          .single()

        if (sessionAdminError || !sessionAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session lookup failed' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Get admin email from admin_users to use with secure function
        const { data: adminEmail, error: emailError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('id', sessionAdmin.admin_user_id)
          .single()

        if (emailError || !adminEmail) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin lookup failed' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        // Fetch admin user profile using secure RPC function (excludes sensitive fields)
        const { data: adminProfiles, error: profileError } = await supabase
          .rpc('get_admin_profile_by_email', { admin_email: adminEmail.email })

        if (profileError || !adminProfiles || adminProfiles.length === 0) {
          console.error('[Admin Auth] Profile fetch error:', profileError)
          return new Response(
            JSON.stringify({ success: false, error: 'Admin not found or inactive' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const adminUser = adminProfiles[0]
        
        if (!adminUser.is_active) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin account is inactive' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('[Admin Auth] Profile retrieved via secure function for:', adminUser.email)

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: { 
              id: adminUser.id, 
              email: adminUser.email, 
              full_name: adminUser.full_name, 
              role: adminUser.role,
              security_clearance_level: adminUser.security_clearance_level,
              mfa_enabled: adminUser.mfa_enabled
            }
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Login flow
      const { email, password }: LoginRequest = payload as LoginRequest
      const normalizedEmail = email?.toLowerCase().trim()
      
      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Geo-blocking check before processing login
      const geoCheck = await checkGeoBlock(clientIp, normalizedEmail);
      
      if (!geoCheck.allowed) {
        console.warn(`[Admin Auth] Geo-blocked login attempt from ${clientIp}: ${geoCheck.reason}`);
        
        // Log blocked attempt
        await supabase.from('security_logs').insert({
          event_type: 'admin_login_geo_blocked',
          severity: 'critical',
          message: `Admin login blocked from suspicious location: ${geoCheck.reason}`,
          details: { 
            email: normalizedEmail, 
            ip: clientIp, 
            risk_score: geoCheck.risk_score,
            reason: geoCheck.reason 
          },
          ip_address: clientIp,
          user_agent: req.headers.get('user-agent') || 'unknown'
        });

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Access denied from your location. Contact administrator if this is unexpected.',
            geo_blocked: true
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Log if medium risk but allowed
      if (geoCheck.risk_score >= 40) {
        await supabase.from('security_logs').insert({
          event_type: 'admin_login_unusual_location',
          severity: 'warning',
          message: `Admin login from unusual location allowed with monitoring`,
          details: { 
            email: normalizedEmail, 
            ip: clientIp, 
            risk_score: geoCheck.risk_score 
          },
          ip_address: clientIp,
          user_agent: req.headers.get('user-agent') || 'unknown'
        });
      }

      // Verify admin user credentials
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('is_active', true)
        .single()

      if (userError || !adminUser) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Verify password using bcrypt
      const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts')
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash)

      if (!isPasswordValid) {
        // Increment failed login attempts
        await supabase
          .from('admin_users')
          .update({ 
            failed_login_attempts: (adminUser.failed_login_attempts || 0) + 1 
          })
          .eq('id', adminUser.id)

        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Reset failed login attempts on successful login
      await supabase
        .from('admin_users')
        .update({ failed_login_attempts: 0 })
        .eq('id', adminUser.id)

      // Generate session token with hash
      const sessionToken = crypto.randomUUID()
      const tokenSalt = crypto.randomUUID()
      const encoder = new TextEncoder()
      const tokenData = encoder.encode(sessionToken + tokenSalt)
      const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const sessionTokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

      // Create session with hashed token
      const userAgent = req.headers.get('user-agent') || null

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUser.id,
          session_token_hash: sessionTokenHash,
          token_salt: tokenSalt,
          expires_at: expiresAt.toISOString(),
          ip_address: clientIp,
          user_agent: userAgent
        })

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create session' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id)

      // Log security event
      await supabase
        .from('security_logs')
        .insert({
          event_type: 'admin_login',
          severity: 'info',
          message: `Admin user ${email} logged in successfully`,
          details: { admin_id: adminUser.id, ip: req.headers.get('x-forwarded-for') },
          admin_user_id: adminUser.id,
           ip_address: clientIp,
           user_agent: userAgent
        })

      const response: AuthResponse = {
        success: true,
        token: sessionToken,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role
        }
      }

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Logout endpoint
    if (req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing authorization token' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const token = authHeader.substring(7)

      // Verify and get admin session
      const adminId = await supabase.rpc('verify_admin_session', { token })

      if (adminId) {
        // Remove session
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', token)

        // Log security event
        await supabase
          .from('security_logs')
          .insert({
            event_type: 'admin_logout',
            severity: 'info',
            message: 'Admin user logged out successfully',
            admin_user_id: adminId,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          })
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})