// Update this page (the content is just a fallback if you fail to update the page)

import React, { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import CriticalCSS from "@/components/optimization/CriticalCSS";
import ResourcePreloader from "@/components/optimization/ResourcePreloader";
import SectionDivider from "@/components/ui/SectionDivider";

// Lazy load below-the-fold components
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const ImageGallery = lazy(() => import("@/components/ImageGallery"));
const Footer = lazy(() => import("@/components/Footer"));
const IndustryShowcase = lazy(() => import("@/components/IndustryShowcase"));
const SuccessShowcase = lazy(() => import("@/components/SuccessShowcase"));

const Index = () => {
  console.log('Index page component mounting...');
  return (
    <>
      <CriticalCSS />
      <ResourcePreloader />
      <SEO 
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 1,500+ businesses nationwide."
        keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, SBA 7a loans, SBA 504 loans, SBA express loans, business line of credit, term loans, factoring based financing"
        canonical="https://halobusinessfinance.com/"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        
        <SectionDivider variant="corporate" height="sm" />
        
        <Suspense fallback={<div className="h-20 bg-muted animate-pulse rounded-md mx-4" />}>
          <ProductsSection />
        </Suspense>
        
        <SectionDivider variant="gradient" height="sm" />
        
        <Suspense fallback={<div className="h-40 bg-muted animate-pulse rounded-md mx-4" />}>
          <ImageGallery />
        </Suspense>
        
        <SectionDivider variant="corporate" height="md" />
        
        <Suspense fallback={<div className="h-60 bg-muted animate-pulse rounded-md mx-4" />}>
          <IndustryShowcase />
        </Suspense>
        
        <SectionDivider variant="minimal" height="sm" />
        
        <Suspense fallback={<div className="h-20 bg-muted animate-pulse rounded-md mx-4" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Index;
