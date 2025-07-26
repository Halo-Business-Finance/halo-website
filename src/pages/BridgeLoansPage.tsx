import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, TrendingUp } from "lucide-react";

const BridgeLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Fast Financing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bridge Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Quick financing solutions to bridge the gap between immediate needs and permanent financing. Get funds fast for time-sensitive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for Bridge Loan</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fast Approval</h3>
                <p className="text-muted-foreground">Funding in days, not months</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $5M</h3>
                <p className="text-muted-foreground">Flexible loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Competitive Rates</h3>
                <p className="text-muted-foreground">Market-leading terms</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">When You Need Bridge Financing</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Purchasing new property before selling existing property</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Time-sensitive acquisition opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Short-term working capital needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Refinancing existing debt</span>
                </li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Bridge Loan Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-semibold">$100K - $5M</span>
                </div>
                <div className="flex justify-between">
                  <span>Term:</span>
                  <span className="font-semibold">6-24 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Time:</span>
                  <span className="font-semibold">3-7 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">Starting at 8.5%</span>
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

export default BridgeLoansPage;