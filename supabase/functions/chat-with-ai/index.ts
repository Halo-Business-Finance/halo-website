import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question) {
      throw new Error('Question is required');
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
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});