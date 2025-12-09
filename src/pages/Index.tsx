import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import SectionDivider from "@/components/ui/SectionDivider";
import LiveChatWidget from "@/components/LiveChatWidget";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ProductsSection from "@/components/ProductsSection";
import FinancingSolutions from "@/components/FinancingSolutions";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/Footer";
const Index = () => {
  return <>
      <SEO title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans" description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 15,000+ businesses nationwide." keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, SBA 7a loans, SBA 504 loans, SBA express loans, business line of credit, term loans, factoring based financing" canonical="https://halobusinessfinance.com/" />
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content">
          <HeroSection />
          <SectionDivider variant="corporate" height="sm" />
          <ProductsSection />
          <FinancingSolutions />
          <ImageGallery />
          <SectionDivider variant="minimal" height="sm" />
        </main>
        <Footer />
        <LiveChatWidget />
        <StickyMobileCTA />
      </div>
    </>;
};
export default Index;