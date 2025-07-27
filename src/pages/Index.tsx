// Update this page (the content is just a fallback if you fail to update the page)

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import StatsSection from "@/components/StatsSection";
import ImageGallery from "@/components/ImageGallery";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { LendingStatsSection } from "@/components/charts/LendingStatsSection";
import { LoanApprovalChart } from "@/components/charts/LoanApprovalChart";
import { IndustryStatsChart } from "@/components/charts/IndustryStatsChart";
import { ProcessDiagram } from "@/components/charts/ProcessDiagram";
import MarketplaceOverview from "@/components/MarketplaceOverview";
import ResourcesHub from "@/components/ResourcesHub";
import PartnershipsSection from "@/components/PartnershipsSection";

import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 2,500+ businesses nationwide."
        keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, SBA 7a loans, SBA 504 loans, SBA express loans, business line of credit, term loans, revenue based financing"
        canonical="https://halobusinessfinance.com/"
      />
      <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductsSection />
      <MarketplaceOverview />
      <LendingStatsSection />
      
      {/* Charts Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Data-Driven Success
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how we're helping businesses across industries with proven results and streamlined processes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <LoanApprovalChart />
            <IndustryStatsChart />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ProcessDiagram />
          </div>
        </div>
      </section>
      
      <StatsSection />
      <ResourcesHub />
      <PartnershipsSection />
      <ImageGallery />
      <FeaturesSection />
      <Footer />
      </div>
    </>
  );
};

export default Index;
