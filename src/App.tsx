import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrokersPage from "./pages/BrokersPage";
import LendersPage from "./pages/LendersPage";
import CompanyOverview from "./pages/CompanyOverview";
import SBALoansPage from "./pages/SBALoansPage";
import CommercialLoansPage from "./pages/CommercialLoansPage";
import EquipmentFinancingPage from "./pages/EquipmentFinancingPage";
import BusinessCapitalPage from "./pages/BusinessCapitalPage";
import ResourcesPage from "./pages/ResourcesPage";
import SBA7aLoansPage from "./pages/SBA7aLoansPage";
import SBA504LoansPage from "./pages/SBA504LoansPage";
import SBAExpressLoansPage from "./pages/SBAExpressLoansPage";
import SBAMicroloansPage from "./pages/SBAMicroloansPage";
import CareersPage from "./pages/CareersPage";

import ConventionalLoansPage from "./pages/ConventionalLoansPage";
import CMBSLoansPage from "./pages/CMBSLoansPage";
import RefinanceLoansPage from "./pages/RefinanceLoansPage";
import ConstructionLoansPage from "./pages/ConstructionLoansPage";
import BridgeFinancingPage from "./pages/BridgeFinancingPage";
import EquipmentLoansPage from "./pages/EquipmentLoansPage";
import EquipmentLeasingPage from "./pages/EquipmentLeasingPage";
import HeavyEquipmentPage from "./pages/HeavyEquipmentPage";
import MedicalEquipmentPage from "./pages/MedicalEquipmentPage";
import TermLoansPage from "./pages/TermLoansPage";
import RevenueBasedFinancingPage from "./pages/RevenueBasedFinancingPage";
import LoanCalculatorPage from "./pages/LoanCalculatorPage";
import PreQualificationPage from "./pages/PreQualificationPage";
import IndustrySolutionsPage from "./pages/IndustrySolutionsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import MarketplaceBenefitsPage from "./pages/MarketplaceBenefitsPage";
import NMLSCompliancePage from "./pages/NMLSCompliancePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AccessibilityPage from "./pages/AccessibilityPage";
import SiteMapPage from "./pages/SiteMapPage";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import WorkingCapitalPage from "./pages/WorkingCapitalPage";
import BusinessLineOfCreditPage from "./pages/BusinessLineOfCreditPage";
import SBALoanApplication from "./pages/SBALoanApplication";
import SBA504LoanApplication from "./pages/SBA504LoanApplication";
import BridgeLoanApplication from "./pages/BridgeLoanApplication";
import ConventionalLoanApplication from "./pages/ConventionalLoanApplication";
import BusinessLineOfCreditApplication from "./pages/BusinessLineOfCreditApplication";
import TermLoanApplication from "./pages/TermLoanApplication";
import EquipmentLoanApplication from "./pages/EquipmentLoanApplication";
import WorkingCapitalApplication from "./pages/WorkingCapitalApplication";
import CommercialRealEstateApplication from "./pages/CommercialRealEstateApplication";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brokers" element={<BrokersPage />} />
          <Route path="/lenders" element={<LendersPage />} />
          <Route path="/company-overview" element={<CompanyOverview />} />
          <Route path="/sba-loans" element={<SBALoansPage />} />
          <Route path="/commercial-loans" element={<CommercialLoansPage />} />
          <Route path="/equipment-financing" element={<EquipmentFinancingPage />} />
          <Route path="/business-capital" element={<BusinessCapitalPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/sba-7a-loans" element={<SBA7aLoansPage />} />
          <Route path="/sba-504-loans" element={<SBA504LoansPage />} />
          <Route path="/sba-express-loans" element={<SBAExpressLoansPage />} />
          <Route path="/sba-microloans" element={<SBAMicroloansPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
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
          <Route path="/refinance-loans" element={<RefinanceLoansPage />} />
          <Route path="/construction-loans" element={<ConstructionLoansPage />} />
          <Route path="/bridge-financing" element={<BridgeFinancingPage />} />
          <Route path="/equipment-loans" element={<EquipmentLoansPage />} />
          <Route path="/equipment-leasing" element={<EquipmentLeasingPage />} />
          <Route path="/heavy-equipment" element={<HeavyEquipmentPage />} />
          <Route path="/medical-equipment" element={<MedicalEquipmentPage />} />
          <Route path="/term-loans" element={<TermLoansPage />} />
          <Route path="/revenue-based-financing" element={<RevenueBasedFinancingPage />} />
          <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
          <Route path="/pre-qualification" element={<PreQualificationPage />} />
          <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/marketplace-benefits" element={<MarketplaceBenefitsPage />} />
          <Route path="/nmls-compliance" element={<NMLSCompliancePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/sitemap" element={<SiteMapPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
