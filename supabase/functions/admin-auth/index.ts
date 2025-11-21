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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
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

        // Fetch admin user profile
        const { data: adminUser, error: userError } = await supabase
          .from('admin_users')
          .select('id, email, full_name, role, is_active')
          .eq('id', session.admin_user_id)
          .single()

        if (userError || !adminUser || !adminUser.is_active) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin not found or inactive' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: { 
              id: adminUser.id, 
              email: adminUser.email, 
              full_name: adminUser.full_name, 
              role: adminUser.role 
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

      // Generate session token
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

      // Create session
      const xff = req.headers.get('x-forwarded-for')
      const clientIp = xff ? xff.split(',')[0].trim() : (req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || null)
      const userAgent = req.headers.get('user-agent') || null

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUser.id,
          session_token: sessionToken,
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