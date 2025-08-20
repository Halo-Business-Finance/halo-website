import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidationRequest {
  input: string;
  type: 'email' | 'phone' | 'name' | 'text' | 'number';
  context?: string;
}

interface ValidationResponse {
  isValid: boolean;
  sanitizedInput: string;
  violations: string[];
  riskScore: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { input, type, context }: ValidationRequest = await req.json()

    // Enhanced input validation
    const violations: string[] = []
    let riskScore = 0

    // XSS pattern detection
    const xssPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /expression\s*\(/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ]

    xssPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        violations.push('XSS_ATTEMPT_DETECTED')
        riskScore += 50
      }
    })

    // SQL injection detection
    const sqlPatterns = [
      /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/gi,
      /(['"])\s*(or|and)\s+\1?\d+\1?\s*[=<>]/gi,
      /\/\*.*?\*\//g,
      /--[^\r\n]*/g
    ]

    sqlPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        violations.push('SQL_INJECTION_ATTEMPT')
        riskScore += 75
      }
    })

    // Type-specific validation
    let sanitizedInput = input
    
    switch (type) {
      case 'email':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)) {
          violations.push('INVALID_EMAIL_FORMAT')
          riskScore += 10
        }
        sanitizedInput = input.replace(/[^a-zA-Z0-9@._-]/g, '')
        break
        
      case 'phone':
        if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(input)) {
          violations.push('INVALID_PHONE_FORMAT')
          riskScore += 10
        }
        sanitizedInput = input.replace(/[^0-9\s\-\(\)\+]/g, '')
        break
        
      case 'name':
        if (!/^[a-zA-Z\s'\-]{1,100}$/.test(input)) {
          violations.push('INVALID_NAME_FORMAT')
          riskScore += 10
        }
        sanitizedInput = input.replace(/[^a-zA-Z\s'\-]/g, '')
        break
        
      case 'number':
        if (!/^[\d.]+$/.test(input)) {
          violations.push('INVALID_NUMBER_FORMAT')
          riskScore += 10
        }
        sanitizedInput = input.replace(/[^0-9.]/g, '')
        break
        
      default:
        // General text sanitization
        sanitizedInput = input
          .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
    }

    // Length validation
    const maxLengths = { email: 254, phone: 20, name: 100, number: 50, text: 1000 }
    const maxLength = maxLengths[type] || 1000
    
    if (input.length > maxLength) {
      violations.push('INPUT_TOO_LONG')
      riskScore += 15
      sanitizedInput = sanitizedInput.slice(0, maxLength)
    }

    // Check for suspicious patterns
    if (/[<>{}[\]\\]/g.test(input)) {
      violations.push('SUSPICIOUS_CHARACTERS')
      riskScore += 20
    }

    const isValid = violations.length === 0

    // Log security event if violations detected
    if (!isValid) {
      await supabase.rpc('log_client_security_event', {
        event_type: 'input_validation_violation',
        severity: riskScore > 50 ? 'high' : riskScore > 20 ? 'medium' : 'low',
        event_data: {
          input_type: type,
          violations,
          risk_score: riskScore,
          context,
          original_length: input.length,
          sanitized_length: sanitizedInput.length
        },
        source: 'input_validation'
      })
    }

    const response: ValidationResponse = {
      isValid,
      sanitizedInput,
      violations,
      riskScore
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Input validation error:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      isValid: false,
      sanitizedInput: '',
      violations: ['VALIDATION_ERROR'],
      riskScore: 100
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})