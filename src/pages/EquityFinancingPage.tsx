import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, CheckCircle2, Users, Rocket, Target, Handshake, BarChart3, Lightbulb } from "lucide-react";

const EquityFinancingPage = () => {
  const equityTypes = [
    {
      title: "Venture Capital",
      description: "Growth capital for high-potential startups and scale-ups from institutional investors.",
      ideal: "High-growth tech & innovation companies",
      stage: "Seed to Series D+"
    },
    {
      title: "Private Equity",
      description: "Strategic capital for established businesses seeking expansion, buyouts, or restructuring.",
      ideal: "Established businesses with $10M+ revenue",
      stage: "Growth & Mature"
    },
    {
      title: "Angel Investment",
      description: "Early-stage capital from individual investors who provide funding and mentorship.",
      ideal: "Early-stage startups with MVP",
      stage: "Pre-seed to Seed"
    },
    {
      title: "Strategic Investment",
      description: "Corporate investment from industry players seeking strategic partnerships and synergies.",
      ideal: "Companies with strategic value",
      stage: "All Stages"
    }
  ];

  const benefits = [
    { icon: Rocket, title: "No Debt Burden", description: "No monthly payments or interest charges to drain your cash flow" },
    { icon: Users, title: "Strategic Partners", description: "Gain access to expertise, networks, and industry connections" },
    { icon: Target, title: "Aligned Interests", description: "Investors share your goal of growing company value" },
    { icon: Handshake, title: "Shared Risk", description: "Partners share both the upside potential and downside risk" },
    { icon: BarChart3, title: "Accelerated Growth", description: "Access significant capital to scale operations rapidly" },
    { icon: Lightbulb, title: "Expert Guidance", description: "Benefit from investor experience and strategic insights" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Equity Financing | Venture Capital & Private Equity | Halo Business Finance"
        description="Raise capital through equity financing including venture capital, private equity, and angel investment. Strategic partnerships for business growth."
        keywords="equity financing, venture capital, private equity, angel investors, startup funding, growth capital, investment"
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
                  <TrendingUp className="h-4 w-4" />
                  Growth Capital
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Equity <span className="text-primary">Financing</span> Solutions
                </h1>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Partner with investors who believe in your vision. Equity financing provides growth capital 
                  without debt obligations, bringing strategic value beyond just capital.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold" asChild>
                    <Link to="/contact-us">
                      Connect with Investors
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link to="/private-placement">Private Placement</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">500+</div>
                      <div className="text-white/70 text-sm">Investor Network</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">$500M+</div>
                      <div className="text-white/70 text-sm">Capital Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">150+</div>
                      <div className="text-white/70 text-sm">Deals Closed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">85%</div>
                      <div className="text-white/70 text-sm">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equity Types */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Types of Equity Financing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From seed funding to growth equity, we connect you with the right investors for your stage and goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {equityTypes.map((type) => (
                <Card key={type.title} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ideal for: </span>
                        <span className="font-medium text-foreground">{type.ideal}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stage: </span>
                        <span className="font-medium text-foreground">{type.stage}</span>
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
                Benefits of Equity Financing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Equity partnerships bring more than capital—they bring expertise, connections, and shared vision.
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
              Ready to Raise Equity Capital?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Let us connect you with investors who align with your vision and growth objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/contact-us">
                  Schedule Investor Meeting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/debt-and-equity">Explore All Options</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EquityFinancingPage;
