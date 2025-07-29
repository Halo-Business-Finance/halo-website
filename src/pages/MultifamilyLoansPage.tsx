import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Clock, 
  Calculator,
  CheckCircle,
  Home,
  Users,
  DollarSign,
  FileText,
  Phone
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";

const MultifamilyLoansPage = () => {
  const loanFeatures = [
    {
      icon: DollarSign,
      title: "Competitive Rates",
      description: "Access industry-leading rates starting from 5.25% for qualified borrowers with strong credit and property performance."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Streamlined underwriting process with decisions in 10-15 business days and funding in 30-45 days."
    },
    {
      icon: Building2,
      title: "Flexible Terms",
      description: "5-30 year terms with loan amounts from $1M to $100M+ for various multifamily property types."
    },
    {
      icon: Shield,
      title: "Experienced Team",
      description: "Our multifamily lending specialists have closed over $2B in apartment building financing nationwide."
    }
  ];

  const propertyTypes = [
    "Apartment Buildings (5+ units)",
    "Mixed-Use Properties",
    "Student Housing",
    "Senior Housing",
    "Affordable Housing",
    "Market-Rate Rentals",
    "Condominium Projects",
    "Townhome Communities"
  ];

  const loanPrograms = [
    {
      title: "Conventional Multifamily",
      description: "Traditional bank financing for stabilized properties",
      features: ["70-80% LTV", "25-30 year terms", "$1M-$50M+", "1.25+ DSCR"]
    },
    {
      title: "Agency Loans (Fannie/Freddie)",
      description: "Government-sponsored enterprise financing",
      features: ["Up to 80% LTV", "Fixed & floating rates", "$1M-$100M+", "Non-recourse available"]
    },
    {
      title: "HUD/FHA Multifamily",
      description: "Government-backed financing for affordable housing",
      features: ["Up to 87% LTV", "35-40 year terms", "Below-market rates", "Non-recourse"]
    },
    {
      title: "Bridge Financing",
      description: "Short-term financing for value-add opportunities",
      features: ["70-80% LTV", "12-36 months", "Interest-only", "Quick closing"]
    }
  ];

  const qualificationRequirements = [
    "Minimum 25% down payment (varies by program)",
    "Debt Service Coverage Ratio of 1.25x or higher",
    "Property must be stabilized (85%+ occupancy) for permanent financing",
    "Borrower net worth equal to loan amount",
    "Liquidity of 6-12 months of debt service",
    "Experience in multifamily property management"
  ];

  return (
    <>
      <SEO
        title="Multifamily Loans - Apartment Building Financing | Halo Business Finance"
        description="Secure competitive multifamily loans for apartment buildings, student housing, and rental properties. $1M-$100M+ financing with rates from 5.25%. Get pre-qualified today."
        keywords="multifamily loans, apartment building loans, rental property financing, student housing loans, multifamily mortgage, commercial real estate"
        canonical="https://halobusinessfinance.com/multifamily-loans"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs />
        
        <main>
          {/* Hero Section */}
          <section className="relative py-24 bg-gradient-to-br from-financial-navy via-financial-navy/95 to-primary/20">
            <div className="absolute inset-0 bg-[url('/src/assets/commercial-property-investment.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
                  <Building2 className="w-4 h-4 mr-2" />
                  Multifamily Lending Specialists
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Multifamily <span className="text-primary">Loan Solutions</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  Finance apartment buildings, student housing, and rental properties with competitive rates starting at 5.25%. 
                  $1M to $100M+ loans available nationwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/pre-qualification">Get Pre-Qualified</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                    <Link to="/contact-us">Speak with Specialist</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Multifamily Financing</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Partner with experienced multifamily lenders who understand the unique financing needs of apartment building investors.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loanFeatures.map((feature, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Loan Programs */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Multifamily Loan Programs</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choose from a variety of financing options tailored to different property types and investment strategies.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {loanPrograms.map((program, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">{program.title}</CardTitle>
                      <CardDescription className="text-base">{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {program.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Property Types */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Eligible Property Types</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    We finance a wide range of multifamily properties, from small apartment buildings to large residential complexes.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {propertyTypes.map((type, index) => (
                      <div key={index} className="flex items-center">
                        <Home className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
                  <div className="text-center">
                    <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Quick Rate Estimate</h3>
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium">Conventional Rates:</span>
                        <span className="text-primary font-bold">5.25% - 7.50%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Agency Rates:</span>
                        <span className="text-primary font-bold">4.75% - 6.75%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">HUD/FHA Rates:</span>
                        <span className="text-primary font-bold">4.50% - 6.25%</span>
                      </div>
                      <Separator />
                      <p className="text-xs text-muted-foreground">
                        *Rates vary based on credit, property type, and market conditions
                      </p>
                    </div>
                    <Button className="w-full mt-6" asChild>
                      <Link to="/loan-calculator">Calculate Payments</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Qualification Requirements */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Qualification Requirements</h2>
                  <p className="text-xl text-muted-foreground">
                    General guidelines for multifamily loan approval. Specific requirements may vary by program.
                  </p>
                </div>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-primary" />
                          Borrower Requirements
                        </h3>
                        <ul className="space-y-3">
                          {qualificationRequirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Building2 className="w-5 h-5 mr-2 text-primary" />
                          Financial Requirements
                        </h3>
                        <ul className="space-y-3">
                          {qualificationRequirements.slice(3).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Multifamily Lending Process</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Streamlined process designed specifically for multifamily property investors and developers.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Application", description: "Submit property details and financial information" },
                  { step: "2", title: "Underwriting", description: "Property appraisal and financial analysis" },
                  { step: "3", title: "Approval", description: "Credit decision and term sheet provided" },
                  { step: "4", title: "Closing", description: "Final documentation and funding" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Finance Your Multifamily Property?</h2>
              <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Get personalized loan terms and rates for your apartment building or rental property investment. 
                Our multifamily specialists are ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/pre-qualification">
                    <FileText className="w-4 h-4 mr-2" />
                    Start Application
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact-us">
                    <Phone className="w-4 h-4 mr-2" />
                    Call (555) 123-4567
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MultifamilyLoansPage;