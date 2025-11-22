import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";
import heroBackground from "@/assets/new-hero-background.jpg";
const HeroSection = () => {
  if (import.meta.env.DEV) console.log('HeroSection rendering, heroBackground:', heroBackground);
  return <section className="relative min-h-[460px] md:min-h-[520px] flex items-center overflow-hidden" aria-label="Hero section">
      <LazyImage 
        src={heroBackground} 
        alt="Business financing hero background" 
        className="absolute inset-0 w-full h-full object-cover" 
        priority={true} 
        onLoad={() => import.meta.env.DEV && console.log('Hero background image loaded successfully')} 
        onError={() => import.meta.env.DEV && console.log('Hero background image failed to load')} 
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 relative z-10">
        <div className="w-full items-center bg-transparent">
          <header className="text-white space-y-6 bg-transparent">
            <div className="space-y-5">
              
              <h1 className="text-base md:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
                <span className="block text-white text-xl md:text-3xl">Nationwide Commercial &</span>
                <span className="block text-primary-glow text-xl md:text-3xl text-slate-50 bg-[#000a0e]/0">Business Financing Marketplace</span>
              </h1>
              
              <p className="text-xs md:text-base text-white max-w-4xl leading-relaxed">
                <span className="block text-lg">Our Loan Marketplace offers flexible <Link to="/sba-loans" className="text-white underline hover:text-white font-medium">SBA</Link> and <Link to="/conventional-loans" className="text-white underline hover:text-white font-medium">Commercial Financing</Link></span>
                <span className="block text-lg">to help your business get approved for a loan without the hassle of looking for a bank or lender.</span>
              </p>
              
              {/* Apply Here Button */}
              <div className="pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300 h-auto" asChild>
                  <a href="https://app.halolending.com" className="flex flex-col items-start gap-0">
                    <span className="flex items-center gap-1.5 text-sm font-bold">
                      <Lock className="h-3.5 w-3.5" />
                      Apply Here
                    </span>
                    <span className="text-[9px] font-normal opacity-90 ml-5">
                      Secure & Encrypted
                    </span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 py-0">
              <div className="flex items-center gap-2">
                
                
              </div>
            </div>
          </header>

        </div>
      </div>
    </section>;
};
export default HeroSection;