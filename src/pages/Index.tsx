// Update this page (the content is just a fallback if you fail to update the page)

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import StatsSection from "@/components/StatsSection";
import ImageGallery from "@/components/ImageGallery";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

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
      <StatsSection />
      <ImageGallery />
      <FeaturesSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
