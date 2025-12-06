import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Briefcase, CheckCircle2, Lock, Clock, FileText, Users, Shield, DollarSign, BarChart3 } from "lucide-react";

const PrivatePlacementPage = () => {
  const offeringTypes = [
    {
      title: "Regulation D Offerings",
      description: "The most common exemption for private placements, including 506(b) and 506(c) offerings to accredited investors.",
      investors: "Accredited Investors",
      limit: "No Maximum"
    },
    {
      title: "Regulation A+ Offerings",
      description: "Mini-IPO structure allowing offerings up to $75M with reduced regulatory requirements.",
      investors: "All Investors",
      limit: "Up to $75M"
    },
    {
      title: "Regulation CF (Crowdfunding)",
      description: "Equity crowdfunding for startups and small businesses through registered platforms.",
      investors: "All Investors",
      limit: "Up to $5M"
    },
    {
      title: "144A Placements",
      description: "Institutional offerings to qualified institutional buyers for larger capital raises.",
      investors: "QIBs Only",
      limit: "No Maximum"
    }
  ];

  const benefits = [
    { icon: Clock, title: "Faster Execution", description: "Complete offerings in weeks rather than months required for public offerings" },
    { icon: DollarSign, title: "Lower Costs", description: "Significantly reduced legal, accounting, and regulatory compliance costs" },
    { icon: Lock, title: "Confidentiality", description: "Keep your business details and financials confidential from competitors" },
    { icon: FileText, title: "Flexible Terms", description: "Negotiate directly with investors to structure optimal deal terms" },
    { icon: Users, title: "Select Investors", description: "Choose investors who bring strategic value beyond capital" },
    { icon: Shield, title: "Less Regulation", description: "Avoid ongoing public company reporting and compliance requirements" }
  ];

  const process = [
    { step: "1", title: "Structure & Planning", description: "Determine offering type, terms, and target investors" },
    { step: "2", title: "Documentation", description: "Prepare PPM, subscription agreements, and legal documents" },
    { step: "3", title: "Investor Outreach", description: "Identify and approach qualified potential investors" },
    { step: "4", title: "Due Diligence", description: "Provide information and answer investor questions" },
    { step: "5", title: "Closing", description: "Execute agreements and receive funding" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Private Placement | Securities Offerings | Halo Business Finance"
        description="Raise capital through private placements including Reg D, Reg A+, and 144A offerings. Efficient securities offerings for qualified investors."
        keywords="private placement, Regulation D, Reg A+, securities offering, accredited investors, capital raising, PPM"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0a1628] via-[#112845] to-[#0d1f35] py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="h-4 w-4" />
                Securities Offerings
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Private <span className="text-primary">Placement</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed">
                Raise capital efficiently through private securities offerings. Access qualified investors 
                without the cost and complexity of public registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8" asChild>
                  <Link to="/contact-us">
                    Start Your Offering
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/equity-financing">Equity Options</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Offering Types */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Private Placement Exemptions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the right exemption structure based on your capital needs and investor base.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {offeringTypes.map((type) => (
                <Card key={type.title} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="flex justify-between text-sm border-t border-border/50 pt-4">
                      <div>
                        <span className="text-muted-foreground">Investors: </span>
                        <span className="font-semibold text-foreground">{type.investors}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Limit: </span>
                        <span className="font-semibold text-foreground">{type.limit}</span>
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
                Why Private Placement?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Private offerings provide significant advantages over public capital raising.
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

        {/* Process */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                The Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We guide you through every step of your private placement offering.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {process.map((item, index) => (
                <div key={item.step} className="flex-1 relative">
                  <div className="bg-muted/50 p-6 rounded-xl border border-border/50 h-full">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Raise Capital?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Our team has extensive experience structuring and executing private placements across industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/contact-us">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/debt-and-equity">All Options</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivatePlacementPage;
