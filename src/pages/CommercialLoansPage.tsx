import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Building2, TrendingUp, Clock, ArrowRight } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const CommercialLoansPage = () => {
  const commercialProducts = [
    {
      title: "Conventional Commercial Loans",
      description: "Traditional commercial financing for established businesses with strong credit profiles.",
      rate: "5.25%",
      amount: "Up to $25 Million",
      term: "Up to 25 Years",
      features: ["No government guarantee required", "Faster approval process", "Flexible terms", "Competitive rates"],
      link: "/conventional-loans",
      badge: "Fast Approval"
    },
    {
      title: "Commercial Real Estate Purchase",
      description: "Finance the acquisition of commercial properties for your business operations.",
      rate: "5.75%",
      amount: "Up to $50 Million",
      term: "Up to 30 Years",
      features: ["Owner-occupied properties", "Investment properties", "Low down payments", "Fixed and variable rates"],
      link: "/purchase-loans",
      badge: "Popular"
    },
    {
      title: "Commercial Refinance Loans",
      description: "Optimize your existing commercial property financing with better rates and terms.",
      rate: "5.50%",
      amount: "Up to $50 Million", 
      term: "Up to 30 Years",
      features: ["Lower interest rates", "Cash-out options", "Debt consolidation", "Improved cash flow"],
      link: "/refinance-loans",
      badge: "Save Money"
    },
    {
      title: "Construction Loans",
      description: "Fund your commercial development and construction projects from ground up.",
      rate: "Prime + 1%",
      amount: "Up to $100 Million",
      term: "12-36 Months",
      features: ["Interest-only payments", "Convert to permanent financing", "Progress draw system", "Experienced builders"],
      link: "/construction-loans",
      badge: "Build Your Future"
    }
  ];

  return (
    <>
      <SEO 
        title="Commercial Real Estate Loans | CRE Financing | Halo Business Finance"
        description="Commercial real estate loans for purchase, refinance, construction. Competitive rates, flexible terms up to 25 years. Owner-occupied and investment properties."
        keywords="commercial real estate loans, CRE financing, commercial property loans, commercial mortgage loans, investment property loans, commercial refinance, construction loans, commercial purchase loans"
        canonical="https://halobusinessfinance.com/commercial-loans"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44" 
          alt="Professional business handshake representing commercial loans"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Commercial Lending Solutions for Growth
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Comprehensive commercial financing options designed to fuel your business expansion, from traditional loans to specialized real estate financing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Consultation
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={businessGrowth} 
                alt="Commercial lending consultation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Loan Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Commercial Financing Portfolio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From conventional business loans to specialized commercial real estate financing, we have the right solution for your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {commercialProducts.map((product, index) => (
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
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
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
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Lending Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Commercial Lending?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We specialize in commercial financing with deep market knowledge and flexible solutions tailored to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Commercial Real Estate Expertise</h3>
                <p className="text-muted-foreground">
                  Deep understanding of commercial property markets and valuation for optimal financing solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Competitive Terms</h3>
                <p className="text-muted-foreground">
                  Access to competitive interest rates and flexible terms that work with your business cash flow.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Fast Processing</h3>
                <p className="text-muted-foreground">
                  Streamlined approval process with dedicated commercial lending specialists for faster decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src={loanConsultation} 
          alt="Commercial lending consultation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative bg-gradient-to-r from-financial-navy/90 to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Expand Your Business?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our commercial lending experts are ready to help you secure the financing you need for growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth">Start Your Application</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Speak with a Specialist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default CommercialLoansPage;