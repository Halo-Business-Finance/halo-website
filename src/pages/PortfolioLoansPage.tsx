import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, DollarSign, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const PortfolioLoansPage = () => {
  return (
    <>
      <SEO 
        title="Commercial Refinance Loans | Lower Your Payments | Halo Business Finance"
        description="Refinance your commercial property to lower payments, access equity, or improve terms. Competitive rates for commercial real estate refinancing."
        keywords="commercial refinance, property refinancing, lower payments, commercial mortgage refinance, cash-out refinance, commercial real estate refinancing"
        canonical="https://halobusinessfinance.com/portfolio-loans"
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Lower Your Payments</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Commercial Refinance Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Lower your monthly payments, access equity, or improve loan terms with commercial refinancing. Take advantage of current market rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Start Refinancing</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/contact-us">Check Rates</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingDown className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Lower Rates</h3>
                <p className="text-muted-foreground">Reduce monthly payments</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Cash Out</h3>
                <p className="text-muted-foreground">Access property equity</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Better Terms</h3>
                <p className="text-muted-foreground">Improve loan structure</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for Refinancing</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Lower monthly payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Access equity for growth</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Debt consolidation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Property improvements</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Switch to fixed rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Remove personal guarantees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Better loan terms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Portfolio optimization</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Refinance Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">680+</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Occupied:</span>
                  <span className="font-semibold">12+ months</span>
                </div>
                <div className="flex justify-between">
                  <span>DSCR:</span>
                  <span className="font-semibold">1.20x minimum</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 6.0%</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Potential Savings</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="flex justify-between">
                      <span>Current Payment:</span>
                      <span>$15,000/month</span>
                    </div>
                    <div className="flex justify-between font-semibold text-primary">
                      <span>New Payment:</span>
                      <span>$12,500/month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default PortfolioLoansPage;