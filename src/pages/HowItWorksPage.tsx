import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Clock, Shield, Network, TrendingUp, Star } from "lucide-react";
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