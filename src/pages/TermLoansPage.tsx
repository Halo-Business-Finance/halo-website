import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Clock } from "lucide-react";

const TermLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Fixed Rates</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Business Term Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Predictable financing with fixed monthly payments. Perfect for expansion, equipment purchases, or other major business investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for Term Loan</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Calculate Payment</Button>
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
                <h3 className="text-2xl font-bold mb-2">$25K - $5M</h3>
                <p className="text-muted-foreground">Loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">1-10 Years</h3>
                <p className="text-muted-foreground">Flexible terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fixed Rates</h3>
                <p className="text-muted-foreground">Predictable payments</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Term Loan Benefits</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fixed monthly payments for budgeting certainty</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Competitive interest rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>No prepayment penalties</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fast approval process</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Build business credit history</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Common Uses for Term Loans</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Business expansion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Equipment purchases</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Inventory financing</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Real estate purchases</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Debt consolidation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Working capital</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Term Loan Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">650+</span>
                </div>
                <div className="flex justify-between">
                  <span>Time in Business:</span>
                  <span className="font-semibold">1+ years</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Revenue:</span>
                  <span className="font-semibold">$100K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 6.5%</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Payment Example</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span>$100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>7.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Term:</span>
                        <span>5 years</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Monthly Payment:</span>
                        <span className="text-primary">$2,013</span>
                      </div>
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
  );
};

export default TermLoansPage;