import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, CheckCircle2, Building, Percent, Calendar, Shield, TrendingUp, FileText } from "lucide-react";

const DebtFinancingPage = () => {
  const debtProducts = [
    {
      title: "Term Loans",
      description: "Fixed-rate loans with predictable monthly payments for equipment, real estate, or working capital.",
      amount: "$100K - $25M",
      term: "1-25 years"
    },
    {
      title: "Lines of Credit",
      description: "Revolving credit facilities providing flexible access to capital as needed.",
      amount: "$50K - $10M",
      term: "Revolving"
    },
    {
      title: "SBA Loans",
      description: "Government-backed loans with competitive rates and longer terms for qualified businesses.",
      amount: "$50K - $5M",
      term: "10-25 years"
    },
    {
      title: "Asset-Based Lending",
      description: "Loans secured by receivables, inventory, or equipment for enhanced borrowing capacity.",
      amount: "$500K - $50M",
      term: "1-5 years"
    }
  ];

  const benefits = [
    { icon: Shield, title: "Retain Ownership", description: "Keep full control of your company while accessing growth capital" },
    { icon: Percent, title: "Tax Advantages", description: "Interest payments are typically tax-deductible business expenses" },
    { icon: Calendar, title: "Predictable Payments", description: "Fixed payment schedules make financial planning straightforward" },
    { icon: TrendingUp, title: "Build Credit", description: "Establish and strengthen your business credit profile" },
    { icon: FileText, title: "Clear Terms", description: "Transparent agreements with defined repayment expectations" },
    { icon: Building, title: "Asset Leverage", description: "Use business assets to secure better rates and terms" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Debt Financing Solutions | Business Loans & Credit | Halo Business Finance"
        description="Access debt financing options including term loans, lines of credit, SBA loans, and asset-based lending. Competitive rates and flexible terms for business growth."
        keywords="debt financing, business loans, term loans, line of credit, SBA loans, asset-based lending, commercial lending"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0a1628] via-[#112845] to-[#0d1f35] py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <DollarSign className="h-4 w-4" />
                  Traditional Financing
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Debt <span className="text-primary">Financing</span> Solutions
                </h1>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Access the capital you need while maintaining full ownership of your business. 
                  Our debt financing options offer competitive rates, flexible terms, and predictable payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold" asChild>
                    <Link to="/loan-calculator">
                      Calculate Your Loan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link to="/contact-us">Get Expert Advice</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">$2B+</div>
                      <div className="text-white/70 text-sm">Loans Funded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
                      <div className="text-white/70 text-sm">Businesses Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">24hrs</div>
                      <div className="text-white/70 text-sm">Quick Approvals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">4.8%</div>
                      <div className="text-white/70 text-sm">Rates From</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Debt Products */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Debt Financing Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From short-term working capital to long-term real estate financing, we have solutions for every need.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {debtProducts.map((product) => (
                <Card key={product.title} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount: </span>
                        <span className="font-semibold text-foreground">{product.amount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Term: </span>
                        <span className="font-semibold text-foreground">{product.term}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Why Choose Debt Financing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Debt financing offers unique advantages for businesses seeking to grow without diluting ownership.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-background p-6 rounded-xl border border-border/50">
                  <benefit.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Started with Debt Financing
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Apply today and receive a decision within 24-48 hours. Our team is ready to help you find the right solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/loan-calculator">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/contact-us">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DebtFinancingPage;
