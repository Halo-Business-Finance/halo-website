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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SBAExpressLoansPage;