import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const LeadSubmissionSchema = z.object({
  form_type: z.string().min(1).max(100),
  submitted_data: z.record(z.unknown()),
});

const LeadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'rejected']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: z.string().uuid().optional(),
  notes: z.string().max(5000).optional(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    
    // POST endpoint for public form submissions (no auth required)
    if (req.method === 'POST') {
      const body = await req.json()
      
      const validationResult = LeadSubmissionSchema.safeParse(body);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid input data',
            details: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      const { form_type, submitted_data } = validationResult.data;

      // Parse IP address - x-forwarded-for can contain multiple IPs, take the first one and validate
      const forwardedFor = req.headers.get('x-forwarded-for') || ''
      const firstIp = forwardedFor.split(',')[0]?.trim()
      const ipCandidate = firstIp && firstIp !== '' ? firstIp : null
      const ipValid = ipCandidate && /^[0-9a-fA-F:.]+$/.test(ipCandidate) ? ipCandidate : null

      const { data, error } = await supabase
        .from('lead_submissions')
        .insert({
          form_type,
          submitted_data,
          ip_address: ipValid,
          user_agent: req.headers.get('user-agent') || 'unknown',
          referrer: req.headers.get('referer'),
          utm_source: submitted_data.utm_source,
          utm_medium: submitted_data.utm_medium,
          utm_campaign: submitted_data.utm_campaign
        })
        .select()

      if (error) {
        console.error('Lead creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create lead' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: data?.[0] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // All other endpoints require admin authentication
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

    // GET - Fetch lead submissions
    if (req.method === 'GET') {
      const status = url.searchParams.get('status')
      const formType = url.searchParams.get('form_type')
      const priority = url.searchParams.get('priority')
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const offset = (page - 1) * limit

      let query = supabase
        .from('lead_submissions')
        .select(`
          *,
          assigned_to_user:assigned_to(full_name, email)
        `)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      if (formType) {
        query = query.eq('form_type', formType)
      }

      if (priority) {
        query = query.eq('priority', priority)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Leads fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch leads' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get statistics
      const { data: stats } = await supabase
        .from('lead_submissions')
        .select('status, form_type, priority')

      const statistics = {
        total: count || 0,
        by_status: {} as Record<string, number>,
        by_form_type: {} as Record<string, number>,
        by_priority: {} as Record<string, number>
      }

      if (stats) {
        stats.forEach(lead => {
          statistics.by_status[lead.status] = (statistics.by_status[lead.status] || 0) + 1
          statistics.by_form_type[lead.form_type] = (statistics.by_form_type[lead.form_type] || 0) + 1
          statistics.by_priority[lead.priority] = (statistics.by_priority[lead.priority] || 0) + 1
        })
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data,
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          },
          statistics
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // PUT - Update lead submission
    if (req.method === 'PUT') {
      const leadId = url.searchParams.get('id')
      const body = await req.json()
      
      if (!leadId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Lead ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const validationResult = LeadUpdateSchema.safeParse(body);
      
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid update data',
            details: validationResult.error.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const updateData: any = validationResult.data;

      const { data, error } = await supabase
        .from('lead_submissions')
        .update(updateData)
        .eq('id', leadId)
        .select()

      if (error) {
        console.error('Lead update error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update lead' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Log audit trail
      const auditForwardedFor = req.headers.get('x-forwarded-for') || ''
      const auditFirstIp = auditForwardedFor.split(',')[0]?.trim()
      const auditIp = auditFirstIp && /^[0-9a-fA-F:.]+$/.test(auditFirstIp) ? auditFirstIp : null

      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminId,
          action: 'lead_updated',
          table_name: 'lead_submissions',
          record_id: leadId,
          new_values: updateData,
          ip_address: auditIp,
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


    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Admin leads error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})