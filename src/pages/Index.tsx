// Update this page (the content is just a fallback if you fail to update the page)

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";

import ImageGallery from "@/components/ImageGallery";

import Footer from "@/components/Footer";
import { LendingStatsSection } from "@/components/charts/LendingStatsSection";
import ResourcesHub from "@/components/ResourcesHub";
import PartnershipsSection from "@/components/PartnershipsSection";
import IndustryShowcase from "@/components/IndustryShowcase";

import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 2,500+ businesses nationwide."
        keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, SBA 7a loans, SBA 504 loans, SBA express loans, business line of credit, term loans, factoring based financing"
        canonical="https://halobusinessfinance.com/"
      />
      <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductsSection />
      <IndustryShowcase />
      <LendingStatsSection />
      
      <ResourcesHub />
      <PartnershipsSection />
      <ImageGallery />
      <Footer />
      </div>
    </>
  );
};

export default Index;
