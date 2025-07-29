import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundRemover from "@/components/BackgroundRemover";
import SEO from "@/components/SEO";

const BackgroundRemoverPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="SBA Logo Background Remover | Create Transparent Logos"
        description="Remove backgrounds from SBA logos to create transparent PNG files. Free online background removal tool."
        keywords="background remover, transparent logo, SBA logo, PNG transparent"
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">SBA Logo Background Remover</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your SBA logo into a transparent PNG with our AI-powered background removal tool.
            </p>
          </div>
          
          <BackgroundRemover />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BackgroundRemoverPage;