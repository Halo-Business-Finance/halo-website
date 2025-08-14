import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MaskingRequest {
  data: any;
  fields_to_mask: string[];
  masking_level: 'partial' | 'full' | 'format_preserving';
  user_role?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authentication check
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authorization.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: userRole } = await supabase.rpc('get_user_role', { _user_id: user.id });

    const requestData: MaskingRequest = await req.json();
    
    // Validate request
    if (!requestData.data || !requestData.fields_to_mask) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Apply data masking based on user role and masking level
    const maskedData = maskSensitiveData(
      requestData.data,
      requestData.fields_to_mask,
      requestData.masking_level || 'partial',
      userRole || 'user'
    );

    // Log data access for audit
    await supabase.functions.invoke('log-security-event', {
      body: {
        event_type: 'sensitive_data_accessed',
        severity: 'medium',
        user_id: user.id,
        event_data: {
          fields_accessed: requestData.fields_to_mask,
          masking_level: requestData.masking_level,
          user_role: userRole,
          data_type: typeof requestData.data === 'object' ? 'object' : typeof requestData.data
        },
        source: 'data_masking_service'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      masked_data: maskedData,
      masking_applied: requestData.fields_to_mask
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Data masking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Data masking failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

function maskSensitiveData(data: any, fieldsToMask: string[], maskingLevel: string, userRole: string): any {
  if (!data) return data;

  // Admin users get less masking
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item, fieldsToMask, maskingLevel, userRole));
  }

  if (typeof data === 'object') {
    const maskedObject = { ...data };

    for (const field of fieldsToMask) {
      if (maskedObject.hasOwnProperty(field) && maskedObject[field]) {
        maskedObject[field] = maskField(maskedObject[field], field, maskingLevel, isAdmin, isModerator);
      }
    }

    return maskedObject;
  }

  return data;
}

function maskField(value: string, fieldName: string, maskingLevel: string, isAdmin: boolean, isModerator: boolean): string {
  if (!value || typeof value !== 'string') return value;

  // Admins see more data
  if (isAdmin) {
    return maskingLevel === 'full' ? maskFullValue(value, fieldName) : maskPartialValue(value, fieldName, 0.3);
  }

  // Moderators get partial masking
  if (isModerator) {
    return maskingLevel === 'full' ? maskFullValue(value, fieldName) : maskPartialValue(value, fieldName, 0.5);
  }

  // Regular users get heavy masking
  switch (maskingLevel) {
    case 'full':
      return maskFullValue(value, fieldName);
    case 'format_preserving':
      return maskFormatPreserving(value, fieldName);
    case 'partial':
    default:
      return maskPartialValue(value, fieldName, 0.8);
  }
}

function maskFullValue(value: string, fieldName: string): string {
  const maskingPatterns: Record<string, string> = {
    'email': '[MASKED_EMAIL]',
    'phone': '[MASKED_PHONE]',
    'name': '[MASKED_NAME]',
    'ssn': '[MASKED_SSN]',
    'account': '[MASKED_ACCOUNT]',
    'address': '[MASKED_ADDRESS]'
  };

  // Check if field name contains common sensitive field indicators
  for (const [pattern, mask] of Object.entries(maskingPatterns)) {
    if (fieldName.toLowerCase().includes(pattern)) {
      return mask;
    }
  }

  return '[MASKED_DATA]';
}

function maskPartialValue(value: string, fieldName: string, maskRatio: number): string {
  if (value.length <= 2) return '**';

  const fieldType = detectFieldType(value, fieldName);
  
  switch (fieldType) {
    case 'email':
      return maskEmail(value, maskRatio);
    case 'phone':
      return maskPhone(value, maskRatio);
    case 'ssn':
      return maskSSN(value);
    case 'name':
      return maskName(value, maskRatio);
    default:
      return maskGeneric(value, maskRatio);
  }
}

function maskFormatPreserving(value: string, fieldName: string): string {
  const fieldType = detectFieldType(value, fieldName);
  
  switch (fieldType) {
    case 'email':
      const [local, domain] = value.split('@');
      return `${local.charAt(0)}***@${domain}`;
    case 'phone':
      return value.replace(/\d/g, (match, index) => index < 3 || index >= value.length - 2 ? match : '*');
    case 'ssn':
      return value.replace(/\d/g, (match, index) => index >= value.length - 4 ? match : '*');
    default:
      return maskGeneric(value, 0.7);
  }
}

function detectFieldType(value: string, fieldName: string): string {
  const lowerFieldName = fieldName.toLowerCase();
  
  if (lowerFieldName.includes('email') || value.includes('@')) return 'email';
  if (lowerFieldName.includes('phone') || /^\+?[\d\-\(\)\s]+$/.test(value)) return 'phone';
  if (lowerFieldName.includes('ssn') || /^\d{3}-?\d{2}-?\d{4}$/.test(value)) return 'ssn';
  if (lowerFieldName.includes('name')) return 'name';
  
  return 'generic';
}

function maskEmail(email: string, maskRatio: number): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  
  const localMasked = maskGeneric(local, maskRatio);
  const [domainName, tld] = domain.split('.');
  const domainMasked = maskGeneric(domainName, Math.min(maskRatio, 0.6));
  
  return `${localMasked}@${domainMasked}.${tld}`;
}

function maskPhone(phone: string, maskRatio: number): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  const masked = digits.split('').map((digit, index) => {
    if (index < 3 || index >= digits.length - 2) return digit;
    return Math.random() < maskRatio ? '*' : digit;
  }).join('');
  
  // Preserve original formatting
  let result = phone;
  let digitIndex = 0;
  for (let i = 0; i < result.length; i++) {
    if (/\d/.test(result[i])) {
      result = result.substring(0, i) + masked[digitIndex] + result.substring(i + 1);
      digitIndex++;
    }
  }
  
  return result;
}

function maskSSN(ssn: string): string {
  return ssn.replace(/\d/g, (match, index) => {
    const cleanIndex = ssn.replace(/\D/g, '').indexOf(match);
    return cleanIndex >= ssn.replace(/\D/g, '').length - 4 ? match : '*';
  });
}

function maskName(name: string, maskRatio: number): string {
  const parts = name.split(' ');
  return parts.map((part, index) => {
    if (part.length <= 1) return part;
    if (index === 0) {
      // First name: show first letter
      return part.charAt(0) + '*'.repeat(Math.max(1, part.length - 1));
    }
    // Other parts: apply masking ratio
    return maskGeneric(part, maskRatio);
  }).join(' ');
}

function maskGeneric(value: string, maskRatio: number): string {
  if (value.length <= 1) return value;
  
  const numToMask = Math.floor(value.length * maskRatio);
  const keepStart = Math.max(1, Math.floor((value.length - numToMask) / 2));
  const keepEnd = Math.max(1, value.length - numToMask - keepStart);
  
  return value.substring(0, keepStart) + 
         '*'.repeat(numToMask) + 
         value.substring(value.length - keepEnd);
}

serve(handler);
