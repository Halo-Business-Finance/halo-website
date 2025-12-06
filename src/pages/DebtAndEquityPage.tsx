import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, DollarSign, TrendingUp, Building2, Briefcase, CheckCircle2, Shield } from "lucide-react";

const DebtAndEquityPage = () => {
  const financingOptions = [
    {
      title: "Debt Financing",
      description: "Traditional loans and credit facilities with fixed repayment terms. Maintain full ownership while accessing capital for growth.",
      href: "/debt-financing",
      icon: DollarSign,
      features: ["Fixed interest rates", "Predictable payments", "Tax-deductible interest", "Retain ownership"]
    },
    {
      title: "Equity Financing",
      description: "Raise capital by selling ownership stakes. Ideal for high-growth companies seeking strategic partners.",
      href: "/equity-financing",
      icon: TrendingUp,
      features: ["No repayment obligation", "Strategic partnerships", "Shared risk", "Access to expertise"]
    },
    {
      title: "Mezzanine Financing",
      description: "Hybrid financing combining debt and equity features. Flexible capital for acquisitions and expansion.",
      href: "/mezzanine-financing",
      icon: Building2,
      features: ["Subordinated debt", "Equity conversion", "Flexible terms", "Higher leverage"]
    },
    {
      title: "Private Placement",
      description: "Direct securities offerings to qualified investors. Efficient capital raising without public registration.",
      href: "/private-placement",
      icon: Briefcase,
      features: ["Faster execution", "Lower costs", "Flexible structure", "Confidential process"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Debt & Equity Financing Solutions | Halo Business Finance"
        description="Explore comprehensive debt and equity financing options including mezzanine financing and private placements. Tailored capital solutions for business growth."
        keywords="debt financing, equity financing, mezzanine financing, private placement, business capital, investment banking"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0a1628] via-[#112845] to-[#0d1f35] py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Capital Structure Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Debt & Equity <span className="text-primary">Financing</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed">
                Optimize your capital structure with tailored financing solutions. From traditional debt to equity partnerships, 
                we help you find the right mix for sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8" asChild>
                  <Link to="/loan-calculator">
                    Explore Options
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/contact-us">Speak to an Advisor</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Financing Options Grid */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Comprehensive Financing Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the right capital structure for your business needs and growth objectives.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {financingOptions.map((option) => (
                <Card key={option.title} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <option.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                        <CardDescription className="text-base">{option.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors" asChild>
                      <Link to={option.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Optimize Your Capital Structure?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Our financial advisors will help you determine the right mix of debt and equity for your business goals.
            </p>
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/contact-us">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DebtAndEquityPage;
