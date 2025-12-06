import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, CheckCircle2, Layers, DollarSign, TrendingUp, Shield, Zap, Scale } from "lucide-react";

const MezzanineFinancingPage = () => {
  const useCases = [
    {
      title: "Acquisitions & Buyouts",
      description: "Bridge the gap between senior debt and equity in M&A transactions and management buyouts.",
      icon: Building2
    },
    {
      title: "Growth Capital",
      description: "Fund expansion initiatives without diluting significant ownership or adding senior debt.",
      icon: TrendingUp
    },
    {
      title: "Recapitalization",
      description: "Restructure your capital stack to optimize cost of capital and extend runway.",
      icon: Layers
    },
    {
      title: "Real Estate Development",
      description: "Fill financing gaps in commercial real estate projects and development deals.",
      icon: DollarSign
    }
  ];

  const features = [
    { icon: Layers, title: "Subordinated Debt", description: "Sits between senior debt and equity in the capital structure" },
    { icon: TrendingUp, title: "Equity Kicker", description: "Often includes warrants or conversion rights for upside participation" },
    { icon: Shield, title: "Flexible Terms", description: "Customizable structures to match your specific transaction needs" },
    { icon: Zap, title: "Speed to Close", description: "Faster execution than traditional equity fundraising processes" },
    { icon: Scale, title: "Higher Leverage", description: "Achieve greater total leverage than senior debt alone allows" },
    { icon: DollarSign, title: "Preserved Ownership", description: "Minimize equity dilution compared to pure equity raises" }
  ];

  const terms = [
    { label: "Loan Amounts", value: "$2M - $100M+" },
    { label: "Interest Rates", value: "12% - 20%" },
    { label: "Terms", value: "3 - 7 years" },
    { label: "Structure", value: "Interest-only with bullet" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Mezzanine Financing | Subordinated Debt Solutions | Halo Business Finance"
        description="Access mezzanine financing for acquisitions, growth capital, and recapitalization. Flexible subordinated debt solutions with equity features."
        keywords="mezzanine financing, subordinated debt, growth capital, acquisition financing, buyout financing, junior debt"
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
                  <Layers className="h-4 w-4" />
                  Hybrid Financing
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Mezzanine <span className="text-primary">Financing</span>
                </h1>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Bridge the gap between senior debt and equity with flexible mezzanine capital. 
                  Ideal for acquisitions, growth initiatives, and complex capital structures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold" asChild>
                    <Link to="/contact-us">
                      Discuss Your Deal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link to="/debt-and-equity">All Financing Options</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-white font-semibold mb-6 text-lg">Typical Terms</h3>
                  <div className="space-y-4">
                    {terms.map((term) => (
                      <div key={term.label} className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="text-white/70">{term.label}</span>
                        <span className="text-white font-semibold">{term.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Common Use Cases
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mezzanine financing is versatile capital that serves many strategic purposes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <useCase.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Key Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mezzanine debt combines the best aspects of debt and equity financing.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="bg-background p-6 rounded-xl border border-border/50">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore Mezzanine Financing
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Our team specializes in structuring mezzanine transactions that work for your specific situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/contact-us">
                  Start a Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/private-placement">Private Placement</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MezzanineFinancingPage;
