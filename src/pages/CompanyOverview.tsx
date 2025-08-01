import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Target, Award, TrendingUp, Building2, Shield, Linkedin } from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import VardaChatBot from "@/components/VardaChatBot";

const CompanyOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556155092-490a1ba16284" 
          alt="Professional office workspace representing company overview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Halo Business Finance
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Nationwide SBA, Commercial and Equipment Loan Marketplace
            </p>
            <p className="text-lg opacity-80">
              Our commercial loan marketplace offers a streamlined loan process without 
              the hassle of looking for the best interest rate or the right lender.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To simplify commercial lending by connecting businesses with the right 
                  lenders through our innovative marketplace platform, ensuring competitive 
                  rates and exceptional service.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To be the leading nationwide marketplace for commercial lending, 
                  empowering businesses to achieve their growth goals through accessible 
                  and efficient financing solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Streamlined Loan Process
            </h2>
            <p className="text-xl text-muted-foreground">
              We make commercial lending simple
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Select Your Loan Program", description: "Choose from our comprehensive range of loan products" },
              { step: "02", title: "Answer Questions", description: "Complete our simple application about your loan request" },
              { step: "03", title: "Get Pre-Approved", description: "Authorize a soft credit check for instant pre-approval" },
              { step: "04", title: "Upload Financials", description: "Submit your documents to receive competitive term sheets" },
              { step: "05", title: "Get Funded", description: "Sign your loan documents and receive your funding" }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-4">{item.step}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Marketplace Benefits
            </h2>
            <p className="text-xl text-muted-foreground">
              Our commercial loan marketplace helps borrowers get the best interest rate 
              without the hassle of looking for a lender.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Simple Loan Application",
                description: "Our loan application process is quick, easy and hassle-free"
              },
              {
                icon: TrendingUp,
                title: "Fast Approval Process",
                description: "Get approved quickly with our streamlined loan process"
              },
              {
                icon: Award,
                title: "Competitive Rates",
                description: "Get the most competitive interest rate in the market"
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Our loan specialists will guide you through the loan process"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Real Estate Focus */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-12 w-12 text-primary" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Nationwide Commercial Real Estate Loans
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Our commercial loan marketplace can help you find the best interest rate 
                    without wasting time looking for a bank or lender.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-1 gap-4 mb-8">
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Purchase Loans</h3>
                    <p className="text-sm text-muted-foreground">Finance your commercial property acquisition</p>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Refinance Loans</h3>
                    <p className="text-sm text-muted-foreground">Optimize your existing commercial property financing</p>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Construction Loans</h3>
                    <p className="text-sm text-muted-foreground">Fund your commercial development projects</p>
                  </CardContent>
                </Card>
              </div>

              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Today
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="Commercial real estate loan consultation"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Ethics & Transparency Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values & Commitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At Halo Business Finance, we're committed to ethical lending practices, 
              transparency, and empowering businesses through innovative financial solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Mission Statement */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Target className="h-10 w-10 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  To revolutionize commercial lending by creating a transparent, efficient 
                  marketplace that connects businesses with the right lenders, ensuring 
                  competitive rates and exceptional service for every client.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Simplify the commercial lending process</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Provide access to competitive financing options</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Support business growth and success</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ethics */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Shield className="h-10 w-10 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Ethical Standards</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We uphold the highest ethical standards in all our business practices, 
                  ensuring fair treatment, honest communication, and responsible lending 
                  that puts our clients' best interests first.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">NMLS compliant lending practices</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fair and honest fee structures</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Responsible lending guidelines</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transparency */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Award className="h-10 w-10 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Transparency</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We believe in complete transparency throughout the lending process. 
                  Our clients always know exactly what to expect, with clear terms, 
                  upfront fees, and honest communication at every step.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clear, upfront fee disclosure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Transparent lending process</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Open communication and updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Commitments */}
          <div className="bg-background rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Commitments to You</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Halo Business Finance
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Client-First Approach</h4>
                <p className="text-sm text-muted-foreground">
                  Your success is our priority in every decision we make
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Continuous Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Always improving our technology and processes for better service
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Industry Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  Deep knowledge of commercial lending and market trends
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Proven Results</h4>
                <p className="text-sm text-muted-foreground">
                  Track record of successful funding for 2,500+ businesses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VardaChatBot />
      <Footer />
    </div>
  );
};

export default CompanyOverview;