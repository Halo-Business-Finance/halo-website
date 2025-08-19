import React, { useState } from 'react';
import { useFormSecurity } from '@/components/security/FormSecurityProvider';
import { useRateLimit } from '@/components/security/EnhancedRateLimiter';
import { useDataProtection } from '@/components/security/DataProtectionProvider';
import { SecureFormValidator, securityValidationRules, validateFormData } from '@/components/security/SecureFormValidator';
import { SecureErrorHandler } from '@/components/security/SecureErrorHandler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  loan_program: string;
  loan_amount: string;
  timeframe: string;
  message: string;
}

export const SecureConsultationForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { generateCSRFToken, validateCSRFToken, encryptSensitiveData, sanitizeInput, validateInput } = useFormSecurity();
  const { checkRateLimit } = useRateLimit();
  const { encryptPII, sanitizeForStorage } = useDataProtection();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    loan_program: '',
    loan_amount: '',
    timeframe: '',
    message: ''
  });
  
  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  React.useEffect(() => {
    // Generate CSRF token on mount
    const token = generateCSRFToken();
    setCsrfToken(token);
  }, [generateCSRFToken]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const fieldRules = {
      name: securityValidationRules.name,
      email: securityValidationRules.email,
      phone: securityValidationRules.phone,
      company: securityValidationRules.company,
      message: securityValidationRules.message
    };

    const formDataRecord: Record<string, string> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      message: formData.message
    };
    const { isValid, errors } = validateFormData(formDataRecord, fieldRules);
    
    // Check required fields
    const requiredFields = ['name', 'email', 'loan_program', 'loan_amount', 'timeframe'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData].trim()) {
        errors[field] = errors[field] || [];
        errors[field].push(`${field.replace('_', ' ')} is required`);
      }
    });

    setValidationErrors(errors);
    return isValid && Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError(new Error('Please log in to submit a consultation request'));
      return;
    }

    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      setError(new Error('Security validation failed. Please refresh the page and try again.'));
      return;
    }

    // Validate form data
    if (!validateForm()) {
      setError(new Error('Please correct the validation errors below'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Enhanced rate limiting check
      const rateLimitPassed = await checkRateLimit('consultation_submit', 3);
      if (!rateLimitPassed) {
        toast({
          title: 'Rate limit exceeded',
          description: 'Please wait before submitting another consultation request.',
          variant: 'destructive',
        });
        return;
      }

      // Enhanced input validation with security logging
      const validations = [
        { field: 'name', value: formData.name, type: 'text' as const },
        { field: 'email', value: formData.email, type: 'email' as const },
        { field: 'phone', value: formData.phone, type: 'phone' as const },
        { field: 'company', value: formData.company, type: 'text' as const },
        { field: 'message', value: formData.message, type: 'text' as const },
      ];

      for (const validation of validations) {
        if (!validateInput(validation.value, validation.type)) {
          // Log validation failure for security monitoring
          await supabase.rpc('log_client_security_event', {
            event_type: 'form_validation_failure',
            severity: 'medium',
            event_data: { 
              field: validation.field, 
              validation_type: validation.type,
              form_type: 'consultation'
            },
            source: 'secure_consultation_form'
          });
          
          toast({
            title: 'Invalid input',
            description: `Please check your ${validation.field} format.`,
            variant: 'destructive',
          });
          return;
        }
      }

      // Enhanced encryption with multiple layers
      const encryptedData = {
        encrypted_name: encryptPII(sanitizeInput(formData.name)),
        encrypted_email: encryptPII(sanitizeInput(formData.email)),
        encrypted_phone: encryptPII(sanitizeInput(formData.phone || '')),
        company: sanitizeInput(formData.company),
        loan_program: formData.loan_program,
        loan_amount: formData.loan_amount,
        timeframe: formData.timeframe,
        message: encryptSensitiveData(sanitizeInput(formData.message)),
        user_id: user.id,
        status: 'pending'
      };

      // Enhanced sanitization for storage
      const sanitizedData = sanitizeForStorage(encryptedData);

      // Ensure data has required structure for database insert
      const finalData = {
        encrypted_name: sanitizedData.encrypted_name as string,
        encrypted_email: sanitizedData.encrypted_email as string,
        encrypted_phone: sanitizedData.encrypted_phone as string,
        company: sanitizedData.company as string,
        loan_program: sanitizedData.loan_program as string,
        loan_amount: sanitizedData.loan_amount as string,
        timeframe: sanitizedData.timeframe as string,
        message: sanitizedData.message as string,
        user_id: sanitizedData.user_id as string,
        status: sanitizedData.status as string
      };

      // Secure submission with enhanced logging
      const { error } = await supabase
        .from('consultations')
        .insert([finalData]);

      if (error) {
        // Log submission error for security monitoring
        await supabase.rpc('log_client_security_event', {
          event_type: 'consultation_submission_error',
          severity: 'high',
          event_data: { error: error.message, form_type: 'consultation' },
          source: 'secure_consultation_form'
        });
        throw error;
      }

      // Log successful submission
      await supabase.rpc('log_client_security_event', {
        event_type: 'consultation_submitted',
        severity: 'info',
        event_data: { 
          loan_program: formData.loan_program,
          loan_amount: formData.loan_amount,
          submission_secured: true
        },
        source: 'secure_consultation_form'
      });

      setIsSubmitted(true);
      toast({
        title: "Consultation Request Submitted",
        description: "Your secure consultation request has been submitted successfully.",
      });

      // Generate new CSRF token for security
      const newToken = generateCSRFToken();
      setCsrfToken(newToken);

    } catch (err) {
      console.error('Consultation submission error:', err);
      setError(err instanceof Error ? err : new Error('Failed to submit consultation request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-2xl font-semibold text-foreground">Request Submitted Successfully</h3>
            <p className="text-muted-foreground">
              Your consultation request has been securely submitted. Our team will review your information and contact you within 1-2 business days.
            </p>
            <Button onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                loan_program: '',
                loan_amount: '',
                timeframe: '',
                message: ''
              });
            }}>
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Secure Consultation Request
        </CardTitle>
        <CardDescription>
          All information is encrypted and securely transmitted. Required fields are marked with *.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="csrf_token" value={csrfToken} />
          
          {error && (
            <SecureErrorHandler 
              error={error} 
              context="consultation_form" 
              onRetry={() => setError(null)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              <SecureFormValidator 
                value={formData.name}
                rules={securityValidationRules.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              <SecureFormValidator 
                value={formData.email}
                rules={securityValidationRules.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              <SecureFormValidator 
                value={formData.phone}
                rules={securityValidationRules.phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter your company name"
                className={validationErrors.company ? 'border-red-500' : ''}
              />
              <SecureFormValidator 
                value={formData.company}
                rules={securityValidationRules.company}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan_program">Loan Program *</Label>
              <Select value={formData.loan_program} onValueChange={(value) => handleInputChange('loan_program', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sba-7a">SBA 7(a) Loan</SelectItem>
                  <SelectItem value="sba-504">SBA 504 Loan</SelectItem>
                  <SelectItem value="equipment-financing">Equipment Financing</SelectItem>
                  <SelectItem value="working-capital">Working Capital</SelectItem>
                  <SelectItem value="commercial-real-estate">Commercial Real Estate</SelectItem>
                  <SelectItem value="business-line-credit">Business Line of Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_amount">Loan Amount *</Label>
              <Select value={formData.loan_amount} onValueChange={(value) => handleInputChange('loan_amount', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50k">Under $50,000</SelectItem>
                  <SelectItem value="50k-250k">$50,000 - $250,000</SelectItem>
                  <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                  <SelectItem value="over-5m">Over $5,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe *</Label>
              <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="6-months-plus">6+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please provide any additional details about your financing needs..."
              className={`min-h-[100px] ${validationErrors.message ? 'border-red-500' : ''}`}
            />
            <SecureFormValidator 
              value={formData.message}
              rules={securityValidationRules.message}
            />
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This form uses enterprise-grade encryption to protect your information. All data is transmitted securely and stored with strict access controls.
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !user}
            size="lg"
          >
            {isSubmitting ? (
              <>Submitting Securely...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Secure Request
              </>
            )}
          </Button>

          {!user && (
            <Alert variant="destructive">
              <AlertDescription>
                Please log in to submit a consultation request.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};