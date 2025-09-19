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
    const adminId = await supabase.rpc('verify_admin_session', { token })

    if (!adminId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const url = new URL(req.url)

    // GET - Fetch SEO settings
    if (req.method === 'GET') {
      const pageSlug = url.searchParams.get('page_slug')

      let query = supabase.from('seo_settings').select('*')
      
      if (pageSlug) {
        query = query.eq('page_slug', pageSlug)
      }

      const { data, error } = await query.order('updated_at', { ascending: false })

      if (error) {
        console.error('SEO fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch SEO settings' }),
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

    // POST - Create/Update SEO settings
    if (req.method === 'POST') {
      const body = await req.json()
      const { 
        page_slug, 
        meta_title, 
        meta_description, 
        meta_keywords,
        og_title,
        og_description,
        og_image,
        canonical_url,
        robots_meta,
        schema_markup,
        is_active = true
      } = body

      if (!page_slug) {
        return new Response(
          JSON.stringify({ success: false, error: 'Page slug is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data, error } = await supabase
        .from('seo_settings')
        .upsert({
          page_slug,
          meta_title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          canonical_url,
          robots_meta,
          schema_markup,
          is_active,
          updated_by: adminId
        }, {
          onConflict: 'page_slug'
        })
        .select()

      if (error) {
        console.error('SEO upsert error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to save SEO settings' }),
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
          action: 'seo_settings_updated',
          table_name: 'seo_settings',
          record_id: data?.[0]?.id,
          new_values: { page_slug, meta_title, meta_description },
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

    // DELETE - Remove SEO settings
    if (req.method === 'DELETE') {
      const seoId = url.searchParams.get('id')
      
      if (!seoId) {
        return new Response(
          JSON.stringify({ success: false, error: 'SEO ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabase
        .from('seo_settings')
        .delete()
        .eq('id', seoId)

      if (error) {
        console.error('SEO delete error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to delete SEO settings' }),
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
          action: 'seo_settings_deleted',
          table_name: 'seo_settings',
          record_id: seoId,
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
    console.error('Admin SEO error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})