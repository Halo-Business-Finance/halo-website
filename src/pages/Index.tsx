// Update this page (the content is just a fallback if you fail to update the page)

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import StatsSection from "@/components/StatsSection";
import ImageGallery from "@/components/ImageGallery";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { CrawlForm } from "@/components/CrawlForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Website Import Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <CrawlForm />
        </div>
      </section>
      
      <ProductsSection />
      <StatsSection />
      <ImageGallery />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
