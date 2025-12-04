import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px and not dismissed
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Ready to get funded?</p>
            <p className="text-xs text-primary-foreground/80 truncate">Pre-approval in 24 hours</p>
          </div>
          
          <Button 
            size="sm"
            variant="secondary"
            className="flex-shrink-0 bg-white text-primary hover:bg-white/90 font-semibold"
            asChild
          >
            <a href="https://app.halolending.com" className="flex items-center gap-1">
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>

          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
