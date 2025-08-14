import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConsultationRequest {
  encrypted_name: string;
  encrypted_email: string;
  encrypted_phone?: string;
  company?: string;
  loanProgram: string;
  loanAmount: string;
  timeframe: string;
  message?: string;
  user_id: string;
  csrf_token?: string;
}

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
    // Enhanced input validation and sanitization
    const rawData = await req.json();
    
    // Validate required fields for encrypted data
    if (!rawData.encrypted_name || !rawData.encrypted_email || !rawData.loan_program) {
      throw new Error('Missing required encrypted fields');
    }
    
    // Validate user authentication
    if (!rawData.user_id) {
      throw new Error('User authentication required');
    }
    
    // Validate CSRF token if provided
    if (rawData.csrf_token && typeof rawData.csrf_token !== 'string') {
      throw new Error('Invalid CSRF token format');
    }
    
    // Sanitize inputs to prevent XSS
    const sanitizeInput = (input: string): string => {
      return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                  .replace(/<[^>]*>/g, '')
                  .trim()
                  .substring(0, 500); // Limit input length
    };
    
    const consultationData: ConsultationRequest = {
      encrypted_name: rawData.encrypted_name, // Keep encrypted
      encrypted_email: rawData.encrypted_email, // Keep encrypted  
      encrypted_phone: rawData.encrypted_phone || undefined, // Keep encrypted
      company: rawData.company ? sanitizeInput(rawData.company) : undefined,
      loanProgram: sanitizeInput(rawData.loan_program),
      loanAmount: rawData.loan_amount ? sanitizeInput(rawData.loan_amount) : '',
      timeframe: rawData.timeframe ? sanitizeInput(rawData.timeframe) : '',
      message: rawData.message ? sanitizeInput(rawData.message) : undefined,
      user_id: rawData.user_id,
      csrf_token: rawData.csrf_token
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
    const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const tenantId = Deno.env.get('MICROSOFT_TENANT_ID');

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

    // Send email via Microsoft Graph API
    const emailUrl = 'https://graph.microsoft.com/v1.0/users/varda@halobusinessfinance.com/sendMail';
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
              address: 'varda@halobusinessfinance.com',
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