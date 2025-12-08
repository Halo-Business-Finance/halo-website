import React, { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import SectionDivider from "@/components/ui/SectionDivider";
import LiveChatWidget from "@/components/LiveChatWidget";
import StickyMobileCTA from "@/components/StickyMobileCTA";

// Lazy load below-the-fold components
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const TrustSignals = lazy(() => import("@/components/TrustSignals"));
const LoanQuiz = lazy(() => import("@/components/LoanQuiz"));
const ImageGallery = lazy(() => import("@/components/ImageGallery"));
const Footer = lazy(() => import("@/components/Footer"));
const SuccessShowcase = lazy(() => import("@/components/SuccessShowcase"));

const Index = () => {
  return (
    <>
      <SEO
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 15,000+ businesses nationwide."
        keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, SBA 7a loans, SBA 504 loans, SBA express loans, business line of credit, term loans, factoring based financing"
        canonical="https://halobusinessfinance.com/"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content">
          <HeroSection />
          
          {/* Trust Signals Section */}
          <Suspense fallback={<div className="h-60 bg-muted animate-pulse rounded-md mx-4" />}>
            <TrustSignals />
          </Suspense>
          
          <SectionDivider variant="corporate" height="sm" />
          
          <Suspense fallback={<div className="h-20 bg-muted animate-pulse rounded-md mx-4" />}>
            <ProductsSection />
          </Suspense>
          
          {/* Loan Quiz Section */}
          <Suspense fallback={<div className="h-60 bg-muted animate-pulse rounded-md mx-4" />}>
            <LoanQuiz />
          </Suspense>
          
          <SectionDivider variant="gradient" height="sm" />
          
          <Suspense fallback={<div className="h-40 bg-muted animate-pulse rounded-md mx-4" />}>
            <ImageGallery />
          </Suspense>
          
          <SectionDivider variant="minimal" height="sm" />
        </main>
        
        <Suspense fallback={<div className="h-20 bg-muted animate-pulse rounded-md mx-4" />}>
          <Footer />
        </Suspense>
        
        {/* Floating UX Components */}
        <LiveChatWidget />
        <StickyMobileCTA />
      </div>
    </>
  );
};

export default Index;
