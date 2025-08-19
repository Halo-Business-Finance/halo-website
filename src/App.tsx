import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { SecurityHeaders } from "@/components/security/SecurityHeaders";
import { SecurityMonitor } from "@/components/security/SecurityMonitor";
import { FormSecurityProvider } from "@/components/security/FormSecurityProvider";
import { SessionManager } from "@/components/security/SessionManager";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SecureAuthProvider } from "@/components/security/SecureAuthProvider";
import { ProductionSecurityProvider } from "@/components/security/ProductionSecurityProvider";
import { preloadCriticalResources, addResourceHints } from "@/utils/performance";
import { PerformanceMonitor } from "@/components/optimization/PerformanceMonitor";
import DisclaimerPopup from "@/components/DisclaimerPopup";

// Preload critical pages (above the fold)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for better performance
const AuthPage = lazy(() => import("./pages/AuthPage"));
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
const BusinessFinanceResourcesPage = lazy(() => import("./pages/BusinessFinanceResourcesPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const SecurityDashboardPage = lazy(() => import("./pages/SecurityDashboardPage"));
const SecuritySetupPage = lazy(() => import("./pages/SecuritySetupPage"));

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
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-foreground">Loading...</p>
      <div className="mt-2 text-sm text-muted-foreground">Optimizing content...</div>
    </div>
  </div>
);

// Optimize QueryClient for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize performance optimizations
  useEffect(() => {
    const initializePerformance = async () => {
      // Critical resource preloading
      preloadCriticalResources();
      addResourceHints();
      
      // Register service worker for caching
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
          console.error('SW registration failed:', error);
        }
      }
      
      // Inject critical CSS
      const criticalCSS = `
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `;
      const style = document.createElement('style');
      style.innerHTML = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };
    
    initializePerformance();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ProductionSecurityProvider>
      <FormSecurityProvider>
        <SessionManager>
          <AuthProvider>
            <SecureAuthProvider>
              <TooltipProvider>
            <Toaster />
            <Sonner />
            <SecurityHeaders />
            <SecurityMonitor />
          <PerformanceMonitor />
          <DisclaimerPopup />
      <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/brokers" element={<BrokersPage />} />
            <Route path="/lenders" element={<LendersPage />} />
            <Route path="/company-overview" element={<CompanyOverview />} />
            <Route path="/company-licenses" element={<CompanyLicensesPage />} />
            <Route path="/sba-loans" element={<SBALoansPage />} />
            <Route path="/commercial-loans" element={<CommercialLoansPage />} />
            <Route path="/equipment-financing" element={<EquipmentFinancingPage />} />
            <Route path="/business-capital" element={<BusinessCapitalPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/sba-7a-loans" element={<SBA7aLoansPage />} />
            <Route path="/sba-504-loans" element={<SBA504LoansPage />} />
            <Route path="/sba-express-loans" element={<SBAExpressLoansPage />} />
            <Route path="/usda-bi-loans" element={<USDABILoansPage />} />
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
            <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
            
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
            <Route path="/business-finance-resources" element={<BusinessFinanceResourcesPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/security-dashboard" element={<SecurityDashboardPage />} />
            <Route path="/security-setup" element={<SecuritySetupPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
              </TooltipProvider>
            </SecureAuthProvider>
          </AuthProvider>
        </SessionManager>
      </FormSecurityProvider>
    </ProductionSecurityProvider>
  </QueryClientProvider>
  );
};

export default App;
