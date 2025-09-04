import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { OptimizedSecurityProvider } from "@/components/security/OptimizedSecurityProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { preloadCriticalResources, addResourceHints } from "@/utils/performance";
import { PerformanceMonitor } from "@/components/optimization/PerformanceMonitor";
import DisclaimerPopup from "@/components/DisclaimerPopup";

// Preload critical pages (above the fold)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for better performance
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminInitializerPage = lazy(() => import("./pages/AdminInitializerPage"));
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
const SOCCompliancePage = lazy(() => import("./pages/SOCCompliancePage"));
const SecurityDashboardPage = lazy(() => import("./pages/SecurityDashboardPage"));
const AdminSignupPage = lazy(() => import("./pages/AdminSignupPage"));
const AdminSetupPage = lazy(() => import("./pages/AdminSetupPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminConsultations = lazy(() => import("./pages/admin/AdminConsultations"));

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
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };
    
    initializePerformance();
  }, []);

  return (
    <div style={{padding: '20px', backgroundColor: 'white', color: 'black'}}>
      <h1>TEST - App is loading!</h1>
      <p>If you can see this, React is working.</p>
    </div>
  );
};

export default App;
