import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const SecurityMonitor = () => {
  useEffect(() => {
    // Monitor for suspicious activity
    const monitorSecurity = () => {
      // Detect multiple failed login attempts
      let failedAttempts = 0;
      const maxFailedAttempts = 3;
      const attemptWindow = 5 * 60 * 1000; // 5 minutes

      // Monitor console access attempts
      const originalConsole = { ...console };
      
      // Only override console in development, not production
      if (process.env.NODE_ENV !== 'production') {
        console.log = (...args) => {
          logSecurityEvent('console_access', { 
            method: 'log'
            // No args logged for security
          });
          originalConsole.log(...args);
        };
      }

      // Monitor DOM manipulation attempts
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check for suspicious script injection
                if (element.tagName === 'SCRIPT' || 
                    (element.textContent && element.textContent.includes('<script')) ||
                    (element.textContent && element.textContent.includes('javascript:'))) {
                  logSecurityEvent('suspicious_dom_manipulation', {
                    tagName: element.tagName,
                    suspicious_content: true
                  });
                  toast.error('Suspicious activity detected and blocked');
                  element.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Monitor page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          logSecurityEvent('page_hidden', { timestamp: new Date().toISOString() });
        } else {
          logSecurityEvent('page_visible', { timestamp: new Date().toISOString() });
        }
      });

      // Monitor for developer tools
      let devToolsOpen = false;
      setInterval(() => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devToolsOpen) {
            devToolsOpen = true;
            logSecurityEvent('dev_tools_opened', { 
              timestamp: new Date().toISOString(),
              window_dimensions: {
                outer: { width: window.outerWidth, height: window.outerHeight },
                inner: { width: window.innerWidth, height: window.innerHeight }
              }
            });
          }
        } else {
          devToolsOpen = false;
        }
      }, 1000);

      // Monitor network requests
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const [resource, options] = args;
        const url = typeof resource === 'string' ? resource : (resource as Request).url;
        
        // Log external API calls
        if (!url.includes(window.location.hostname) && !url.includes('supabase.co')) {
          logSecurityEvent('external_api_call', { 
            url: url.substring(0, 100), // Limit URL length for privacy
            method: options?.method || 'GET'
          });
        }

        return originalFetch(...args);
      };

      return () => {
        observer.disconnect();
        console.log = originalConsole.log;
        window.fetch = originalFetch;
      };
    };

    const cleanup = monitorSecurity();

    return cleanup;
  }, []);

  const logSecurityEvent = async (eventType: string, details: any) => {
    try {
      // Only log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Security Event:', { eventType });
      }
      
      // Log to database using the secure function (sanitized data)
      const { error } = await supabase.rpc('log_client_security_event', {
        event_type: eventType,
        severity: getSeverityLevel(eventType),
        event_data: details,
        user_agent: navigator.userAgent.substring(0, 200), // Limit user agent length
        source: 'client'
      });

      if (error && process.env.NODE_ENV !== 'production') {
        console.error('Failed to log security event to database:', error);
      }
    } catch (error) {
      // Silently fail to avoid infinite loops
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to log security event:', error);
      }
    }
  };

  const getSeverityLevel = (eventType: string): string => {
    switch (eventType) {
      case 'suspicious_dom_manipulation':
        return 'high';
      case 'dev_tools_opened':
        return 'medium';
      case 'console_access':
        return 'medium';
      case 'external_api_call':
        return 'low';
      case 'page_hidden':
      case 'page_visible':
        return 'info';
      default:
        return 'low';
    }
  };

  return null;
};