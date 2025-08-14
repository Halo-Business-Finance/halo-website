import { useEffect, ReactNode } from 'react';
import { secureLogger, replaceConsole } from '@/utils/secureLogger';
import { AutomatedSecurityResponse } from './AutomatedSecurityResponse';

interface ProductionSecurityProviderProps {
  children: ReactNode;
}

export const ProductionSecurityProvider = ({ children }: ProductionSecurityProviderProps) => {
  useEffect(() => {
    // Initialize production security measures
    const initializeProductionSecurity = () => {
      // Replace console methods in production
      if (import.meta.env.PROD) {
        replaceConsole();
        secureLogger.info('Production security initialized');
      }

      // Disable debugging in production
      if (import.meta.env.PROD) {
        // Disable common debugging tools
        Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
          value: undefined,
          writable: false,
          configurable: false
        });

        // Disable source map exposure
        if ('DevTools' in window) {
          (window as any).DevTools = undefined;
        }

        // Monitor for debugging attempts
        let devToolsOpen = false;
        const threshold = 160;

        const detectDevTools = () => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devToolsOpen) {
              devToolsOpen = true;
              secureLogger.securityEvent('devtools_detected', {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
              });
            }
          } else {
            devToolsOpen = false;
          }
        };

        // Check every 500ms
        const devToolsInterval = setInterval(detectDevTools, 500);

        return () => clearInterval(devToolsInterval);
      }
    };

    // Content Security Policy runtime enforcement
    const enforceCSP = () => {
      // Monitor for inline script violations
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name: string, value: string) {
            if (name.toLowerCase() === 'src' && !value.startsWith('https://')) {
              secureLogger.securityEvent('unsafe_script_blocked', {
                src: value,
                timestamp: new Date().toISOString()
              });
              throw new Error('Unsafe script source blocked by CSP enforcement');
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        
        return element;
      };
    };

    // Initialize security monitoring
    const initializeMonitoring = () => {
      // Monitor global error events
      const handleGlobalError = (event: ErrorEvent) => {
        secureLogger.error('Global error caught', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack?.substring(0, 500) // Limit stack trace length
        });
      };

      // Monitor unhandled promise rejections
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        secureLogger.error('Unhandled promise rejection', {
          reason: event.reason?.toString?.()?.substring(0, 500)
        });
      };

      window.addEventListener('error', handleGlobalError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleGlobalError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    };

    // Network request monitoring
    const monitorNetworkRequests = () => {
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const [url, options] = args;
        const startTime = performance.now();
        
        try {
          const response = await originalFetch.apply(this, args);
          const endTime = performance.now();
          
          // Log slow requests
          if (endTime - startTime > 5000) {
            secureLogger.performanceEvent('slow_request', endTime - startTime, {
              url: typeof url === 'string' ? url : url.toString(),
              method: options?.method || 'GET'
            });
          }
          
          // Log failed requests
          if (!response.ok) {
            secureLogger.warn('Request failed', {
              url: typeof url === 'string' ? url : url.toString(),
              status: response.status,
              statusText: response.statusText
            });
          }
          
          return response;
        } catch (error) {
          secureLogger.error('Request error', {
            url: typeof url === 'string' ? url : url.toString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          throw error;
        }
      };
    };

    const cleanup1 = initializeProductionSecurity();
    enforceCSP();
    const cleanup2 = initializeMonitoring();
    monitorNetworkRequests();

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  return (
    <>
      <AutomatedSecurityResponse />
      {children}
    </>
  );
};