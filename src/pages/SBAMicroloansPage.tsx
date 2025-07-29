import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Users, Shield } from "lucide-react";
import sbaLogo from "@/assets/sba-logo.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const SBAMicroloansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <img src="/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png" alt="Official SBA Logo" className="h-12 w-auto bg-white p-2 rounded-lg" />
                <Badge className="bg-white text-primary">Startup Friendly</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">SBA Microloans</h1>
              <p className="text-xl mb-8 opacity-90">
                Small business loans perfect for startups and businesses needing smaller amounts with flexible requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for Microloan</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
              </div>
            </div>
            <div className="relative">
              <img src={loanConsultation} alt="SBA Microloan consultation" className="rounded-lg shadow-2xl" />
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
                <h3 className="text-2xl font-bold mb-2">Up to $50,000</h3>
                <p className="text-muted-foreground">Maximum loan amount</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">6 Years</h3>
                <p className="text-muted-foreground">Maximum term</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">8-13%</h3>
                <p className="text-muted-foreground">Interest rate range</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SBAMicroloansPage;