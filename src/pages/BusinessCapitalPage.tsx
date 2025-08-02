import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, CreditCard, TrendingUp, DollarSign, ArrowRight, PieChart, BarChart3, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import businessLoanApproved from "@/assets/business-loan-approved.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";
import officeWorkspace from "@/assets/office-workspace.jpg";
import { ProcessDiagram } from "@/components/charts/ProcessDiagram";

const BusinessCapitalPage = () => {
  const capitalProducts = [
    {
      title: "Working Capital Loans",
      description: "Short-term financing to bridge cash flow gaps and fund day-to-day operations.",
      rate: "Prime + 1%",
      amount: "Up to $2 Million",
      term: "3-24 Months",
      features: ["Quick approval", "Flexible repayment", "No collateral required", "Use for any business purpose"],
      link: "/working-capital",
      badge: "Fast Funding"
    },
    {
      title: "Business Line of Credit",
      description: "Revolving credit facility that provides flexible access to capital when you need it.",
      rate: "Prime + 2%",
      amount: "Up to $500,000",
      term: "Revolving",
      features: ["Draw as needed", "Pay interest only on used funds", "Revolving credit", "Build business credit"],
      link: "/business-line-of-credit",
      badge: "Flexible Access"
    },
    {
      title: "Term Loans",
      description: "Fixed-rate business loans for major investments and long-term growth initiatives.",
      rate: "5.75%",
      amount: "Up to $10 Million",
      term: "1-10 Years",
      features: ["Fixed monthly payments", "Competitive rates", "Quick approval", "Multiple use cases"],
      link: "/term-loans",
      badge: "Popular"
    },
    {
      title: "Factoring-Based Financing",
      description: "Alternative financing based on your business revenue with flexible repayment.",
      rate: "Factor Rate 1.2-1.5",
      amount: "Up to $500,000",
      term: "3-18 Months",
      features: ["No fixed payments", "Based on revenue", "Quick funding", "No personal guarantees"],
      link: "/factoring-based-financing",
      badge: "Alternative"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
          alt="Business finance charts representing business capital"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Business Capital Solutions for Every Need
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access the working capital your business needs to grow, manage cash flow, and seize opportunities with our flexible financing solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Capital Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Consultation
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={businessLoanApproved} 
                alt="Business capital approval celebration"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Capital Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Flexible Capital Solutions
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              From working capital to lines of credit, we offer the right financing solution to support your business operations and growth.
            </p>
          </div>

          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {capitalProducts.map((product, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2">
                  <Card className="hover:shadow-lg transition-shadow relative h-full">
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-primary text-white">
                        {product.badge}
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl mb-4">{product.title}</CardTitle>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{product.rate}</div>
                          <div className="text-sm text-foreground">Rate/Factor</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{product.amount}</div>
                          <div className="text-sm text-foreground">Amount</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{product.term}</div>
                          <div className="text-sm text-foreground">Terms</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-6">{product.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        {product.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full group" asChild>
                        <Link to={product.link}>
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Working Capital Uses */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              What Can You Use Business Capital For?
            </h3>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Our business capital solutions can be used for a wide variety of business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Inventory Purchase",
              "Payroll & Benefits", 
              "Marketing Campaigns",
              "Equipment Repairs",
              "Seasonal Cash Flow",
              "Business Expansion",
              "Technology Upgrades",
              "Emergency Expenses"
            ].map((use, index) => (
              <Card key={index} className="text-center p-4">
                <CardContent className="p-0">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{use}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Business Capital Solutions?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Fast Access</h3>
                <p className="text-muted-foreground">
                  Quick approval and funding to meet urgent business capital needs and opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Flexible Repayment</h3>
                <p className="text-muted-foreground">
                  Repayment options that work with your business cash flow and seasonal variations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Build Credit</h3>
                <p className="text-muted-foreground">
                  Establish and improve your business credit profile with responsible capital management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Capital Usage Analytics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Capital Management
            </h3>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              See how businesses successfully utilize our capital solutions and streamlined processes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <ProcessDiagram />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img 
                  src={officeWorkspace} 
                  alt="Modern business workspace"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Flexible Capital Access</h3>
                  <p className="text-muted-foreground">Multiple funding options including revolving credit lines, term loans, and revenue-based financing to match your cash flow needs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <img 
                  src={businessLoanApproved} 
                  alt="Business loan approval celebration"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fast Decision Making</h3>
                  <p className="text-muted-foreground">Quick approvals and funding to help you seize time-sensitive opportunities and manage unexpected expenses.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <Card className="text-center p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary mb-1">86%</div>
                    <div className="text-sm text-muted-foreground">Working Capital Approval</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary mb-1">24hrs</div>
                    <div className="text-sm text-muted-foreground">Average Response</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capital Solutions with Enhanced Icons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Strategic Capital Solutions
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fast Access</h3>
                <p className="text-sm text-muted-foreground">Quick approval and funding for urgent business needs</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Flexible Terms</h3>
                <p className="text-sm text-muted-foreground">Repayment options that work with your cash flow</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Build Credit</h3>
                <p className="text-sm text-muted-foreground">Establish and improve business credit profile</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Growth Support</h3>
                <p className="text-sm text-muted-foreground">Capital to scale operations and seize opportunities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src={loanConsultation} 
          alt="Business capital consultation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative bg-gradient-to-r from-financial-navy/90 to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Need Capital for Your Business?
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our business capital specialists are ready to help you find the right financing solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Capital Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Speak with Specialist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessCapitalPage;