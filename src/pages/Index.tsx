import Header from "@/components/Header";
import FastHeroSection from "@/components/FastHeroSection";
import FastProductGrid from "@/components/FastProductGrid";
import Footer from "@/components/Footer";
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
      <div className="min-h-screen bg-white">
        <div className="p-4 bg-blue-500 text-white text-center">
          <h1>LOADING TEST - React is working!</h1>
        </div>
        <Header />
        <FastHeroSection />
        <FastProductGrid />
        <Footer />
      </div>
    </>
  );
};

export default Index;
