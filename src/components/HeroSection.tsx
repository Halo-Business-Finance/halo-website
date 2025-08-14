import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";

import heroBackground from "@/assets/new-hero-background.jpg";

const HeroSection = () => {

  return (
    <section 
      className="relative min-h-[400px] md:min-h-[480px] flex items-center overflow-hidden" 
      aria-label="Hero section"
    >
      <img
        src={heroBackground}
        alt="Business financing hero background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <header className="text-white space-y-6">
            <div className="space-y-5">
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block">Business Financing</span>
                <span className="block text-primary-glow">that Grows with You</span>
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                Our Loan Marketplace offers flexible <Link to="/sba-loans" className="text-white underline hover:text-blue-100 font-medium">SBA</Link> and <Link to="/conventional-loans" className="text-white underline hover:text-blue-100 font-medium">Commercial Financing</Link> to help your business go far.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-glow" />
                <span className="text-sm text-blue-100">SBA & Commercial Loan Marketplace</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-primary-glow" />
                <span className="text-blue-100">Secure & Encrypted</span>
              </div>
            </div>
          </header>

          {/* Enhanced CTA Widget */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 max-w-sm w-full">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white mb-1">Get Pre-Qualified</div>
                <div className="text-blue-100 text-sm">Fast 2-minute application</div>
              </div>
              <Button size="lg" className="w-full bg-white text-primary font-semibold shadow-[var(--shadow-button)] hover:bg-gray-50" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth">Start Application</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;