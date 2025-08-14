import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced input validation and sanitization
const validateAndSanitizeInput = (input: any): string => {
  if (typeof input !== 'string') {
    throw new Error('Question must be a string');
  }
  
  // Remove HTML/script tags and limit length
  const sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
    
  if (sanitized.length === 0) {
    throw new Error('Question cannot be empty');
  }
  
  if (sanitized.length > 1000) {
    throw new Error('Question too long (max 1000 characters)');
  }
  
  return sanitized;
};

// Rate limiting check
const checkRateLimit = async (req: Request): Promise<boolean> => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  const clientIP = req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-forwarded-for') || 
                   'unknown';
  
  const { data: rateLimitResult } = await supabase.functions.invoke('enhanced-rate-limit', {
    body: {
      endpoint: 'chat-with-ai',
      identifier: clientIP,
      action: 'chat_request'
    }
  });
  
  return rateLimitResult?.allowed !== false;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Request size validation
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10000) {
    return new Response(JSON.stringify({ error: 'Request payload too large' }), {
      status: 413,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Rate limiting check
    const rateLimitPassed = await checkRateLimit(req);
    if (!rateLimitPassed) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const question = validateAndSanitizeInput(requestBody.question);

    // Enhanced API key validation
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an AI assistant that provides information about Varda Dinkha, the Founder & CEO of Halo Business Finance. Here's what you know about him:

- Varda Dinkha founded Halo Business Finance in 2015 with a vision to transform business lending through innovative technology
- He is a full stack engineer with expertise in fintech, AI, and blockchain
- He brings a unique combination of technical innovation and financial industry expertise to the marketplace
- He is an NMLS Broker (ID: 2272778)
- He is a Fintech, AI & Blockchain Graduate
- His LinkedIn profile is: https://www.linkedin.com/in/vardad
- He leads Halo Business Finance, which is a nationwide SBA, Commercial and Equipment Loan Marketplace
- The company offers streamlined loan processes without the hassle of looking for the best interest rate or the right lender

Please answer questions about Varda Dinkha based on this information. If asked about something not covered in this information, politely indicate that you don't have that specific information about him.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in chat-with-ai function:', error);
    
    // Enhanced error handling - don't expose internal details
    let statusCode = 500;
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.message.includes('Question') || error.message.includes('too long')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes('API key')) {
      statusCode = 503;
      errorMessage = 'Service temporarily unavailable';
    } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
      statusCode = 429;
      errorMessage = 'Service temporarily overloaded. Please try again later.';
    }
    
    // Log security event for suspicious errors
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.functions.invoke('log-security-event', {
      body: {
        event_type: 'chat_ai_error',
        severity: statusCode >= 500 ? 'medium' : 'low',
        event_data: {
          error_type: error.constructor.name,
          status_code: statusCode,
          user_agent: req.headers.get('user-agent'),
          endpoint: 'chat-with-ai'
        },
        source: 'edge_function'
      }
    });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});