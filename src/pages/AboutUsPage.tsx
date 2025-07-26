import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Target, TrendingUp } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Halo Business Finance</h1>
              <p className="text-xl mb-8 opacity-90">
                Dedicated to providing exceptional business financing solutions with personalized service and competitive rates.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Learn More About Our Services
              </Button>
            </div>
            <div className="relative">
              <img src={businessGrowth} alt="About Halo Business Finance" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              To simplify business financing by connecting entrepreneurs with the right lending solutions 
              through our innovative marketplace platform and expert guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-muted-foreground">Experienced professionals dedicated to your success</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">SBA Preferred</h3>
                <p className="text-muted-foreground">SBA Preferred Lender with proven track record</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
                <p className="text-muted-foreground">Customized financing solutions for your business</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Growth Focus</h3>
                <p className="text-muted-foreground">Committed to fueling your business growth</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;