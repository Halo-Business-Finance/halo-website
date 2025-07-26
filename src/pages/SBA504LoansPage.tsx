import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, Clock, Shield, Building2, TrendingUp } from "lucide-react";
import sbaLogo from "@/assets/sba-logo.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const SBA504LoansPage = () => {
  const loanFeatures = [
    "Up to $5.5 million in financing",
    "Fixed interest rates for 10 or 20 years", 
    "Only 10% down payment required",
    "90% financing available",
    "SBA guarantees 40% of the loan",
    "Bank provides 50% conventional financing",
    "Borrower contributes 10% equity",
    "No prepayment penalties"
  ];

  const eligibleUses = [
    "Real estate acquisition",
    "New construction", 
    "Renovation and improvements",
    "Long-term machinery and equipment",
    "Owner-occupied commercial properties",
    "Manufacturing facilities",
    "Warehouses and distribution centers",
    "Office buildings"
  ];

  const propertyTypes = [
    "Office Buildings",
    "Retail Centers",
    "Warehouses", 
    "Manufacturing Facilities",
    "Mixed-Use Properties",
    "Hotels & Motels",
    "Gas Stations",
    "Car Washes"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" 
          alt="Business meeting representing SBA 504 loans"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={sbaLogo} 
                  alt="SBA 504 Loans"
                  className="h-16 w-auto"
                />
                <Badge className="bg-white text-primary">Fixed Rate</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                SBA 504 Loans
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Long-term, fixed-rate financing for commercial real estate and major equipment purchases with low down payments and competitive terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Apply for SBA 504
                </Button>
                <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10">
                  Calculate Payments
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="SBA 504 loan consultation"
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
                <h3 className="text-2xl font-bold mb-2">Up to $5.5 Million</h3>
                <p className="text-muted-foreground">Maximum project amount</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">10-20 Years</h3>
                <p className="text-muted-foreground">Fixed rate terms</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">10% Down</h3>
                <p className="text-muted-foreground">Low equity injection</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">SBA 504 Loan Features</h2>
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

      {/* How SBA 504 Works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SBA 504 Financing Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SBA 504 loans use a unique three-part financing structure that provides favorable terms and low down payments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-4">50%</div>
                <h3 className="text-xl font-semibold mb-3">Bank Loan</h3>
                <p className="text-muted-foreground">
                  A conventional bank loan covers 50% of the project cost with competitive market rates.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-4">40%</div>
                <h3 className="text-xl font-semibold mb-3">SBA Debenture</h3>
                <p className="text-muted-foreground">
                  SBA provides 40% through a fixed-rate debenture with below-market rates.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-4">10%</div>
                <h3 className="text-xl font-semibold mb-3">Down Payment</h3>
                <p className="text-muted-foreground">
                  Borrower contributes only 10% equity, making real estate more accessible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Eligible Property Types
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SBA 504 loans can be used for a wide variety of commercial real estate properties.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm">{type}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Qualification Requirements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SBA 504 Qualification Requirements
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding the requirements helps ensure your project qualifies for SBA 504 financing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Business Size</h3>
                <p className="text-sm text-muted-foreground">Must meet SBA size standards and have a tangible net worth under $15 million</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <Building2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Owner Occupancy</h3>
                <p className="text-sm text-muted-foreground">Must occupy at least 51% of the property for existing buildings</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Job Creation</h3>
                <p className="text-sm text-muted-foreground">Must create or retain 1 job per $75,000 of SBA financing</p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <DollarSign className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Equity Injection</h3>
                <p className="text-sm text-muted-foreground">10% equity required from business owner</p>
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
              SBA 504 Application Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced team guides you through every step of the SBA 504 process.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Pre-qualification", description: "Initial review of your project and qualifications" },
              { step: "02", title: "Documentation", description: "Gather required business and project documentation" },
              { step: "03", title: "SBA & Bank Approval", description: "Simultaneous review by SBA and bank partner" },
              { step: "04", title: "Closing & Funding", description: "Close both loans and receive project funding" }
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-financial-navy to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Finance Your Commercial Real Estate?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Take advantage of SBA 504's fixed rates and low down payment to acquire your commercial property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start Your SBA 504 Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Speak with SBA 504 Expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SBA504LoansPage;