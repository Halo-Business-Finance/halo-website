import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Target, Award, TrendingUp, Building2, Shield, Linkedin } from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";

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

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Leadership & Executive Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the experienced professionals leading Halo Business Finance with decades 
              of combined expertise in commercial lending and financial services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* CEO */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src="/lovable-uploads/2a9e367f-246a-4c3f-a2a2-13e7f71d47f4.png" alt="Varda Dinkha, Founder & CEO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">Varda Dinkha</h3>
                <p className="text-primary font-semibold mb-3">Founder & Chief Executive Officer</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Varda founded Halo Business Finance in 2015 with a vision to transform business lending through 
                  innovative technology. As a full stack engineer with expertise in fintech, AI, and blockchain, 
                  he brings a unique combination of technical innovation and financial industry expertise to the marketplace.
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  NMLS Broker (ID: 2272778) | Full Stack Engineer | Fintech, AI & Blockchain Graduate
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/vardad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* COO */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src="/lovable-uploads/5f6c063c-d95d-4d6f-bcd4-3c3ff463d84b.png" alt="Nuri Khoshaba, Chief Operating Officer" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nuri Khoshaba</h3>
                <p className="text-primary font-semibold mb-3">Chief Operating Officer</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Nuri has led operations at Halo Business Finance for nearly 7 years, combining extensive 
                  entrepreneurial experience with operational excellence. His background as a business owner 
                  and public speaking expertise brings unique insights to strategic initiatives and team leadership.
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  BS Liberal Arts & Sciences, UIC (1994) | 6+ Years COO | Public Speaking Expert
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/nuri-khoshaba-51b4689a" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CRO */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">David Thompson</h3>
                <p className="text-primary font-semibold mb-3">Chief Risk Officer</p>
                <p className="text-sm text-muted-foreground mb-4">
                  David brings 18 years of risk management expertise from major banks. 
                  He developed our proprietary risk assessment models that maintain 
                  industry-leading approval rates while minimizing defaults.
                </p>
                <div className="text-xs text-muted-foreground">
                  MS Risk Management | Former SVP at JPMorgan Chase
                </div>
              </CardContent>
            </Card>

            {/* Head of SBA */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Jennifer Martinez</h3>
                <p className="text-primary font-semibold mb-3">Head of SBA Lending</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Jennifer leads our SBA division with 15+ years specializing in government-backed 
                  loans. Her expertise helped us achieve SBA Preferred Lender status and maintain 
                  95% approval rates.
                </p>
                <div className="text-xs text-muted-foreground">
                  BS Business Administration | SBA Lending Specialist
                </div>
              </CardContent>
            </Card>

            {/* Head of Equipment */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Robert Kim</h3>
                <p className="text-primary font-semibold mb-3">Head of Equipment Financing</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Robert oversees our equipment financing division, specializing in heavy machinery, 
                  medical equipment, and technology financing. Expert in asset valuation and 
                  lease structuring.
                </p>
                <div className="text-xs text-muted-foreground">
                  MBA Finance | Equipment Finance Association Member
                </div>
              </CardContent>
            </Card>

            {/* Head of Technology */}
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Alex Johnson</h3>
                <p className="text-primary font-semibold mb-3">Head of Technology</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Alex leads our technology initiatives, developing the marketplace platform that 
                  connects borrowers with lenders. His fintech innovations have automated 80% 
                  of our underwriting processes.
                </p>
                <div className="text-xs text-muted-foreground">
                  MS Computer Science | Former Lead Engineer at Kabbage
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Values */}
          <div className="bg-muted/30 rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Leadership Principles</h3>
              <p className="text-muted-foreground">
                The values that guide our executive team and drive our company culture
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Excellence</h4>
                <p className="text-sm text-muted-foreground">
                  Committed to delivering exceptional service and results
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Working together to achieve shared goals and success
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Pioneering new solutions in commercial lending
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Integrity</h4>
                <p className="text-sm text-muted-foreground">
                  Maintaining the highest ethical standards in all we do
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyOverview;