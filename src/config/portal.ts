// Centralized configuration for the borrower portal
// Update this URL when moving from preview to production

export const BORROWER_PORTAL_URL = 'https://preview--hbf-application.lovable.app';

// Helper to generate portal links with loan type parameters
export const getPortalApplyUrl = (loanType?: string) => {
  const baseUrl = `${BORROWER_PORTAL_URL}/auth`;
  if (loanType) {
    return `${baseUrl}?loan=${encodeURIComponent(loanType)}`;
  }
  return baseUrl;
};

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
} as const;
