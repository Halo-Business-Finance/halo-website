import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsultationPopupProps {
  trigger: React.ReactNode;
}

const ConsultationPopup = ({ trigger }: ConsultationPopupProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.loanProgram) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
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
      // Simple submission data for external processing
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        loan_program: formData.loanProgram,
        loan_amount: formData.loanAmount,
        timeframe: formData.timeframe,
        message: formData.message,
        submissionTime: new Date().toISOString(),
        origin: window.location.origin
      };

      // Here you would typically send to your external system
      // For now, we'll just show success
      console.log('Consultation request:', submissionData);
      
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
      
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
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

        <div>
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

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                "Schedule Consultation"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationPopup;