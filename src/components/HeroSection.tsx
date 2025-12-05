import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, ArrowRight, Calculator, Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";
import heroBackground from "@/assets/new-hero-background.jpg";
import LoanProcessCarousel from "@/components/LoanProcessCarousel";

const HeroSection = () => {
  const quickStats = [
    { icon: DollarSign, value: '$2.5B+', label: 'Funded' },
    { icon: Users, value: '15K+', label: 'Businesses' },
    { icon: Clock, value: '24hrs', label: 'Pre-Approval' },
  ];

  return (
    <>
      <section className="relative min-h-[520px] md:min-h-[580px] flex items-center overflow-hidden" aria-label="Hero section">
        <LazyImage 
          src={heroBackground} 
          alt="Business financing hero background" 
          className="absolute inset-0 w-full h-full object-cover" 
          priority={true} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-3xl">
            <div className="text-white space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-white/90">Over $2.5 Billion Funded</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="block text-white">Nationwide Commercial &</span>
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Business Financing Marketplace
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Our Loan Marketplace offers flexible{' '}
                <Link to="/sba-loans" className="text-blue-300 hover:text-blue-200 underline underline-offset-2 font-medium transition-colors">SBA</Link>
                {' '}and{' '}
                <Link to="/conventional-loans" className="text-blue-300 hover:text-blue-200 underline underline-offset-2 font-medium transition-colors">Commercial Financing</Link>
                {' '}to help your business get approved without the hassle of finding a bank or lender.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button 
                  size="lg" 
                  className="group glass-button text-white font-semibold px-8 py-6 rounded-xl hover:scale-105 transition-all duration-300 animate-glow-pulse"
                  asChild
                >
                  <a href="https://app.halolending.com" className="flex items-center gap-2">
                    Apply Now - Get Pre-Approved
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass-outline text-white font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/loan-calculator" className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculate Your Rate
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/90">Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/90">No Impact to Credit Score</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/90">SBA Preferred Lender</span>
                </div>
              </div>

              {/* Quick Stats - Mobile Only */}
              <div className="grid grid-cols-3 gap-4 pt-4 md:hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                    <stat.icon className="h-5 w-5 mx-auto mb-1 text-blue-300" />
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Loan Process Section */}
      <LoanProcessCarousel />
    </>
  );
};

export default HeroSection;