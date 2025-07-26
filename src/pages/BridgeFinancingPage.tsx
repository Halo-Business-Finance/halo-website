import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, Clock } from "lucide-react";

const BridgeFinancingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Quick Capital</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bridge Financing</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Fast, flexible financing to bridge the gap between immediate capital needs and long-term financing solutions. Perfect for time-sensitive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Get Bridge Financing</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Quick Quote</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fast Approval</h3>
                <p className="text-muted-foreground">Funding in 5-10 days</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">$100K - $10M</h3>
                <p className="text-muted-foreground">Flexible loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">6-24 Months</h3>
                <p className="text-muted-foreground">Short-term solutions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Bridge Financing Uses</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Acquisition financing while permanent loan is processed</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Property improvements before refinancing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Quick cash for auction purchases</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Lease-up period for new construction</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Distressed property stabilization</span>
                </li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Bridge Financing Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">9% - 15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan-to-Value:</span>
                  <span className="font-semibold">Up to 80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closing Time:</span>
                  <span className="font-semibold">5-10 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Only:</span>
                  <span className="font-semibold">Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Extension Options:</span>
                  <span className="font-semibold">Yes</span>
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