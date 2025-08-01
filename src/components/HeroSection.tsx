import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import businessLoanApproved from "@/assets/business-loan-approved.jpg";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";

const HeroSection = () => {

  return (
    <section className="relative bg-gradient-to-br from-primary to-financial-navy min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden" aria-label="Hero section">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Commercial real estate buildings representing business growth and financing opportunities"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-financial-navy/40" />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero content */}
          <header className="text-white space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                SBA Loans & Business Financing
                <span className="block text-2xl md:text-3xl lg:text-4xl xl:text-5xl">that fuel your growth</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-lg">
                Experience streamlined business lending with competitive <Link to="/sba-loans" className="text-white underline hover:text-blue-100">SBA</Link> and <Link to="/conventional-loans" className="text-white underline hover:text-blue-100">commercial loan</Link> solutions designed to accelerate your success.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary font-semibold text-sm md:text-base" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent text-sm md:text-base" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth?loan=refinance">View Loan Options</a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SBA Preferred Bank Partner</span>
              </div>
              <div className="text-sm">Secure & Encrypted Marketplace</div>
            </div>
          </header>

          {/* Right side - Quick action card */}
          <aside className="lg:justify-self-end" aria-label="Quick financing actions">
            <Card className="w-full max-w-md bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">Get Started Today</h2>
                    <p className="text-foreground mt-2">Access business financing solutions quickly and securely</p>
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full h-11 font-medium" asChild>
                      <a href="https://preview--hbf-application.lovable.app/auth?loan=refinance">
                        Apply for Financing
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full h-11 font-medium" asChild>
                      <a href="https://preview--hbf-application.lovable.app/auth">
                        Access Your Account
                      </a>
                    </Button>
                  </div>

                  <div className="text-center text-sm text-foreground">
                    Need help choosing?{" "}
                     <Link to="/pre-qualification" className="text-primary font-medium">
                       Take our quiz
                     </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        
        {/* Success Showcase - Small images at bottom of hero */}
        <div className="mt-12 lg:mt-16">
          <div className="text-center mb-6">
            <p className="text-white/80 text-sm font-medium">Trusted by thousands of successful businesses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="relative h-24 rounded-lg overflow-hidden">
              <img 
                src={sbaLoanHandshake} 
                alt="Successful SBA loan approval"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                SBA Loans
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden">
              <img 
                src={businessFinancingMeeting} 
                alt="Business financing consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                Expert Guidance
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden">
              <img 
                src={businessLoanApproved} 
                alt="Business loan approved document"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                Quick Approval
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-lg font-bold">2500+</div>
                <div className="text-xs">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;