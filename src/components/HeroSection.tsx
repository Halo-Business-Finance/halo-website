import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";

import heroBackground from "@/assets/new-hero-background.jpg";

const HeroSection = () => {

  return (
    <section 
      className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Professional Background */}
      <LazyImage 
        src={heroBackground}
        alt="Business financing hero background"
        className="absolute inset-0 w-full h-full object-cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/90 via-financial-navy/70 to-financial-navy/80"></div>
      
      {/* Premium Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-financial-gold/30 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Enhanced Header Content */}
          <header className="text-white space-y-8">
            <div className="space-y-6">
              {/* Enterprise Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Shield className="h-5 w-5 text-financial-gold" />
                <span className="text-sm font-semibold tracking-wide uppercase">Enterprise Financial Solutions</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                <span className="block">Business Financing</span>
                <span className="block text-financial-gold">that Grows with You</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed font-light">
                Our comprehensive marketplace offers flexible <Link to="/sba-loans" className="text-financial-gold underline hover:text-white font-medium transition-colors">SBA</Link> and <Link to="/conventional-loans" className="text-financial-gold underline hover:text-white font-medium transition-colors">Commercial Financing</Link> solutions designed for enterprise growth.
              </p>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <Shield className="h-6 w-6 text-financial-gold flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">SBA & Commercial Marketplace</div>
                  <div className="text-sm text-white/80">Trusted by 2,500+ businesses</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <Lock className="h-6 w-6 text-financial-gold flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Bank-Level Security</div>
                  <div className="text-sm text-white/80">256-bit encryption</div>
                </div>
              </div>
            </div>
          </header>

          {/* Premium CTA Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">Get Pre-Qualified</div>
                <div className="text-white/90 text-lg">Enterprise application process</div>
                <div className="text-financial-gold text-sm font-medium mt-1">2-minute assessment • No credit impact</div>
              </div>
              
              {/* Premium Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-financial-gold font-bold text-lg">$2.5B+</div>
                  <div className="text-white/80 text-sm">Funded</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-financial-gold font-bold text-lg">24hrs</div>
                  <div className="text-white/80 text-sm">Approval</div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-financial-gold hover:bg-financial-gold/90 text-financial-navy font-bold text-lg py-4 shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                asChild
              >
                <a href="https://preview--hbf-application.lovable.app/auth">
                  Start Enterprise Application
                </a>
              </Button>
              
              <p className="text-white/70 text-xs text-center mt-3">
                Secure • FDIC Insured • SBA Preferred Lender
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;