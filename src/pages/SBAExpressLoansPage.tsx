import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, Zap } from "lucide-react";
import sbaLogo from "@/assets/sba-logo.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const SBAExpressLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <img src={sbaLogo} alt="SBA Express Loans" className="h-16 w-auto" />
                <Badge className="bg-white text-primary">Fast Approval</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">SBA Express Loans</h1>
              <p className="text-xl mb-8 opacity-90">
                Fast-track SBA financing with expedited approval for urgent business needs. Get approved in as little as 36 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for SBA Express</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
              </div>
            </div>
            <div className="relative">
              <img src={loanConsultation} alt="SBA Express consultation" className="rounded-lg shadow-2xl" />
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
                <h3 className="text-2xl font-bold mb-2">Up to $500,000</h3>
                <p className="text-muted-foreground">Maximum loan amount</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">36 Hours</h3>
                <p className="text-muted-foreground">Approval timeline</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">50% Guarantee</h3>
                <p className="text-muted-foreground">SBA guarantee</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for SBA Express Loans</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Working capital</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Equipment purchases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Business expansion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Inventory financing</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Debt refinancing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Marketing initiatives</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Real estate purchases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Business acquisitions</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>SBA Express Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">650+</span>
                </div>
                <div className="flex justify-between">
                  <span>Time in Business:</span>
                  <span className="font-semibold">2+ years</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Revenue:</span>
                  <span className="font-semibold">$100K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 5.5%</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">SBA Express Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 50% SBA guarantee</li>
                    <li>• Expedited 36-hour approval</li>
                    <li>• Lower down payments</li>
                    <li>• Flexible use of funds</li>
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

export default SBAExpressLoansPage;