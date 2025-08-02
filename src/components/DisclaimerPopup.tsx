import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DisclaimerPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem("halo-disclaimer-accepted");
    if (!hasSeenDisclaimer) {
      // Small delay to ensure page has loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("halo-disclaimer-accepted", "true");
    setIsOpen(false);
    toast({
      title: "Terms Accepted",
      description: "You can review our terms and privacy policy at any time in the footer.",
    });
  };

  const handleDecline = () => {
    // Redirect to external site or show message
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              Important Legal Disclaimer
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Please read and accept the following terms before using our website
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Main Disclaimer */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Commercial Loan Marketplace</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Halo Business Finance operates as a commercial loan marketplace and direct lender. 
                      We connect businesses with multiple lending partners to provide financing options. 
                      Not all applicants will qualify for financing, and loan terms may vary by lender and creditworthiness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Notice */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Regulatory Information</h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        <strong>California:</strong> Licensed by the Department of Financial Protection and Innovation under the California Commercial Financing Law. License No. 60DBO-178064.
                      </p>
                      <p>
                        <strong>NMLS ID:</strong> 2272778. We are required to comply with all applicable federal and state regulations.
                      </p>
                      <p>
                        California Commercial Financing Law disclosures are available upon request.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Terms */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">By using this website, you acknowledge that:</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Loan approval is subject to credit approval and underwriting guidelines</li>
                  <li>Interest rates and terms may vary based on creditworthiness and loan program</li>
                  <li>We may share your information with our lending partners to provide quotes</li>
                  <li>All loan programs are subject to availability and lending partner approval</li>
                  <li>This website may use cookies to enhance your browsing experience</li>
                  <li>You have read and agree to our Privacy Policy and Terms of Service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Privacy & Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We take your privacy seriously. Your personal and business information is protected 
                  according to our Privacy Policy and the California Financial Information Privacy Act (CFIPA). 
                  You have the right to control how your information is shared with third parties.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
            <Button 
              onClick={handleDecline} 
              variant="outline" 
              className="flex-1"
            >
              Decline & Exit
            </Button>
            <Button 
              onClick={handleAccept} 
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              I Accept These Terms
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By clicking "I Accept These Terms", you agree to our 
            <span className="text-primary"> Terms of Service</span>, 
            <span className="text-primary"> Privacy Policy</span>, and 
            <span className="text-primary"> CFIPA Notice</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerPopup;