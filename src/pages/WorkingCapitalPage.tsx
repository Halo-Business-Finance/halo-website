import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Clock, TrendingUp } from "lucide-react";
import businessLoanApproved from "@/assets/business-loan-approved.jpg";

const WorkingCapitalPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <Badge className="bg-white text-primary">Fast Funding</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Working Capital Loans</h1>
              <p className="text-xl mb-8 opacity-90">
                Bridge cash flow gaps and fund day-to-day operations with flexible working capital solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for Working Capital</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Calculate Payments</Button>
              </div>
            </div>
            <div className="relative">
              <img src={businessLoanApproved} alt="Working capital approved" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $2 Million</h3>
                <p className="text-muted-foreground">Loan amount</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">3-24 Months</h3>
                <p className="text-muted-foreground">Flexible terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Prime + 1%</h3>
                <p className="text-muted-foreground">Starting rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkingCapitalPage;