import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building, DollarSign, Shield } from "lucide-react";

const ConventionalLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Traditional Financing</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Conventional Commercial Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Traditional commercial real estate financing with competitive rates and flexible terms. Perfect for established businesses looking to purchase or refinance properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><Link to="/auth?loan=conventional">Apply Now</Link></Button>
               <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/auth?loan=conventional">Get Quote</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $20M</h3>
                <p className="text-muted-foreground">Loan amounts available</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">20-30 Years</h3>
                <p className="text-muted-foreground">Long-term financing</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">All Property Types</h3>
                <p className="text-muted-foreground">Office, retail, industrial</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for Conventional Loans</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Property purchases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Refinancing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Property improvements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Portfolio expansion</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Cash-out refinance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Investment properties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Business expansion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Debt consolidation</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Loan Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-semibold">20-25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">680+</span>
                </div>
                <div className="flex justify-between">
                  <span>Business Age:</span>
                  <span className="font-semibold">2+ years</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Flow:</span>
                  <span className="font-semibold">1.25x DSCR</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConventionalLoansPage;