import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { SimpleErrorBoundary } from "@/components/SimpleErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import LiveEditOverlay from "@/components/admin/LiveEditOverlay";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { OrganizationSchema } from "@/components/OrganizationSchema";

// Preload critical pages (above the fold)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for better performance
const ReferralPartnersPage = lazy(() => import("./pages/ReferralPartnersPage"));
const BrokersPage = lazy(() => import("./pages/BrokersPage"));
const LendersPage = lazy(() => import("./pages/LendersPage"));
const CompanyOverview = lazy(() => import("./pages/CompanyOverview"));
const CompanyLicensesPage = lazy(() => import("./pages/CompanyLicensesPage"));
const SBALoansPage = lazy(() => import("./pages/SBALoansPage"));
const CommercialLoansPage = lazy(() => import("./pages/CommercialLoansPage"));
const EquipmentFinancingPage = lazy(() => import("./pages/EquipmentFinancingPage"));
const BusinessCapitalPage = lazy(() => import("./pages/BusinessCapitalPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const SBA7aLoansPage = lazy(() => import("./pages/SBA7aLoansPage"));
const SBA504LoansPage = lazy(() => import("./pages/SBA504LoansPage"));
const SBAExpressLoansPage = lazy(() => import("./pages/SBAExpressLoansPage"));
const USDABILoansPage = lazy(() => import("./pages/USDABILoansPage"));
const USDARunalDevelopmentPage = lazy(() => import("./pages/USDARunalDevelopmentPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const ConventionalLoansPage = lazy(() => import("./pages/ConventionalLoansPage"));
const CMBSLoansPage = lazy(() => import("./pages/CMBSLoansPage"));
const PortfolioLoansPage = lazy(() => import("./pages/PortfolioLoansPage"));
const ConstructionLoansPage = lazy(() => import("./pages/ConstructionLoansPage"));
const BridgeFinancingPage = lazy(() => import("./pages/BridgeFinancingPage"));
const EquipmentLoansPage = lazy(() => import("./pages/EquipmentLoansPage"));
const EquipmentLeasingPage = lazy(() => import("./pages/EquipmentLeasingPage"));
const HeavyEquipmentPage = lazy(() => import("./pages/HeavyEquipmentPage"));
const MedicalEquipmentPage = lazy(() => import("./pages/MedicalEquipmentPage"));
const TermLoansPage = lazy(() => import("./pages/TermLoansPage"));
const FactoringBasedFinancingPage = lazy(() => import("./pages/FactoringBasedFinancingPage"));
const LoanCalculatorPage = lazy(() => import("./pages/LoanCalculatorPage"));
const LoanCalculatorPageTest = lazy(() => import("./pages/LoanCalculatorPageTest"));

const IndustrySolutionsPage = lazy(() => import("./pages/IndustrySolutionsPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const MarketplaceBenefitsPage = lazy(() => import("./pages/MarketplaceBenefitsPage"));
const NMLSCompliancePage = lazy(() => import("./pages/NMLSCompliancePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const CFIPAPage = lazy(() => import("./pages/CFIPAPage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));
const SiteMapPage = lazy(() => import("./pages/SiteMapPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));

const WorkingCapitalPage = lazy(() => import("./pages/WorkingCapitalPage"));
const BusinessLineOfCreditPage = lazy(() => import("./pages/BusinessLineOfCreditPage"));
const CustomerServicePage = lazy(() => import("./pages/CustomerServicePage"));
const TechnicalSupportPage = lazy(() => import("./pages/TechnicalSupportPage"));
const MultifamilyLoansPage = lazy(() => import("./pages/MultifamilyLoansPage"));
const AssetBasedLoansPage = lazy(() => import("./pages/AssetBasedLoansPage"));

const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

// Lazy load application forms
const SBALoanApplication = lazy(() => import("./pages/SBALoanApplication"));
const SBA504LoanApplication = lazy(() => import("./pages/SBA504LoanApplication"));
const BridgeLoanApplication = lazy(() => import("./pages/BridgeLoanApplication"));
const ConventionalLoanApplication = lazy(() => import("./pages/ConventionalLoanApplication"));
const BusinessLineOfCreditApplication = lazy(() => import("./pages/BusinessLineOfCreditApplication"));
const TermLoanApplication = lazy(() => import("./pages/TermLoanApplication"));
const EquipmentLoanApplication = lazy(() => import("./pages/EquipmentLoanApplication"));
const WorkingCapitalApplication = lazy(() => import("./pages/WorkingCapitalApplication"));
const CommercialRealEstateApplication = lazy(() => import("./pages/CommercialRealEstateApplication"));

// Enhanced loading component for better UX
const LoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <SimpleErrorBoundary>
      <CookieConsent />
      <OrganizationSchema />
      <BrowserRouter>
        <GoogleAnalytics />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/referral-partners" element={<ReferralPartnersPage />} />
            <Route path="/brokers" element={<BrokersPage />} />
            <Route path="/lenders" element={<LendersPage />} />
            <Route path="/company-overview" element={<CompanyOverview />} />
            <Route path="/company-licenses" element={<CompanyLicensesPage />} />
            <Route path="/sba-loans" element={<SBALoansPage />} />
            <Route path="/commercial-loans" element={<CommercialLoansPage />} />
            <Route path="/equipment-financing" element={<EquipmentFinancingPage />} />
            <Route path="/capital-markets" element={<BusinessCapitalPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/sba-7a-loans" element={<SBA7aLoansPage />} />
            <Route path="/sba-504-loans" element={<SBA504LoansPage />} />
            <Route path="/sba-express-loans" element={<SBAExpressLoansPage />} />
            <Route path="/usda-bi-loans" element={<USDABILoansPage />} />
            <Route path="/usda-rural-development" element={<USDARunalDevelopmentPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            
            <Route path="/working-capital" element={<WorkingCapitalPage />} />
            <Route path="/business-line-of-credit" element={<BusinessLineOfCreditPage />} />
            <Route path="/sba-loan-application" element={<SBALoanApplication />} />
            <Route path="/sba-504-application" element={<SBA504LoanApplication />} />
            <Route path="/bridge-loan-application" element={<BridgeLoanApplication />} />
            <Route path="/conventional-loan-application" element={<ConventionalLoanApplication />} />
            <Route path="/business-line-of-credit-application" element={<BusinessLineOfCreditApplication />} />
            <Route path="/term-loan-application" element={<TermLoanApplication />} />
            <Route path="/equipment-loan-application" element={<EquipmentLoanApplication />} />
            <Route path="/working-capital-application" element={<WorkingCapitalApplication />} />
            <Route path="/commercial-real-estate-application" element={<CommercialRealEstateApplication />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/conventional-loans" element={<ConventionalLoansPage />} />
            <Route path="/cmbs-loans" element={<CMBSLoansPage />} />
            <Route path="/portfolio-loans" element={<PortfolioLoansPage />} />
            <Route path="/construction-loans" element={<ConstructionLoansPage />} />
            <Route path="/bridge-financing" element={<BridgeFinancingPage />} />
            <Route path="/equipment-loans" element={<EquipmentLoansPage />} />
            <Route path="/equipment-leasing" element={<EquipmentLeasingPage />} />
            <Route path="/heavy-equipment" element={<HeavyEquipmentPage />} />
            <Route path="/medical-equipment" element={<MedicalEquipmentPage />} />
            <Route path="/term-loans" element={<TermLoansPage />} />
            <Route path="/factoring-based-financing" element={<FactoringBasedFinancingPage />} />
            <Route path="/loan-calculator" element={<LoanCalculatorPageTest />} />
            <Route path="/loan-calculator-full" element={<LoanCalculatorPage />} />
            
            <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/marketplace-benefits" element={<MarketplaceBenefitsPage />} />
            <Route path="/nmls-compliance" element={<NMLSCompliancePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cfipa" element={<CFIPAPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/sitemap" element={<SiteMapPage />} />
            <Route path="/customer-service" element={<CustomerServicePage />} />
            <Route path="/technical-support" element={<TechnicalSupportPage />} />
            <Route path="/multifamily-loans" element={<MultifamilyLoansPage />} />
            <Route path="/asset-based-loans" element={<AssetBasedLoansPage />} />
            
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/security" element={<SecurityPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <LiveEditOverlay />
        <Toaster />
      </BrowserRouter>
    </SimpleErrorBoundary>
  );
};

export default App;