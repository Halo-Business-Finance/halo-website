import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
// App entry point
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages for better performance
const SBALoansPage = lazy(() => import("./pages/SBALoansPage"));
const SBA7aLoansPage = lazy(() => import("./pages/SBA7aLoansPage"));
const SBA504LoansPage = lazy(() => import("./pages/SBA504LoansPage"));
const SBAExpressLoansPage = lazy(() => import("./pages/SBAExpressLoansPage"));
const USDABILoansPage = lazy(() => import("./pages/USDABILoansPage"));
const USDARunalDevelopmentPage = lazy(() => import("./pages/USDARunalDevelopmentPage"));
const CommercialLoansPage = lazy(() => import("./pages/CommercialLoansPage"));
const ConventionalLoansPage = lazy(() => import("./pages/ConventionalLoansPage"));
const CMBSLoansPage = lazy(() => import("./pages/CMBSLoansPage"));
const PortfolioLoansPage = lazy(() => import("./pages/PortfolioLoansPage"));
const ConstructionLoansPage = lazy(() => import("./pages/ConstructionLoansPage"));
const BridgeFinancingPage = lazy(() => import("./pages/BridgeFinancingPage"));
const MultifamilyLoansPage = lazy(() => import("./pages/MultifamilyLoansPage"));
const AssetBasedLoansPage = lazy(() => import("./pages/AssetBasedLoansPage"));
const EquipmentFinancingPage = lazy(() => import("./pages/EquipmentFinancingPage"));
const EquipmentLoansPage = lazy(() => import("./pages/EquipmentLoansPage"));
const EquipmentLeasingPage = lazy(() => import("./pages/EquipmentLeasingPage"));
const HeavyEquipmentPage = lazy(() => import("./pages/HeavyEquipmentPage"));
const MedicalEquipmentPage = lazy(() => import("./pages/MedicalEquipmentPage"));
const WorkingCapitalPage = lazy(() => import("./pages/WorkingCapitalPage"));
const BusinessLineOfCreditPage = lazy(() => import("./pages/BusinessLineOfCreditPage"));
const TermLoansPage = lazy(() => import("./pages/TermLoansPage"));
const FactoringBasedFinancingPage = lazy(() => import("./pages/FactoringBasedFinancingPage"));
const BusinessCapitalPage = lazy(() => import("./pages/BusinessCapitalPage"));
const CompanyOverview = lazy(() => import("./pages/CompanyOverview"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const MarketplaceBenefitsPage = lazy(() => import("./pages/MarketplaceBenefitsPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const LoanCalculatorPage = lazy(() => import("./pages/LoanCalculatorPage"));
const IndustrySolutionsPage = lazy(() => import("./pages/IndustrySolutionsPage"));
const BrokersPage = lazy(() => import("./pages/BrokersPage"));
const LendersPage = lazy(() => import("./pages/LendersPage"));
const ReferralPartnersPage = lazy(() => import("./pages/ReferralPartnersPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const CustomerServicePage = lazy(() => import("./pages/CustomerServicePage"));
const TechnicalSupportPage = lazy(() => import("./pages/TechnicalSupportPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));
const NMLSCompliancePage = lazy(() => import("./pages/NMLSCompliancePage"));
const CFIPAPage = lazy(() => import("./pages/CFIPAPage"));
const CompanyLicensesPage = lazy(() => import("./pages/CompanyLicensesPage"));
const SiteMapPage = lazy(() => import("./pages/SiteMapPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));

// Application pages
const SBALoanApplication = lazy(() => import("./pages/SBALoanApplication"));
const SBA504LoanApplication = lazy(() => import("./pages/SBA504LoanApplication"));
const ConventionalLoanApplication = lazy(() => import("./pages/ConventionalLoanApplication"));
const BridgeLoanApplication = lazy(() => import("./pages/BridgeLoanApplication"));
const CommercialRealEstateApplication = lazy(() => import("./pages/CommercialRealEstateApplication"));
const EquipmentLoanApplication = lazy(() => import("./pages/EquipmentLoanApplication"));
const WorkingCapitalApplication = lazy(() => import("./pages/WorkingCapitalApplication"));
const BusinessLineOfCreditApplication = lazy(() => import("./pages/BusinessLineOfCreditApplication"));
const TermLoanApplication = lazy(() => import("./pages/TermLoanApplication"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* SBA Loans */}
          <Route path="/sba-loans" element={<SBALoansPage />} />
          <Route path="/sba-7a-loans" element={<SBA7aLoansPage />} />
          <Route path="/sba-504-loans" element={<SBA504LoansPage />} />
          <Route path="/sba-express-loans" element={<SBAExpressLoansPage />} />
          
          {/* USDA Loans */}
          <Route path="/usda-bi-loans" element={<USDABILoansPage />} />
          <Route path="/usda-rural-development" element={<USDARunalDevelopmentPage />} />
          
          {/* Commercial Loans */}
          <Route path="/commercial-loans" element={<CommercialLoansPage />} />
          <Route path="/conventional-loans" element={<ConventionalLoansPage />} />
          <Route path="/cmbs-loans" element={<CMBSLoansPage />} />
          <Route path="/portfolio-loans" element={<PortfolioLoansPage />} />
          <Route path="/construction-loans" element={<ConstructionLoansPage />} />
          <Route path="/bridge-financing" element={<BridgeFinancingPage />} />
          <Route path="/multifamily-loans" element={<MultifamilyLoansPage />} />
          <Route path="/asset-based-loans" element={<AssetBasedLoansPage />} />
          
          {/* Equipment Financing */}
          <Route path="/equipment-financing" element={<EquipmentFinancingPage />} />
          <Route path="/equipment-loans" element={<EquipmentLoansPage />} />
          <Route path="/equipment-leasing" element={<EquipmentLeasingPage />} />
          <Route path="/heavy-equipment" element={<HeavyEquipmentPage />} />
          <Route path="/medical-equipment" element={<MedicalEquipmentPage />} />
          
          {/* Capital Markets */}
          <Route path="/working-capital" element={<WorkingCapitalPage />} />
          <Route path="/business-line-of-credit" element={<BusinessLineOfCreditPage />} />
          <Route path="/term-loans" element={<TermLoansPage />} />
          <Route path="/factoring-based-financing" element={<FactoringBasedFinancingPage />} />
          <Route path="/business-capital" element={<BusinessCapitalPage />} />
          
          {/* Company */}
          <Route path="/company-overview" element={<CompanyOverview />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/marketplace-benefits" element={<MarketplaceBenefitsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          
          {/* Resources */}
          <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
          <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          
          {/* Partners */}
          <Route path="/brokers" element={<BrokersPage />} />
          <Route path="/lenders" element={<LendersPage />} />
          <Route path="/referral-partners" element={<ReferralPartnersPage />} />
          
          {/* Support */}
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/technical-support" element={<TechnicalSupportPage />} />
          
          {/* Legal & Compliance */}
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/nmls-compliance" element={<NMLSCompliancePage />} />
          <Route path="/cfipa" element={<CFIPAPage />} />
          <Route path="/company-licenses" element={<CompanyLicensesPage />} />
          <Route path="/sitemap" element={<SiteMapPage />} />
          
          {/* Auth & Admin */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          
          {/* Loan Applications */}
          <Route path="/apply/sba-loan" element={<SBALoanApplication />} />
          <Route path="/apply/sba-504-loan" element={<SBA504LoanApplication />} />
          <Route path="/apply/conventional-loan" element={<ConventionalLoanApplication />} />
          <Route path="/apply/bridge-loan" element={<BridgeLoanApplication />} />
          <Route path="/apply/commercial-real-estate" element={<CommercialRealEstateApplication />} />
          <Route path="/apply/equipment-loan" element={<EquipmentLoanApplication />} />
          <Route path="/apply/working-capital" element={<WorkingCapitalApplication />} />
          <Route path="/apply/business-line-of-credit" element={<BusinessLineOfCreditApplication />} />
          <Route path="/apply/term-loan" element={<TermLoanApplication />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;