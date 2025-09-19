import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FirstAdminRequest {
  email: string;
  confirmationToken: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { email, confirmationToken }: FirstAdminRequest = await req.json();

      // Validate inputs
      if (!email || !confirmationToken) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Email and confirmation token are required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Security check: Only allow specific confirmation token
      if (confirmationToken !== 'HALO_ADMIN_INIT_2025') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid confirmation token' 
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if user exists in auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Unable to verify user existence' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const targetUser = authUsers.users.find(user => user.email === email);
      
      if (!targetUser) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'User not found. Please sign up first at /auth',
            requiresSignup: true
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!targetUser.email_confirmed_at) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Email not confirmed. Please check your email and confirm your account.',
            requiresConfirmation: true
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Use the create_first_admin function
      const { data: result, error: adminError } = await supabase.rpc('create_first_admin', {
        target_email: email,
        admin_password: null // Not using password-based admin system
      });

      if (adminError) {
        console.error('Error creating first admin:', adminError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: adminError.message || 'Failed to create admin account'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If result indicates success
      if (result && result.success) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'First admin account created successfully',
            user_id: result.user_id,
            nextSteps: [
              'You can now sign in at /admin',
              'Use the admin dashboard to create additional admin accounts',
              'Set up security configurations in the Security tab'
            ]
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: result?.error || 'Failed to create admin account',
            details: result
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // GET request - Check current admin status
    if (req.method === 'GET') {
      // Check if any admins exist
      const { data: adminCount, error: countError } = await supabase
        .from('user_roles')
        .select('id', { count: 'exact' })
        .eq('role', 'admin')
        .eq('is_active', true);

      if (countError) {
        console.error('Error checking admin count:', countError);
        return new Response(
          JSON.stringify({ error: 'Unable to check admin status' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const hasAdmins = (adminCount?.length || 0) > 0;

      return new Response(
        JSON.stringify({
          hasAdmins,
          adminCount: adminCount?.length || 0,
          canInitialize: !hasAdmins
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});