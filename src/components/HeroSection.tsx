import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";

import heroBackground from "@/assets/new-hero-background.jpg";

const HeroSection = () => {

  return (
    <section 
      className="relative min-h-[460px] md:min-h-[520px] flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      <LazyImage 
        src={heroBackground}
        alt="Business financing hero background"
        className="absolute inset-0 w-full h-full object-cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <header className="text-white space-y-6">
            <div className="space-y-5">
              
              <h1 className="text-base md:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
                <span className="block">Nationwide Commercial &</span>
                <span className="block text-primary-glow">Business Financing Marketplace</span>
              </h1>
              
              <p className="text-xs md:text-base text-white max-w-full leading-relaxed">
                <span className="block">Our Loan Marketplace offers flexible <Link to="/sba-loans" className="text-white underline hover:text-white font-medium">SBA</Link> and <Link to="/conventional-loans" className="text-white underline hover:text-white font-medium">Commercial Financing</Link> to help your business get approved</span>
                <span className="block">for a loan without the hassle of looking for a bank or lender.</span>
              </p>
              
              {/* Apply Here Button */}
              <div className="pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <a href="https://app.halolending.com">Apply Here</a>
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-glow" />
                <span className="text-sm text-white">SBA & Commercial Loan Marketplace</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-primary-glow" />
                <span className="text-white">Secure & Encrypted</span>
              </div>
            </div>
          </header>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;