import Header from "@/components/Header";
import FastHeroSection from "@/components/FastHeroSection";
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
        <FastHeroSection />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Website is Loading</h1>
            <p className="text-muted-foreground">Testing with FastHeroSection component...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
