import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify admin authentication
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
    
    // Verify admin session directly
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_user_id, expires_at')
      .eq('session_token', token)
      .single()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired admin session' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (session.expires_at && new Date(session.expires_at as unknown as string) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session expired' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const adminId = session.admin_user_id

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // GET - Fetch CMS content
    if (req.method === 'GET') {
      const pageSlug = url.searchParams.get('page_slug')
      const sectionName = url.searchParams.get('section_name')

      let query = supabase.from('cms_content').select('*')
      
      if (pageSlug) {
        query = query.eq('page_slug', pageSlug)
      }
      
      if (sectionName) {
        query = query.eq('section_name', sectionName)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('CMS fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch content' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // POST - Create/Update CMS content
    if (req.method === 'POST') {
      const body = await req.json()
      const { page_slug, section_name, content_key, content_value, content_type = 'text', is_published = true } = body

      if (!page_slug || !section_name || !content_key || !content_value) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing required fields' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data, error } = await supabase
        .from('cms_content')
        .upsert({
          page_slug,
          section_name,
          content_key,
          content_value,
          content_type,
          is_published,
          updated_by: adminId
        }, {
          onConflict: 'page_slug,section_name,content_key'
        })
        .select()

      if (error) {
        console.error('CMS upsert error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to save content' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Log audit trail
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminId,
          action: 'cms_content_updated',
          table_name: 'cms_content',
          record_id: data?.[0]?.id,
          new_values: { page_slug, section_name, content_key, content_value },
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        })

      return new Response(
        JSON.stringify({ success: true, data: data?.[0] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // DELETE - Remove CMS content
    if (req.method === 'DELETE') {
      const contentId = url.searchParams.get('id')
      
      if (!contentId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Content ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabase
        .from('cms_content')
        .delete()
        .eq('id', contentId)

      if (error) {
        console.error('CMS delete error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to delete content' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Log audit trail
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminId,
          action: 'cms_content_deleted',
          table_name: 'cms_content',
          record_id: contentId,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        })

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
    console.error('Admin CMS error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})