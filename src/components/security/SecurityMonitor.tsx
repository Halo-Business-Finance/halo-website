import React, { useEffect } from 'react';
import { securityLogger } from './RateLimitedSecurityLogger';
import { toast } from 'sonner';

export const SecurityMonitor: React.FC = () => {
  useEffect(() => {
    let originalConsoleLog: typeof console.log;
    let originalFetch: typeof window.fetch;
    let mutationObserver: MutationObserver;
    
    const setupSecurityMonitoring = () => {
      // Reduced console monitoring to prevent log flooding
      originalConsoleLog = console.log;
      let consoleAccessCount = 0;
      console.log = (...args: any[]) => {
        consoleAccessCount++;
        // Only log every 10th console access to prevent spam
        if (consoleAccessCount % 10 === 0) {
          securityLogger.logSecurityEvent({
            event_type: 'console_access_pattern',
            severity: 'low',
            event_data: {
              access_count: consoleAccessCount,
              timestamp: Date.now()
            },
            source: 'client_monitor'
          });
        }
        return originalConsoleLog.apply(console, args);
      };

      // Critical security monitoring only
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'SCRIPT' || 
                    (element.textContent && element.textContent.includes('<script')) ||
                    (element.textContent && element.textContent.includes('javascript:'))) {
                  securityLogger.logSecurityEvent({
                    event_type: 'script_injection_attempt',
                    severity: 'critical',
                    event_data: {
                      src: (element as HTMLScriptElement).src,
                      content: (element as HTMLScriptElement).textContent?.substring(0, 100)
                    },
                    source: 'client_monitor'
                  });
                  toast.error('Suspicious activity detected and blocked');
                  element.remove();
                }
              }
            });
          }
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Monitor for developer tools (reduced frequency)
      let devtools = { open: false, lastCheck: 0 };
      const threshold = 160;
      const checkInterval = 5000; // Check every 5 seconds

      setInterval(() => {
        const now = Date.now();
        if (now - devtools.lastCheck < checkInterval) return;
        devtools.lastCheck = now;

        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            securityLogger.logSecurityEvent({
              event_type: 'developer_tools_opened',
              severity: 'medium',
              event_data: { 
                timestamp: Date.now(),
                viewport: {
                  outerWidth: window.outerWidth,
                  innerWidth: window.innerWidth,
                  outerHeight: window.outerHeight,
                  innerHeight: window.innerHeight
                }
              },
              source: 'client_monitor'
            });
          }
        } else {
          devtools.open = false;
        }
      }, checkInterval);

      // Monitor external API calls only
      originalFetch = window.fetch;
      window.fetch = async (...args: Parameters<typeof fetch>) => {
        const url = args[0];
        if (typeof url === 'string' && 
            !url.includes('supabase') && 
            !url.includes('localhost') &&
            !url.includes('lovable.dev')) {
          securityLogger.logSecurityEvent({
            event_type: 'external_api_call',
            severity: 'medium',
            event_data: {
              url: url.substring(0, 100),
              method: args[1]?.method || 'GET'
            },
            source: 'client_monitor'
          });
        }
        return originalFetch.apply(window, args);
      };
    };

    setupSecurityMonitoring();

    // Cleanup function
    return () => {
      if (originalConsoleLog) {
        console.log = originalConsoleLog;
      }
      if (originalFetch) {
        window.fetch = originalFetch;
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, []);

  return null; // This is a monitoring service component
};