import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourcesHub from "@/components/ResourcesHub";
import SEO from "@/components/SEO";

const BusinessFinanceResourcesPage = () => {
  return (
    <>
      <SEO 
        title="Business Finance Resources | Tools, Guides & Industry Insights"
        description="Access comprehensive business finance resources including loan calculators, industry guides, SBA information, and trusted external resources to help your business succeed."
        keywords="business finance resources, loan calculator, SBA resources, business tools, industry guides, small business resources, financing guides, business education"
        canonical="https://halobusinessfinance.com/business-finance-resources"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <ResourcesHub />
        <Footer />
      </div>
    </>
  );
};

export default BusinessFinanceResourcesPage;