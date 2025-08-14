import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConsultationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  loanProgram: string;
  loanAmount: string;
  timeframe: string;
  message?: string;
  user_id?: string;
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
    const consultationData: ConsultationRequest = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store consultation in database
    const { data: consultation, error: dbError } = await supabase
      .from('consultations')
      .insert({
        name: consultationData.name,
        email: consultationData.email,
        phone: consultationData.phone,
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

    // Prepare email content
    const subject = `New Consultation Request - ${consultationData.name}`;
    const emailBody = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${consultationData.name}</p>
      <p><strong>Email:</strong> ${consultationData.email}</p>
      ${consultationData.phone ? `<p><strong>Phone:</strong> ${consultationData.phone}</p>` : ''}
      ${consultationData.company ? `<p><strong>Company:</strong> ${consultationData.company}</p>` : ''}
      <p><strong>Loan Program:</strong> ${consultationData.loanProgram}</p>
      <p><strong>Loan Amount:</strong> ${consultationData.loanAmount}</p>
      <p><strong>Timeframe:</strong> ${consultationData.timeframe}</p>
      ${consultationData.message ? `<p><strong>Message:</strong> ${consultationData.message}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
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
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);