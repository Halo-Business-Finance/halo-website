import { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 400px
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Keep dismissed for this session
    sessionStorage.setItem('floatingCtaDismissed', 'true');
  };

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('floatingCtaDismissed');
    if (wasDismissed) {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 ${
        isVisible ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom'
      }`}
    >
      <div className="relative glass-card rounded-2xl p-4 md:p-5 max-w-md mx-auto md:mx-0 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">
              Ready to get funded?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get pre-approved in 24 hours
            </p>
          </div>
          
          <Button
            asChild
            className="glass-button text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 animate-glow-pulse whitespace-nowrap"
          >
            <a href="https://app.halolending.com" className="flex items-center gap-2">
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 pt-3 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            No credit impact
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Bank-level security
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
