import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

// Zod schemas for request validation
const LeadSubmissionSchema = z.object({
  form_type: z.string().min(1, "Form type is required").max(50, "Form type too long"),
  submitted_data: z.record(z.unknown()).refine(
    (data) => Object.keys(data).length > 0,
    "Submitted data cannot be empty"
  ),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

const LeadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  assigned_to: z.string().uuid("Invalid assigned_to ID").optional(),
  notes: z.string().max(5000, "Notes too long").optional(),
});

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().max(50).optional(),
  form_type: z.string().max(50).optional(),
  priority: z.string().max(20).optional(),
});

// Helper to validate IP address format
const isValidIp = (ip: string): boolean => /^[0-9a-fA-F:.]+$/.test(ip);

// Helper to extract and validate IP from headers
const extractValidIp = (req: Request): string | null => {
  const forwardedFor = req.headers.get('x-forwarded-for') || '';
  const firstIp = forwardedFor.split(',')[0]?.trim();
  return firstIp && firstIp !== '' && isValidIp(firstIp) ? firstIp : null;
};

// CSRF token validation helper
async function validateCSRFToken(supabase: ReturnType<typeof createClient>, token: string): Promise<{ isValid: boolean; reason?: string }> {
  if (!token) {
    return { isValid: false, reason: 'Token is required' };
  }

  const { data: tokenData, error: fetchError } = await supabase
    .from('security_configs')
    .select('*')
    .eq('config_key', `csrf_token_${token}`)
    .eq('is_active', true)
    .single();

  if (fetchError || !tokenData) {
    return { isValid: false, reason: 'Invalid token' };
  }

  const tokenConfig = tokenData.config_value as { expires: number; sessionId?: string };
  const currentTime = Date.now();

  // Check if token has expired
  if (currentTime > tokenConfig.expires) {
    await supabase
      .from('security_configs')
      .update({ is_active: false })
      .eq('id', tokenData.id);
    return { isValid: false, reason: 'Token expired' };
  }

  // Mark token as used (one-time use)
  await supabase
    .from('security_configs')
    .update({ 
      is_active: false,
      config_value: {
        ...tokenConfig,
        used_at: currentTime
      }
    })
    .eq('id', tokenData.id);

  return { isValid: true };
}

// Rate limiting helper
async function checkRateLimit(supabase: ReturnType<typeof createClient>, ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  // Count recent requests from this IP
  const { count, error } = await supabase
    .from('security_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'lead_submission_attempt')
    .eq('ip_address', ip)
    .gte('created_at', windowStart);

  if (error) {
    console.error('Rate limit check error:', error);
    // Allow on error to not block legitimate requests
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  const currentCount = count || 0;
  const allowed = currentCount < RATE_LIMIT_MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentCount - 1);

  return { allowed, remaining };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    
    // POST endpoint for public form submissions (requires CSRF token)
    if (req.method === 'POST') {
      const ipValid = extractValidIp(req);
      
      // Rate limiting check
      if (ipValid) {
        const rateLimit = await checkRateLimit(supabase, ipValid);
        
        if (!rateLimit.allowed) {
          console.warn(`Rate limit exceeded for IP: ${ipValid}`);
          
          // Log rate limit exceeded event
          await supabase.from('security_events').insert({
            event_type: 'lead_submission_rate_limited',
            severity: 'medium',
            ip_address: ipValid,
            user_agent: req.headers.get('user-agent') || 'unknown',
            event_data: { reason: 'rate_limit_exceeded' }
          });
          
          return new Response(
            JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
            { 
              status: 429, 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Retry-After': '60'
              } 
            }
          );
        }
      }
      
      // CSRF token validation
      const csrfToken = req.headers.get('x-csrf-token');
      
      if (!csrfToken) {
        console.warn('Lead submission attempt without CSRF token');
        return new Response(
          JSON.stringify({ success: false, error: 'CSRF token required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const csrfValidation = await validateCSRFToken(supabase, csrfToken);
      
      if (!csrfValidation.isValid) {
        console.warn(`CSRF validation failed: ${csrfValidation.reason}`);
        
        // Log failed CSRF validation
        await supabase.from('security_events').insert({
          event_type: 'csrf_validation_failed',
          severity: 'high',
          ip_address: ipValid,
          user_agent: req.headers.get('user-agent') || 'unknown',
          event_data: { 
            reason: csrfValidation.reason,
            endpoint: 'admin-leads'
          }
        });
        
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid or expired CSRF token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Log the submission attempt for rate limiting tracking
      if (ipValid) {
        await supabase.from('security_events').insert({
          event_type: 'lead_submission_attempt',
          severity: 'info',
          ip_address: ipValid,
          user_agent: req.headers.get('user-agent') || 'unknown',
          event_data: { csrf_validated: true }
        });
      }
      
      const body = await req.json();
      
      // Validate request body with zod schema
      const validationResult = LeadSubmissionSchema.safeParse(body);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        console.error('Lead submission validation errors:', errors);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid request data', details: errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const validatedData = validationResult.data;

      const { data, error } = await supabase
        .from('lead_submissions')
        .insert({
          form_type: validatedData.form_type,
          submitted_data: validatedData.submitted_data,
          ip_address: ipValid,
          user_agent: req.headers.get('user-agent') || 'unknown',
          referrer: req.headers.get('referer'),
          utm_source: validatedData.utm_source,
          utm_medium: validatedData.utm_medium,
          utm_campaign: validatedData.utm_campaign
        })
        .select()

      if (error) {
        console.error('Lead creation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create lead' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Lead created successfully:', data?.[0]?.id);
      return new Response(
        JSON.stringify({ success: true, data: data?.[0] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // All other endpoints require admin authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.substring(7)
    const adminId = await supabase.rpc('verify_admin_session', { token })

    if (!adminId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET - Fetch lead submissions
    if (req.method === 'GET') {
      // Validate query parameters with zod schema
      const queryParams = {
        page: url.searchParams.get('page'),
        limit: url.searchParams.get('limit'),
        status: url.searchParams.get('status') || undefined,
        form_type: url.searchParams.get('form_type') || undefined,
        priority: url.searchParams.get('priority') || undefined,
      };
      
      const paginationResult = PaginationSchema.safeParse(queryParams);
      
      if (!paginationResult.success) {
        const errors = paginationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        console.error('Pagination validation errors:', errors);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid query parameters', details: errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { page, limit, status, form_type, priority } = paginationResult.data;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('lead_submissions')
        .select(`
          *,
          assigned_to_user:assigned_to(full_name, email)
        `)
      
      if (status) query = query.eq('status', status)
      if (form_type) query = query.eq('form_type', form_type)
      if (priority) query = query.eq('priority', priority)

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Leads fetch error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch leads' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT - Update lead submission
    if (req.method === 'PUT') {
      const leadId = url.searchParams.get('id')
      
      if (!leadId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Lead ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Validate UUID format for leadId
      const uuidSchema = z.string().uuid("Invalid lead ID format");
      const leadIdResult = uuidSchema.safeParse(leadId);
      
      if (!leadIdResult.success) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid lead ID format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      const body = await req.json();
      
      // Validate update body with zod schema
      const updateResult = LeadUpdateSchema.safeParse(body);
      
      if (!updateResult.success) {
        const errors = updateResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        console.error('Lead update validation errors:', errors);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid update data', details: errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const validatedUpdate = updateResult.data;
      
      // Build update object from validated data
      const updateData: Record<string, unknown> = {};
      if (validatedUpdate.status) updateData.status = validatedUpdate.status;
      if (validatedUpdate.priority) updateData.priority = validatedUpdate.priority;
      if (validatedUpdate.assigned_to) updateData.assigned_to = validatedUpdate.assigned_to;
      if (validatedUpdate.notes !== undefined) updateData.notes = validatedUpdate.notes;

      const { data, error } = await supabase
        .from('lead_submissions')
        .update(updateData)
        .eq('id', leadId)
        .select()

      if (error) {
        console.error('Lead update error:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update lead' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Log audit trail
      const auditIp = extractValidIp(req);

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

      console.log('Lead updated successfully:', leadId);
      return new Response(
        JSON.stringify({ success: true, data: data?.[0] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin leads error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})