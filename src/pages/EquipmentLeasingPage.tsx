import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const EquipmentLeasingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" 
          alt="Equipment leasing office technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-left text-white">
            <Badge className="bg-white text-primary mb-4">Flexible Solutions</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Equipment Leasing</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Lease the equipment you need with lower monthly payments and flexible end-of-term options. Perfect for businesses that need to stay current with technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=lease">Start Equipment Lease</a></Button>
              <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10" asChild><Link to="/contact-us">Compare Options</Link></Button>
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
                <h3 className="text-2xl font-bold mb-2">Lower Payments</h3>
                <p className="text-muted-foreground">Reduce monthly costs</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Upgrade Options</h3>
                <p className="text-muted-foreground">Stay current with technology</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Tax Benefits</h3>
                <p className="text-muted-foreground">Potential deductions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Lease vs. Buy Comparison</h2>
              <div className="space-y-6">
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Equipment Leasing Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Lower monthly payments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>No large down payment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Tax advantages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Upgrade to newer equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Preserve credit lines</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">End of Lease Options</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">1</div>
                      <div>
                        <span className="font-medium">Purchase</span>
                        <p className="text-sm text-muted-foreground">Buy the equipment at fair market value</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">2</div>
                      <div>
                        <span className="font-medium">Return</span>
                        <p className="text-sm text-muted-foreground">Simply return the equipment</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">3</div>
                      <div>
                        <span className="font-medium">Upgrade</span>
                        <p className="text-sm text-muted-foreground">Lease newer equipment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Leasing Terms & Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Equipment Value:</span>
                  <span className="font-semibold">$10K - $5M</span>
                </div>
                <div className="flex justify-between">
                  <span>Lease Terms:</span>
                  <span className="font-semibold">12-84 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-semibold">$0 - First payment</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Time:</span>
                  <span className="font-semibold">Same day</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Popular Equipment Categories</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• IT Equipment</div>
                    <div>• Medical Devices</div>
                    <div>• Office Equipment</div>
                    <div>• Manufacturing</div>
                    <div>• Vehicles</div>
                    <div>• Construction</div>
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

export default EquipmentLeasingPage;