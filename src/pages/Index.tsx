// Update this page (the content is just a fallback if you fail to update the page)

import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import CodeSplitWrapper from "@/components/optimization/CodeSplitWrapper";

// Lazy load below-the-fold components for better performance
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const ImageGallery = lazy(() => import("@/components/ImageGallery"));
const IndustryShowcase = lazy(() => import("@/components/IndustryShowcase"));
const Footer = lazy(() => import("@/components/Footer"));

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
        
        {/* Lazy load below-the-fold content for better performance */}
        <CodeSplitWrapper fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
            <ProductsSection />
          </Suspense>
        </CodeSplitWrapper>
        
        <CodeSplitWrapper fallback={<div className="h-64 bg-muted/20 animate-pulse" />}>
          <Suspense fallback={<div className="h-64 bg-muted/20 animate-pulse" />}>
            <ImageGallery />
          </Suspense>
        </CodeSplitWrapper>
        
        <CodeSplitWrapper fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
            <IndustryShowcase />
          </Suspense>
        </CodeSplitWrapper>
        
        <CodeSplitWrapper fallback={<div className="h-64 bg-muted/20 animate-pulse" />}>
          <Suspense fallback={<div className="h-64 bg-muted/20 animate-pulse" />}>
            <Footer />
          </Suspense>
        </CodeSplitWrapper>
      </div>
    </>
  );
};

export default Index;
