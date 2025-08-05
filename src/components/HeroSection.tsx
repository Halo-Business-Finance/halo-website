import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import newHeroBackground from "@/assets/new-hero-background.jpg";
import businessOwnerProfessional from "@/assets/business-owner-professional.jpg";
import businessConsultationProfessional from "@/assets/business-consultation-professional.jpg";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";

const HeroSection = () => {

  return (
    <section 
      className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: `url(${newHeroBackground})` }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-1 gap-8 lg:gap-16 items-center">
          <header className="text-white space-y-6 lg:space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                Nationwide SBA & Commercial Loan Marketplace
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block">Business Financing</span>
                <span className="block text-primary-glow">that Grows with You</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-lg leading-relaxed">
                We offer flexible <Link to="/sba-loans" className="text-white underline hover:text-blue-100 font-medium">SBA</Link> and <Link to="/conventional-loans" className="text-white underline hover:text-blue-100 font-medium">commercial financing</Link><br />
                to help your business go far.
              </p>
            </div>

            {/* Enhanced CTA Cards - Chase Style */}
            <div className="flex justify-center">
              {/* New Business Customers Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 max-w-md">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white mb-1">Get Pre-Qualified</div>
                  <div className="text-blue-100 text-sm">Fast 2-minute application</div>
                </div>
                <Button size="lg" className="w-full bg-white text-primary font-semibold shadow-[var(--shadow-button)] hover:bg-gray-50" asChild>
                  <a href="https://preview--hbf-application.lovable.app/auth">Start Application</a>
                </Button>
              </div>
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
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;