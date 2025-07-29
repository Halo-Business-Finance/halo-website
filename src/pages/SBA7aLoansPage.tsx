import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Clock, Shield, TrendingUp } from "lucide-react";
import sbaLogo from "@/assets/sba-logo.jpg";
import smallBusinessOwnerLaptop from "@/assets/small-business-owner-laptop.jpg";
import loanApprovalCelebration from "@/assets/loan-approval-celebration.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const SBA7aLoansPage = () => {
  const loanFeatures = [
    "Up to $5 million in financing",
    "85% SBA guarantee on loans up to $150K", 
    "75% SBA guarantee on loans over $150K",
    "Terms up to 25 years for real estate",
    "Terms up to 10 years for equipment",
    "Working capital terms up to 7 years",
    "Competitive interest rates",
    "No prepayment penalties"
  ];

  const eligibleUses = [
    "Working capital",
    "Equipment purchases", 
    "Real estate acquisition",
    "Business acquisition",
    "Debt refinancing",
    "Franchise financing",
    "Expansion and renovation",
    "Inventory purchases"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" 
          alt="Modern office building representing SBA loans"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/lovable-uploads/16fc85f5-bfa7-4605-ad8b-fc2cc3082870.png" 
                  alt="Official SBA Logo"
                  className="h-16 w-auto bg-white p-2 rounded-lg"
                />
                <Badge className="bg-white text-primary">Most Popular</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                SBA 7(a) Loans
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Our most popular and versatile SBA loan program, perfect for working capital, equipment purchases, and real estate acquisition with government backing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Apply for SBA 7(a)
                </Button>
                <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10">
                  Calculate Payments
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="SBA 7(a) loan consultation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $5 Million</h3>
                <p className="text-muted-foreground">Maximum loan amount</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to 25 Years</h3>
                <p className="text-muted-foreground">Maximum loan term</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">75-85%</h3>
                <p className="text-muted-foreground">SBA guarantee</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Loan Features & Benefits</h2>
              <div className="space-y-4">
                {loanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Eligible Uses</h2>
              <div className="space-y-4">
                {eligibleUses.map((use, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span>{use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualification Requirements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SBA 7(a) Qualification Requirements
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding the basic requirements helps ensure a smooth application process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Business Size</h3>
                <p className="text-sm text-muted-foreground">Must meet SBA size standards for your industry</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Credit Score</h3>
                <p className="text-sm text-muted-foreground">Personal credit score of 680+ preferred</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Time in Business</h3>
                <p className="text-sm text-muted-foreground">Minimum 2 years operating history</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <DollarSign className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Equity Injection</h3>
                <p className="text-sm text-muted-foreground">10-15% down payment required</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SBA 7(a) Application Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process makes getting your SBA 7(a) loan as simple as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Pre-qualification", description: "Complete our quick online application" },
              { step: "02", title: "Document Collection", description: "Gather required financial documents" },
              { step: "03", title: "SBA Review", description: "We submit to SBA for approval" },
              { step: "04", title: "Closing & Funding", description: "Sign documents and receive funds" }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-4">{item.step}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SBA 7(a) Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how businesses like yours have thrived with SBA 7(a) financing
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <img 
                  src={smallBusinessOwnerLaptop} 
                  alt="Small business owner reviewing loan documents"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-semibold">Digital Growth</h3>
                  <p className="text-sm">Tech startup secured $500K for expansion</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <img 
                  src={loanApprovalCelebration} 
                  alt="Business loan approval celebration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-semibold">Manufacturing Expansion</h3>
                  <p className="text-sm">Family business secured $1.2M for new facility</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-financial-navy to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply for Your SBA 7(a) Loan?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get started with our simple application process and let our SBA experts guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Speak with SBA Expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SBA7aLoansPage;