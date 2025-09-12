import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Percent, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const FactoringBasedFinancingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Flexible Payments</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Factoring-Based Financing</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Financing that grows with your business. Pay a percentage of revenue instead of fixed monthly payments. Perfect for seasonal or growing businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=factoring">Apply for Factoring</a></Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/how-it-works">Learn How It Works</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Percent className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">2-10% of Revenue</h3>
                <p className="text-muted-foreground">Flexible payment rates</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Scales with Growth</h3>
                <p className="text-muted-foreground">Payments adjust to revenue</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">$25K - $2M</h3>
                <p className="text-muted-foreground">Funding amounts</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">How Revenue-Based Financing Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Apply & Get Approved</h4>
                    <p className="text-muted-foreground text-sm">Quick application based on revenue history</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Receive Funding</h4>
                    <p className="text-muted-foreground text-sm">Get capital upfront for business growth</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Share Revenue</h4>
                    <p className="text-muted-foreground text-sm">Pay a percentage of monthly revenue</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Automatic Adjustments</h4>
                    <p className="text-muted-foreground text-sm">Payments automatically adjust with revenue</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Benefits of RBF</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Payments adjust to business performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>No fixed monthly payments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Perfect for seasonal businesses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>No personal guarantees required</span>
                  </li>
                </ul>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>RBF Example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Funding Terms</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Funding Amount:</span>
                      <span>$200,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Share:</span>
                      <span>6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cap Amount:</span>
                      <span>$280,000</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Monthly Payment Examples</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <div>
                        <div className="font-medium">Monthly Revenue: $50,000</div>
                        <div className="text-sm text-muted-foreground">Good month</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">$3,000</div>
                        <div className="text-sm text-muted-foreground">6% payment</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between p-3 bg-muted rounded">
                      <div>
                        <div className="font-medium">Monthly Revenue: $30,000</div>
                        <div className="text-sm text-muted-foreground">Slower month</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">$1,800</div>
                        <div className="text-sm text-muted-foreground">6% payment</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Ideal For:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• SaaS and subscription businesses</li>
                    <li>• E-commerce companies</li>
                    <li>• Seasonal businesses</li>
                    <li>• Fast-growing startups</li>
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

export default FactoringBasedFinancingPage;