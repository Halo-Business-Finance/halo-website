import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Zap, DollarSign, Clock } from "lucide-react";

const BridgeFinancingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-left text-white">
            <Badge className="bg-white text-primary mb-4">Quick Capital</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Bridge Financing</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl">
              Fast, flexible financing to bridge the gap between immediate capital needs and long-term financing solutions. Perfect for time-sensitive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Button size="lg" className="bg-white text-primary">Get Bridge Financing</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/auth?loan=bridge">Quick Quote</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fast Approval</h3>
                <p className="text-foreground">Funding in 5-10 days</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">$100K - $10M</h3>
                <p className="text-foreground">Flexible loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">6-24 Months</h3>
                <p className="text-foreground">Short-term solutions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for Bridge Financing</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Quick acquisitions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Auction purchases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Property improvements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Construction takeout</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Lease-up periods</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Distressed properties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Time-sensitive deals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Working capital needs</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Bridge Financing Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">600+</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-semibold">Real estate experience</span>
                </div>
                <div className="flex justify-between">
                  <span>LTV Ratio:</span>
                  <span className="font-semibold">Up to 80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">9% - 15%</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Financing Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Fast 5-10 day closings</li>
                    <li>• Interest-only payments</li>
                    <li>• Flexible exit strategies</li>
                    <li>• No prepayment penalties</li>
                  </ul>
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

export default BridgeFinancingPage;