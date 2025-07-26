import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Shield, Zap } from "lucide-react";

const MarketplaceBenefitsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Marketplace Advantage</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Marketplace Benefits</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover the advantages of using our commercial loan marketplace. Access multiple lenders, compare offers, and secure the best financing for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Multiple Lenders</h3>
                <p className="text-muted-foreground">Access our network of qualified lenders</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Better Rates</h3>
                <p className="text-muted-foreground">Competition drives better terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Faster Process</h3>
                <p className="text-muted-foreground">Streamlined application process</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">Professional guidance throughout</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">For Borrowers</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">One Application, Multiple Offers</h4>
                    <p className="text-muted-foreground">
                      Submit one application and receive offers from multiple qualified lenders. Save time and compare terms side-by-side.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Competitive Pricing</h4>
                    <p className="text-muted-foreground">
                      Lenders compete for your business, resulting in better rates and terms than you might find elsewhere.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">No Cost to You</h4>
                    <p className="text-muted-foreground">
                      Our marketplace service is free for borrowers. We're paid by lenders when loans close successfully.
                    </p>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Borrower Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Access to 50+ qualified lenders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Competitive rates and terms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Free marketplace service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Expert loan guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Streamlined application process</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Card>
                <CardHeader>
                  <CardTitle>Lender Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Access to qualified borrowers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Pre-screened applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Reduced acquisition costs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Streamlined origination</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Technology platform access</span>
                  </div>
                </CardContent>
              </Card>
              <div>
                <h2 className="text-3xl font-bold mb-6">For Lenders</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Quality Deal Flow</h4>
                    <p className="text-muted-foreground">
                      Access pre-screened, qualified borrowers looking for commercial financing solutions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Efficient Origination</h4>
                    <p className="text-muted-foreground">
                      Leverage our technology platform to streamline your loan origination process.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Competitive Advantage</h4>
                    <p className="text-muted-foreground">
                      Compete for quality deals while maintaining your underwriting standards and pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center bg-muted rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Benefits?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our marketplace and discover how we can help you achieve your financing goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Apply for Financing</Button>
              <Button size="lg" variant="outline">Become a Lender</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketplaceBenefitsPage;