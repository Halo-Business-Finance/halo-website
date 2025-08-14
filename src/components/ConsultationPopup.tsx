import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, Building2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConsultationPopupProps {
  trigger: React.ReactNode;
}

const ConsultationPopup = ({ trigger }: ConsultationPopupProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    loanProgram: "",
    loanAmount: "",
    timeframe: "",
    message: ""
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loanPrograms = [
    { value: "sba-7a", label: "SBA 7(a) Loans" },
    { value: "sba-504", label: "SBA 504 Loans" },
    { value: "sba-express", label: "SBA Express Loans" },
    { value: "usda-bi", label: "USDA B&I Loans" },
    { value: "conventional", label: "Conventional Loans" },
    { value: "cmbs", label: "CMBS Loans" },
    { value: "portfolio", label: "Portfolio Loans" },
    { value: "construction", label: "Construction Loans" },
    { value: "bridge", label: "Bridge Financing" },
    { value: "multifamily", label: "Multifamily Loans" },
    { value: "asset-based", label: "Asset-Based Loans" },
    { value: "equipment", label: "Equipment Financing" },
    { value: "working-capital", label: "Working Capital" },
    { value: "line-of-credit", label: "Business Line of Credit" },
    { value: "term-loans", label: "Term Loans" },
    { value: "factoring", label: "Factoring-Based Financing" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security check: Ensure user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a consultation request.",
        variant: "destructive"
      });
      return;
    }
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.loanProgram) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Additional security validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add client-side security metadata
      const submissionData = {
        ...formData,
        clientFingerprint: navigator.userAgent.substring(0, 100), // Limit length for security
        submissionTime: new Date().toISOString(),
        origin: window.location.origin,
        formVersion: "1.2" // Updated for enhanced security
      };

      // Log security event for monitoring (don't fail submission if this fails)
      try {
        await supabase.functions.invoke('log-security-event', {
          body: {
            event_type: 'consultation_form_submitted',
            severity: 'info',
            event_data: {
              loan_program: formData.loanProgram,
              loan_amount: formData.loanAmount,
              has_company: !!formData.company,
              form_completion_time: Date.now(),
              origin: window.location.origin,
              authenticated: true
            }
          }
        });
      } catch (logError) {
        console.warn('Security logging failed:', logError);
      }

      const { data, error } = await supabase.functions.invoke('send-consultation-email', {
        body: submissionData
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit consultation');
      }
      
      toast({
        title: "Consultation Requested",
        description: "Thank you! Our team will contact you within 24 hours to schedule your consultation.",
      });
      
      setOpen(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        loanProgram: "",
        loanAmount: "",
        timeframe: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Consultation submission error:', error);
      
      // Enhanced error handling with security considerations
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message && !error.message.includes('database') && !error.message.includes('internal')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6 text-primary" />
            Schedule Your Consultation
          </DialogTitle>
        </DialogHeader>

        {isCheckingAuth ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-4 py-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">
                To protect your sensitive financial information, please sign in before submitting a consultation request.
              </p>
              <Button 
                onClick={() => {
                  setOpen(false);
                  // Redirect to auth page or trigger auth modal
                  window.location.href = '/auth';
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Sign In to Continue
              </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <p>Your data is encrypted and protected by enterprise-grade security.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Shield className="h-4 w-4" />
                <span>Secure Form - Your information is encrypted and protected</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanProgram" className="text-sm font-medium">
                  Loan Program Interest <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.loanProgram} onValueChange={(value) => handleInputChange("loanProgram", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a loan program" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">SBA & Government Programs</div>
                      {loanPrograms.slice(0, 4).map((program) => (
                        <SelectItem key={program.value} value={program.value}>
                          {program.label}
                        </SelectItem>
                      ))}
                    </div>
                    <div className="p-2 border-t">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Commercial Loans</div>
                      {loanPrograms.slice(4, 11).map((program) => (
                        <SelectItem key={program.value} value={program.value}>
                          {program.label}
                        </SelectItem>
                      ))}
                    </div>
                    <div className="p-2 border-t">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">Business Capital</div>
                      {loanPrograms.slice(11).map((program) => (
                        <SelectItem key={program.value} value={program.value}>
                          {program.label}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-sm font-medium">
                    Loan Amount Needed
                  </Label>
                  <Select value={formData.loanAmount} onValueChange={(value) => handleInputChange("loanAmount", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan amount" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="under-100k">Under $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m-2m">$1,000,000 - $2,000,000</SelectItem>
                      <SelectItem value="2m-5m">$2,000,000 - $5,000,000</SelectItem>
                      <SelectItem value="over-5m">Over $5,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeframe" className="text-sm font-medium">
                    Timeframe Needed
                  </Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="asap">ASAP (Within 30 days)</SelectItem>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6-12-months">6-12 months</SelectItem>
                      <SelectItem value="planning">Planning/Research phase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Additional Information
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your financing needs, business goals, or any specific questions you have..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">What to Expect</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Expert consultation within 24 hours</li>
                      <li>• Personalized loan program recommendations</li>
                      <li>• Pre-qualification assessment</li>
                      <li>• No obligation or upfront fees</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Schedule Consultation"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>

            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(800) 730-8461</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@halobusinessfinance.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationPopup;