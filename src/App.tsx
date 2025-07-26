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
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import WorkingCapitalPage from "./pages/WorkingCapitalPage";
import BusinessLineOfCreditPage from "./pages/BusinessLineOfCreditPage";
import SBALoanApplication from "./pages/SBALoanApplication";
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
          <Route path="/equipment-loan-application" element={<EquipmentLoanApplication />} />
          <Route path="/working-capital-application" element={<WorkingCapitalApplication />} />
          <Route path="/commercial-real-estate-application" element={<CommercialRealEstateApplication />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
