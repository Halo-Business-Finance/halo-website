import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after a short delay for better UX
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
    // Initialize analytics here
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom">
      <Card className="max-w-4xl mx-auto p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-border shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">We Value Your Privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept", you consent to our use of cookies. Read our{' '}
              <a href="/privacy-policy" className="underline hover:text-primary transition-colors">
                Privacy Policy
              </a>{' '}
              to learn more.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={declineCookies}
              className="flex-1 md:flex-none"
            >
              Decline
            </Button>
            <Button 
              onClick={acceptCookies}
              className="flex-1 md:flex-none"
            >
              Accept All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
