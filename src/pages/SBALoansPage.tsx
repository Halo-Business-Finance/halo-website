import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, DollarSign, Clock, Users, ArrowRight, Shield, TrendingUp, FileCheck } from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import businessMeeting from "@/assets/business-meeting.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import { LoanApprovalChart } from "@/components/charts/LoanApprovalChart";
import { ProcessDiagram } from "@/components/charts/ProcessDiagram";

const SBALoansPage = () => {
  const sbaProducts = [
    {
      title: "SBA 7(a) Loans",
      description: "Our most popular and versatile SBA loan program for working capital, equipment, and real estate.",
      rate: "Prime + 2.75%",
      amount: "Up to $5 Million",
      term: "Up to 25 Years",
      features: ["85% SBA guarantee", "Competitive rates", "Flexible use of funds", "Long-term financing"],
      link: "/sba-7a-loans",
      badge: "Most Popular"
    },
    {
      title: "SBA 504 Loans",
      description: "Fixed-rate financing for real estate and major equipment purchases with low down payments.",
      rate: "Fixed Rate",
      amount: "Up to $5.5 Million",
      term: "10-20 Years",
      features: ["10% down payment", "Fixed interest rates", "Real estate focus", "Long-term stability"],
      link: "/sba-504-loans",
      badge: "Best for Real Estate"
    },
    {
      title: "SBA Express Loans",
      description: "Fast-track SBA financing with expedited approval for urgent business needs.",
      rate: "Prime + 4.5%",
      amount: "Up to $500,000",
      term: "Up to 10 Years",
      features: ["36-hour approval", "Streamlined process", "Quick funding", "Revolving credit available"],
      link: "/sba-express-loans",
      badge: "Fast Approval"
    },
    {
      title: "SBA Microloans",
      description: "Small business loans perfect for startups and businesses needing smaller amounts.",
      rate: "8% - 13%",
      amount: "Up to $50,000",
      term: "Up to 6 Years",
      features: ["Small loan amounts", "Technical assistance", "Startup friendly", "Flexible requirements"],
      link: "/sba-microloans",
      badge: "Startup Friendly"
    }
  ];

  return (
    <>
      <SEO 
        title="SBA Loans | 7(a), 504, Express & Microloans | Halo Business Finance"
        description="SBA Preferred Lender offering SBA 7(a) loans up to $5M, SBA 504 loans, Express loans, and microloans. Fast approval, competitive rates, expert guidance."
        keywords="SBA loans, SBA 7a loans, SBA 504 loans, SBA express loans, SBA microloans, SBA preferred lender, small business administration loans, government backed loans, business financing, commercial loans"
        canonical="https://halobusinessfinance.com/sba-loans"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" 
          alt="Business meeting representing SBA loans"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={sbaLogo} 
                  alt="SBA Preferred Lender"
                  className="h-16 w-auto"
                />
                <Badge className="bg-white text-primary">SBA Preferred Lender</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                SBA Loan Solutions for Every Business Need
              </h1>
              <p className="text-xl mb-8 opacity-90">
                As an SBA Preferred Lender, we offer the full range of SBA loan programs with faster processing, competitive rates, and expert guidance from application to funding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Pre-Qualified
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Consultation
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="SBA loan consultation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SBA Loan Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete SBA Loan Portfolio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive selection of SBA-backed financing solutions, each designed to meet specific business needs with government guarantees and competitive terms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sbaProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
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
                      <div className="text-sm text-muted-foreground">Starting Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{product.amount}</div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{product.term}</div>
                      <div className="text-sm text-muted-foreground">Loan Term</div>
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
                      Learn More About {product.title}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SBA Advantages */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SBA Loans?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SBA loans offer unique advantages backed by the U.S. Small Business Administration, making them an ideal choice for growing businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lower Down Payments</h3>
                <p className="text-muted-foreground">
                  SBA loans typically require lower down payments compared to conventional loans, preserving your working capital.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Longer Repayment Terms</h3>
                <p className="text-muted-foreground">
                  Extended repayment periods reduce monthly payments and improve cash flow for your business operations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Government Backing</h3>
                <p className="text-muted-foreground">
                  SBA guarantee reduces lender risk, making approval more likely even for businesses with limited collateral.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SBA Lending Process & Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our SBA Lending Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See our proven track record and streamlined process for SBA loan approvals.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <LoanApprovalChart />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img 
                  src={businessMeeting} 
                  alt="SBA loan meeting"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Expert SBA Guidance</h3>
                  <p className="text-muted-foreground">Our SBA specialists guide you through every step of the process, ensuring optimal loan structure and terms.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <img 
                  src={businessGrowth} 
                  alt="Business growth success"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">Over 15,000 businesses funded with $2.5B+ in SBA loans, helping companies achieve their growth goals.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <Card className="text-center p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary mb-1">92%</div>
                    <div className="text-sm text-muted-foreground">SBA Approval Rate</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary mb-1">5 Days</div>
                    <div className="text-sm text-muted-foreground">Avg. SBA Processing</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <ProcessDiagram />
        </div>
      </section>

      {/* SBA Benefits with Icons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SBA Loan Benefits & Requirements
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Government Backing</h3>
                <p className="text-sm text-muted-foreground">85% SBA guarantee reduces lender risk</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lower Down Payment</h3>
                <p className="text-sm text-muted-foreground">As low as 10% down payment required</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Extended Terms</h3>
                <p className="text-sm text-muted-foreground">Up to 25 years for real estate loans</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <FileCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Flexible Use</h3>
                <p className="text-sm text-muted-foreground">Working capital, equipment, real estate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-financial-navy to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply for Your SBA Loan?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our SBA lending experts are ready to help you find the perfect loan program for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start Your Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Speak with an Expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default SBALoansPage;