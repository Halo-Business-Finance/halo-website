import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ConsultationSchema = z.object({
  encrypted_name: z.string().min(1).max(500),
  encrypted_email: z.string().min(1).max(500),
  encrypted_phone: z.string().max(500).optional(),
  company: z.string().max(200).optional(),
  loan_program: z.string().min(1).max(100),
  loan_amount: z.string().min(1).max(50),
  timeframe: z.string().min(1).max(50),
  message: z.string().max(2000).optional(),
  user_id: z.string().uuid(),
  csrf_token: z.string().optional(),
});

interface ConsultationRequest extends z.infer<typeof ConsultationSchema> {}

interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input with zod schema
    const rawData = await req.json();
    
    const validationResult = ConsultationSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
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
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
    
    // Sanitize non-encrypted inputs to prevent XSS
    const sanitizeInput = (input: string): string => {
      return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                  .replace(/<[^>]*>/g, '')
                  .trim();
    };
    
    const consultationData: ConsultationRequest = {
      encrypted_name: validationResult.data.encrypted_name,
      encrypted_email: validationResult.data.encrypted_email,
      encrypted_phone: validationResult.data.encrypted_phone,
      company: validationResult.data.company ? sanitizeInput(validationResult.data.company) : undefined,
      loan_program: sanitizeInput(validationResult.data.loan_program),
      loan_amount: sanitizeInput(validationResult.data.loan_amount),
      timeframe: sanitizeInput(validationResult.data.timeframe),
      message: validationResult.data.message ? sanitizeInput(validationResult.data.message) : undefined,
      user_id: validationResult.data.user_id,
      csrf_token: validationResult.data.csrf_token
    };
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store consultation in database with properly encrypted data
    const { data: consultation, error: dbError } = await supabase
      .from('consultations')
      .insert({
        encrypted_name: consultationData.encrypted_name,
        encrypted_email: consultationData.encrypted_email,
        encrypted_phone: consultationData.encrypted_phone,
        company: consultationData.company,
        loan_program: consultationData.loanProgram,
        loan_amount: consultationData.loanAmount,
        timeframe: consultationData.timeframe,
        message: consultationData.message,
        user_id: consultationData.user_id,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save consultation');
    }

    // Get Microsoft Graph API credentials
    const clientId = Deno.env.get('MICROSOFT_GRAPH_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_GRAPH_CLIENT_SECRET');
    const tenantId = Deno.env.get('MICROSOFT_GRAPH_TENANT_ID');

    if (!clientId || !clientSecret || !tenantId) {
      throw new Error('Microsoft Graph API credentials not configured');
    }

    // Get access token from Microsoft
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams,
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Token error:', tokenError);
      throw new Error('Failed to get Microsoft access token');
    }

    const tokenData: MicrosoftTokenResponse = await tokenResponse.json();

    // Prepare email content with HTML escaping for security
    const escapeHtml = (unsafe: string): string => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    
    const subject = `New Encrypted Consultation Request - ID: ${consultation.id}`;
    const emailBody = `
      <h2>New Consultation Request (Encrypted Data)</h2>
      <p><strong>Consultation ID:</strong> ${consultation.id}</p>
      <p><strong>User ID:</strong> ${consultationData.user_id}</p>
      <p><strong>Company:</strong> ${consultationData.company ? escapeHtml(consultationData.company) : 'Not provided'}</p>
      <p><strong>Loan Program:</strong> ${escapeHtml(consultationData.loanProgram)}</p>
      <p><strong>Loan Amount:</strong> ${escapeHtml(consultationData.loanAmount)}</p>
      <p><strong>Timeframe:</strong> ${escapeHtml(consultationData.timeframe)}</p>
      ${consultationData.message ? `<p><strong>Message:</strong> ${escapeHtml(consultationData.message)}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <br>
      <p><strong>⚠️ SECURITY NOTICE:</strong></p>
      <ul>
        <li>PII (Name, Email, Phone) is encrypted in database</li>
        <li>Access consultation details via secure admin dashboard</li>
        <li>Consultation ID: ${consultation.id}</li>
      </ul>
    `;

    // Send email via Microsoft Graph API (configurable business email)
    const businessEmail = Deno.env.get('BUSINESS_EMAIL');
    if (!businessEmail) {
      throw new Error('BUSINESS_EMAIL environment variable not configured');
    }
    const emailUrl = `https://graph.microsoft.com/v1.0/users/${businessEmail}/sendMail`;
    const emailData = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: emailBody,
        },
        toRecipients: [
          {
            emailAddress: {
              address: businessEmail,
            },
          },
        ],
      },
    };

    const emailResponse = await fetch(emailUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error('Email error:', emailError);
      throw new Error('Failed to send email via Microsoft Graph');
    }

    console.log('Consultation saved and email sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        consultationId: consultation.id,
        message: 'Consultation submitted successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-consultation-email function:', error);
    
    // Enhanced error handling - don't expose internal errors to client
    let clientMessage = 'An error occurred while processing your request. Please try again.';
    let statusCode = 500;
    
    if (error.message.includes('Missing required fields') || 
        error.message.includes('Invalid email format')) {
      clientMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('authentication') || 
               error.message.includes('permission')) {
      clientMessage = 'Authentication required. Please sign in and try again.';
      statusCode = 401;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: clientMessage
      }),
      {
        status: statusCode,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);