import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Target, Award, TrendingUp, Building2 } from "lucide-react";

const CompanyOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-financial-navy to-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Halo Business Finance
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Nationwide SBA, Commercial and Equipment Loan Marketplace
            </p>
            <p className="text-lg opacity-80">
              Our commercial loan marketplace offers a streamlined loan process without 
              the hassle of looking for the best interest rate or the right lender.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To simplify commercial lending by connecting businesses with the right 
                  lenders through our innovative marketplace platform, ensuring competitive 
                  rates and exceptional service.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To be the leading nationwide marketplace for commercial lending, 
                  empowering businesses to achieve their growth goals through accessible 
                  and efficient financing solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Streamlined Loan Process
            </h2>
            <p className="text-xl text-muted-foreground">
              We make commercial lending simple
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Select Your Loan Program", description: "Choose from our comprehensive range of loan products" },
              { step: "02", title: "Answer Questions", description: "Complete our simple application about your loan request" },
              { step: "03", title: "Get Pre-Approved", description: "Authorize a soft credit check for instant pre-approval" },
              { step: "04", title: "Upload Financials", description: "Submit your documents to receive competitive term sheets" },
              { step: "05", title: "Get Funded", description: "Sign your loan documents and receive your funding" }
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

      {/* Marketplace Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Marketplace Benefits
            </h2>
            <p className="text-xl text-muted-foreground">
              Our commercial loan marketplace helps borrowers get the best interest rate 
              without the hassle of looking for a lender.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Simple Loan Application",
                description: "Our loan application process is quick, easy and hassle-free"
              },
              {
                icon: TrendingUp,
                title: "Fast Approval Process",
                description: "Get approved quickly with our streamlined loan process"
              },
              {
                icon: Award,
                title: "Competitive Rates",
                description: "Get the most competitive interest rate in the market"
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Our loan specialists will guide you through the loan process"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Real Estate Focus */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Nationwide Commercial Real Estate Loans
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our commercial loan marketplace can help you find the best interest rate 
              without wasting time looking for a bank or lender.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-4">
                <CardContent className="p-0 text-center">
                  <h3 className="font-semibold mb-2">Purchase Loans</h3>
                  <p className="text-sm text-muted-foreground">Finance your commercial property acquisition</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0 text-center">
                  <h3 className="font-semibold mb-2">Refinance Loans</h3>
                  <p className="text-sm text-muted-foreground">Optimize your existing commercial property financing</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0 text-center">
                  <h3 className="font-semibold mb-2">Construction Loans</h3>
                  <p className="text-sm text-muted-foreground">Fund your commercial development projects</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyOverview;