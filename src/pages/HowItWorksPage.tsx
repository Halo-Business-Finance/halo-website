import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Clock, Shield, Network, TrendingUp, Star, Award, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import { LoanApprovalChart } from "@/components/charts/LoanApprovalChart";
import { IndustryStatsChart } from "@/components/charts/IndustryStatsChart";
import { ProcessDiagram } from "@/components/charts/ProcessDiagram";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Our streamlined process connects you with the right lenders for your business financing needs. Get pre-qualified and funded quickly through our marketplace.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Apply Online</h3>
                <p className="text-muted-foreground">Complete our simple application in minutes</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">We match you with qualified lenders</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Compare Offers</h3>
                <p className="text-muted-foreground">Review and compare loan terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold mb-2">Get Funded</h3>
                <p className="text-muted-foreground">Close on your loan and receive funds</p>
              </CardContent>
            </Card>
          </div>

          {/* Why Our Marketplace Works Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Our Marketplace Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform creates a win-win environment where borrowers get better access to capital and lenders connect with qualified opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Comprehensive Network</h4>
                    <p className="text-muted-foreground">Access to the most extensive network of commercial lenders in the industry, from community banks to major financial institutions.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Competitive Marketplace</h4>
                    <p className="text-muted-foreground">Lenders compete for your business, resulting in better rates, terms, and loan structures tailored to your needs.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Vetted Partners Only</h4>
                    <p className="text-muted-foreground">All lenders undergo rigorous qualification processes including licensing verification, financial stability, and track record review.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Performance Monitoring</h4>
                    <p className="text-muted-foreground">Continuous monitoring of lender performance, customer satisfaction, and loan quality to maintain high standards.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Marketplace?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Access to Multiple Lenders</h4>
                    <p className="text-muted-foreground">Compare offers from our network of qualified lenders</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Fast Pre-Qualification</h4>
                    <p className="text-muted-foreground">Get pre-qualified in minutes without affecting your credit</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Expert Support</h4>
                    <p className="text-muted-foreground">Our team guides you through the entire process</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Competitive Terms</h4>
                    <p className="text-muted-foreground">Find the best rates and terms for your business</p>
                  </div>
                </li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Join thousands of business owners who have successfully secured financing through our marketplace.
                </p>
                <div className="space-y-4">
                  <Button className="w-full" size="lg">Start Your Application</Button>
                  <Button variant="outline" className="w-full" size="lg" asChild><a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Halo Business Finance Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Halo Business Finance?
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              We're committed to providing your business with the capital, expertise, and personalized service you need to achieve your growth goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    SBA Loan Expertise
                  </h3>
                  <p className="text-foreground mb-4">
                    Specialized knowledge in SBA 7(a), 504, and Express loans with a proven track record of successful approvals.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Secure & Compliant
                  </h3>
                  <p className="text-foreground mb-4">
                    Bank-level security and full regulatory compliance ensure your business information and transactions are protected.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Security Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Fast Approval Process
                  </h3>
                  <p className="text-foreground mb-4">
                    Streamlined application process with dedicated loan officers providing quick decisions and personalized service.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary" asChild>
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Commercial Lending Focus
                  </h3>
                  <p className="text-foreground mb-4">
                    Exclusive focus on business financing with deep understanding of commercial real estate and equipment needs.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Our Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Dedicated Loan Officers
                  </h3>
                  <p className="text-foreground mb-4">
                    Work directly with experienced commercial lending professionals who understand your industry and business needs.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Meet Our Team
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Proven Track Record
                  </h3>
                  <p className="text-foreground mb-4">
                    Years of successful business financing with competitive rates and flexible terms tailored to your business.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Success Stories
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Call to action with business image */}
          <div className="text-center mt-16">
            <div className="relative overflow-hidden rounded-2xl max-w-4xl mx-auto">
              <img 
                src={businessGrowth} 
                alt="Business success and growth"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative bg-gradient-to-r from-financial-navy/95 to-primary/90 text-white p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  <img 
                    src={sbaLogo} 
                    alt="SBA Preferred Lender"
                    className="h-12 w-auto"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-2">
                      Ready to Fuel Your Business Growth?
                    </h3>
                    <p className="text-xl text-blue-100 max-w-2xl">
                      Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Our expertise in <Link to="/sba-loans" className="text-white underline hover:text-blue-100">SBA lending</Link> and partnership with <a href="https://www.sba.gov/partners/lenders" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-blue-100">SBA preferred lenders</a> ensures you get the best rates and terms available.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary font-semibold" asChild>
                    <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-primary" asChild>
                    <Link to="/contact-us">Schedule Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Driven Success Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Data-Driven Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how we're helping businesses across industries with proven results and streamlined processes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <LoanApprovalChart />
            <IndustryStatsChart />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ProcessDiagram />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;