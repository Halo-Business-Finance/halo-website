import React, { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    analytics: any;
  }
}

interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class AnalyticsManager {
  private isInitialized = false;
  private events: AnalyticsEvent[] = [];

  // Initialize analytics services
  initialize() {
    if (this.isInitialized) return;

    // Google Analytics 4
    this.initializeGA4();
    
    // Facebook Pixel
    this.initializeFacebookPixel();
    
    // Custom analytics
    this.initializeCustomAnalytics();

    this.isInitialized = true;
    this.flushEvents();
  }

  private initializeGA4() {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      send_page_view: true,
      anonymize_ip: true
    });
  }

  private initializeFacebookPixel() {
    // Facebook Pixel implementation
    (window as any).fbq = (window as any).fbq || function() {
      ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
    };
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    (window as any).fbq('init', 'FACEBOOK_PIXEL_ID');
    (window as any).fbq('track', 'PageView');
  }

  private initializeCustomAnalytics() {
    // Custom analytics initialization
    window.analytics = {
      track: this.track.bind(this),
      page: this.trackPageView.bind(this),
      identify: this.identify.bind(this)
    };
  }

  // Track custom events
  track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_name: eventName,
      custom_parameters: {
        ...properties,
        timestamp: Date.now(),
        page_url: window.location.href,
        page_title: document.title
      }
    };

    if (!this.isInitialized) {
      this.events.push(event);
      return;
    }

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    // Send to Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, properties);
    }

    // Store in local analytics
    this.storeLocalEvent(event);
  }

  // Track page views
  trackPageView(path?: string) {
    const page = path || window.location.pathname;
    
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: page
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    this.track('page_view', { page_path: page });
  }

  // Track form submissions
  trackFormSubmission(formName: string, formData: Record<string, any> = {}) {
    this.track('form_submission', {
      form_name: formName,
      ...formData
    });
  }

  // Track loan applications
  trackLoanApplication(loanType: string, amount: number, step: string) {
    this.track('loan_application', {
      loan_type: loanType,
      loan_amount: amount,
      application_step: step,
      value: amount
    });
  }

  // Track calculator usage
  trackCalculatorUsage(calculatorType: string, inputs: Record<string, any>) {
    this.track('calculator_usage', {
      calculator_type: calculatorType,
      ...inputs
    });
  }

  // Track user engagement
  trackEngagement(action: string, element: string, value?: number) {
    this.track('engagement', {
      engagement_action: action,
      element_name: element,
      value: value
    });
  }

  // Track conversions
  trackConversion(conversionType: string, value: number, currency: string = 'USD') {
    this.track('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency
    });

    // Enhanced ecommerce for GA4
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: Date.now().toString(),
        value: value,
        currency: currency,
        items: [{
          item_id: conversionType,
          item_name: conversionType,
          category: 'Financial Service',
          price: value,
          quantity: 1
        }]
      });
    }
  }

  // Identify users
  identify(userId: string, traits: Record<string, any> = {}) {
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        custom_map: traits
      });
    }

    this.track('identify', { user_id: userId, ...traits });
  }

  // A/B testing
  trackExperiment(experimentName: string, variant: string) {
    this.track('experiment_view', {
      experiment_name: experimentName,
      variant_name: variant
    });

    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: {
          experiment: experimentName,
          variant: variant
        }
      });
    }
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string, errorStack?: string) {
    this.track('error', {
      error_type: errorType,
      error_message: errorMessage,
      error_stack: errorStack,
      page_url: window.location.href
    });
  }

  // Heat mapping integration
  initializeHeatMapping() {
    // Hotjar integration
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: 'HOTJAR_ID', hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  // User session tracking
  trackSession() {
    const sessionId = this.getOrCreateSessionId();
    const sessionData = {
      session_id: sessionId,
      session_start: Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };

    this.track('session_start', sessionData);
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString() + Math.random().toString(36).substring(2);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private storeLocalEvent(event: AnalyticsEvent) {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  private flushEvents() {
    this.events.forEach(event => {
      this.track(event.event_name, event.custom_parameters);
    });
    this.events = [];
  }

  // Get analytics data for dashboard
  getAnalyticsData() {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }
}

const analytics = new AnalyticsManager();

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize analytics
    analytics.initialize();
    analytics.initializeHeatMapping();
    analytics.trackSession();

    // Track page view
    analytics.trackPageView();

    // Set up automatic scroll depth tracking
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScroll && scrollDepth % 25 === 0) {
        maxScroll = scrollDepth;
        analytics.trackEngagement('scroll', 'page', scrollDepth);
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      analytics.trackEngagement('time_on_page', 'page', timeOnPage);
    };

    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth);
    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track click events
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        analytics.trackEngagement('click', target.textContent || target.className);
      }
    };

    document.addEventListener('click', trackClicks);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', trackClicks);
    };
  }, []);

  return <>{children}</>;
};

export { analytics };
