import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { secureLogger } from '../utils/secureLogger';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isProduction = import.meta.env.PROD;
  
  track(event: AnalyticsEvent) {
    if (!this.isProduction) {
      secureLogger.debug('Analytics Event:', event);
      return;
    }
    
    // Track page views and user interactions
    secureLogger.performanceEvent(event.name, 1, event.properties);
    
    // You can integrate with actual analytics services here
    // Example: Google Analytics, Mixpanel, etc.
  }
  
  pageView(path: string) {
    this.track({
      name: 'page_view',
      properties: {
        path,
        timestamp: Date.now(),
        user_agent: navigator.userAgent
      }
    });
  }
  
  userAction(action: string, details?: Record<string, any>) {
    this.track({
      name: 'user_action',
      properties: {
        action,
        ...details,
        timestamp: Date.now()
      }
    });
  }
}

export const analytics = new AnalyticsService();

export const useAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    analytics.pageView(location.pathname);
  }, [location.pathname]);
  
  return analytics;
};

export const useTrackUserAction = () => {
  return (action: string, details?: Record<string, any>) => {
    analytics.userAction(action, details);
  };
};