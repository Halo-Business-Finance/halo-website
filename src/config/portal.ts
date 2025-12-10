// Centralized configuration for the borrower portal
// Update this URL when moving from preview to production

export const BORROWER_PORTAL_URL = 'https://preview--hbf-application.lovable.app';

// Loan type slugs for consistent URL parameters
export const LOAN_TYPES = {
  SBA_7A: 'sba-7a',
  SBA_504: 'sba-504',
  SBA_EXPRESS: 'sba-express',
  CONVENTIONAL: 'conventional',
  EQUIPMENT: 'equipment',
  BRIDGE: 'bridge',
  WORKING_CAPITAL: 'working-capital',
  TERM_LOAN: 'term-loan',
  LINE_OF_CREDIT: 'line-of-credit',
  COMMERCIAL_REAL_ESTATE: 'commercial-real-estate',
  USDA: 'usda',
  CMBS: 'cmbs',
  CONSTRUCTION: 'construction',
  FACTORING: 'factoring',
  ASSET_BASED: 'asset-based',
  MULTIFAMILY: 'multifamily',
  PORTFOLIO: 'portfolio',
} as const;

export type LoanType = typeof LOAN_TYPES[keyof typeof LOAN_TYPES];

// Portal link options
interface PortalLinkOptions {
  loanType?: string;
  loanAmount?: string | number;
  includeUtm?: boolean;
  customParams?: Record<string, string>;
}

// Get current UTM parameters from the page URL
export const getCurrentUtmParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  // Also capture referrer as source if no UTM source
  if (!utmParams.utm_source && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      if (referrerUrl.hostname !== window.location.hostname) {
        utmParams.utm_source = referrerUrl.hostname;
      }
    } catch {
      // Invalid referrer URL, ignore
    }
  }
  
  // Add default source if none present
  if (!utmParams.utm_source) {
    utmParams.utm_source = 'website';
  }
  
  return utmParams;
};

// Helper to generate portal links with full context
export const getPortalApplyUrl = (options?: string | PortalLinkOptions): string => {
  const baseUrl = `${BORROWER_PORTAL_URL}/auth`;
  const params = new URLSearchParams();
  
  // Handle simple string (loan type only) for backward compatibility
  if (typeof options === 'string') {
    params.set('loan', options);
    // Always include UTM params and source tracking
    const utmParams = getCurrentUtmParams();
    Object.entries(utmParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    params.set('ref', 'hbf-website');
    return `${baseUrl}?${params.toString()}`;
  }
  
  // Handle full options object
  if (options?.loanType) {
    params.set('loan', options.loanType);
  }
  
  if (options?.loanAmount) {
    params.set('amount', String(options.loanAmount));
  }
  
  // Include UTM params by default (or if explicitly enabled)
  if (options?.includeUtm !== false) {
    const utmParams = getCurrentUtmParams();
    Object.entries(utmParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  // Add custom parameters
  if (options?.customParams) {
    Object.entries(options.customParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  // Always add referrer tracking
  params.set('ref', 'hbf-website');
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Pre-built URLs for common loan amounts (for calculator/quiz results)
export const getPortalUrlWithAmount = (loanType: string, amount: number): string => {
  return getPortalApplyUrl({
    loanType,
    loanAmount: amount,
    includeUtm: true,
  });
};

// For use in components that need to build URLs dynamically
export const buildPortalUrl = (
  loanType?: string,
  loanAmount?: number,
  additionalParams?: Record<string, string>
): string => {
  return getPortalApplyUrl({
    loanType,
    loanAmount,
    includeUtm: true,
    customParams: additionalParams,
  });
};
