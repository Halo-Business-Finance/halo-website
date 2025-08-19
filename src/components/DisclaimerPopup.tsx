import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DisclaimerPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem("halo-disclaimer-accepted");
    if (!hasSeenDisclaimer) {
      // Small delay to ensure page has loaded
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("halo-disclaimer-accepted", "true");
    setIsVisible(false);
    toast({
      title: "Privacy Policy Acknowledged",
      description: "You can review our full privacy policy at any time in the footer.",
    });
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium">Privacy Policy:</span>
              <span className="text-muted-foreground ml-1">
                Your privacy is important to us. We collect and use your information to process loan applications and connect you with qualified lenders. We implement industry-leading security measures to protect your data and comply with all applicable privacy regulations.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={handleAccept}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-xs px-3 py-1 h-7"
            >
              Accept
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPopup;