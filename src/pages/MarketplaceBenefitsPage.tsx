import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PartnershipsSection from "@/components/PartnershipsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Network,
  CheckCircle,
  Target,
  Award,
  Globe,
  ArrowRight,
  Handshake,
  Landmark
} from "lucide-react";
import marketplaceBenefitsHeader from "@/assets/marketplace-benefits-header.jpg";
import fintechAnalysisTeam from "@/assets/fintech-analysis-team.jpg";
import marketplaceDashboard from "@/assets/marketplace-dashboard.jpg";
import marketplaceTeamSuccess from "@/assets/marketplace-team-success.jpg";
import networkingEvent from "@/assets/networking-event.jpg";

const MarketplaceBenefitsPage = () => {
  const lenderStats = [
    {
      icon: Building2,
      value: "150+",
      label: "Active Lenders",
      description: "Vetted financial institutions"
    },
    {
      icon: MapPin,
      value: "50",
      label: "States",
      description: "Complete nationwide coverage"
    },
    {
      icon: DollarSign,
      value: "$1.5B+",
      label: "Total Volume",
      description: "Loans facilitated since inception"
    },
    {
      icon: Clock,
      value: "24hr",
      label: "Response Time",
      description: "Average initial lender response"
    }
  ];

  const lenderTypes = [
    {
      type: "Community Banks",
      count: "65+",
      icon: Building2,
      features: [
        "Local market expertise",
        "Relationship-based lending",
        "Flexible underwriting",
        "Quick decision making"
      ],
      description: "Regional banks with deep community ties and local market knowledge"
    },
    {
      type: "Credit Unions",
      count: "40+",
      icon: Users,
      features: [
        "Member-focused approach",
        "Competitive rates",
        "Community investment",
        "Personalized service"
      ],
      description: "Member-owned cooperatives offering competitive terms and community focus"
    },
    {
      type: "Alternative Lenders",
      count: "35+",
      icon: Zap,
      features: [
        "Fast approvals",
        "Technology-driven",
        "Flexible criteria",
        "Innovative products"
      ],
      description: "Fintech companies and specialty lenders with modern lending approaches"
    },
    {
      type: "National Banks",
      count: "10+",
      icon: Globe,
      features: [
        "Large loan capacity",
        "Full banking services",
        "Established reputation",
        "Comprehensive solutions"
      ],
      description: "Major financial institutions with extensive resources and capabilities"
    }
  ];

  const platformBenefits = [
    {
      icon: Network,
      title: "Comprehensive Marketplace",
      description: "Access the most extensive network of verified commercial lenders in one platform",
      benefits: [
        "150+ active lenders across all categories",
        "Real-time lender availability updates",
        "Automated matching based on your profile",
        "Direct communication with decision makers"
      ]
    },
    {
      icon: Target,
      title: "Smart Matching Technology",
      description: "AI-powered system matches you with the most suitable lenders for your specific needs",
      benefits: [
        "Industry-specific lender recommendations",
        "Credit profile optimization",
        "Loan structure preferences",
        "Geographic proximity matching"
      ]
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Every lender undergoes rigorous vetting and continuous performance monitoring",
      benefits: [
        "License verification and compliance",
        "Financial stability assessment",
        "Customer satisfaction tracking",
        "Performance benchmarking"
      ]
    },
    {
      icon: Star,
      title: "Competitive Advantage",
      description: "Lenders compete for your business, resulting in better terms and faster decisions",
      benefits: [
        "Multiple competing offers",
        "Transparent rate comparison",
        "Negotiation leverage",
        "Best-in-market terms"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={marketplaceBenefitsHeader} 
          alt="Professional business marketplace team analyzing financial data and market trends in modern fintech office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Marketplace Advantage</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Marketplace Benefits</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover the advantages of using our commercial loan marketplace. Access multiple lenders, compare offers, and secure the best financing for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Marketplace Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Marketplace at a Glance</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The numbers behind America's most comprehensive commercial loan marketplace
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={fintechAnalysisTeam} 
                alt="Business professionals analyzing financial data and loan applications on digital screens"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {lenderStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <h4 className="text-lg font-semibold mb-2">{stat.label}</h4>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lender Categories */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Our Diverse Lender Network</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We partner with every type of commercial lender to ensure you have access to the full spectrum of financing options
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {lenderTypes.map((lender, index) => (
                <Card key={index} className="">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                          <lender.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{lender.type}</CardTitle>
                          <Badge variant="outline" className="text-primary border-primary mt-1">
                            {lender.count}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{lender.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {lender.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Benefits */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Platform Advantages</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Advanced technology and comprehensive network create unmatched value for borrowers and lenders
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {platformBenefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-3">{benefit.title}</h4>
                      <p className="text-muted-foreground mb-4">{benefit.description}</p>
                      <div className="space-y-2">
                        {benefit.benefits.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Landmark className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Multiple Lenders</h3>
                <p className="text-muted-foreground">Access our network of qualified lenders</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Better Rates</h3>
                <p className="text-muted-foreground">Competition drives better terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Faster Process</h3>
                <p className="text-muted-foreground">Streamlined application process</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">Professional guidance throughout</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={networkingEvent} 
                  alt="Professional fintech networking event with business professionals connecting"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">For Borrowers</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">One Application, Multiple Offers</h4>
                    <p className="text-muted-foreground">
                      Submit one application and receive offers from multiple qualified lenders. Save time and compare terms side-by-side.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Competitive Pricing</h4>
                    <p className="text-muted-foreground">
                      Lenders compete for your business, resulting in better rates and terms than you might find elsewhere.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">No Cost to You</h4>
                    <p className="text-muted-foreground">
                      Our marketplace service is free for borrowers. We're paid by lenders when loans close successfully.
                    </p>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Borrower Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Access to 50+ qualified lenders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Competitive rates and terms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Free marketplace service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Expert loan guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Streamlined application process</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Card>
                <CardHeader>
                  <CardTitle>Lender Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Access to qualified borrowers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Pre-screened applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Reduced acquisition costs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Streamlined origination</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Technology platform access</span>
                  </div>
                </CardContent>
              </Card>
              <div>
                <h2 className="text-3xl font-bold mb-6">For Lenders</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Quality Deal Flow</h4>
                    <p className="text-muted-foreground">
                      Access pre-screened, qualified borrowers looking for commercial financing solutions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Efficient Origination</h4>
                    <p className="text-muted-foreground">
                      Leverage our technology platform to streamline your loan origination process.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Competitive Advantage</h4>
                    <p className="text-muted-foreground">
                      Compete for quality deals while maintaining your underwriting standards and pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Coverage */}
          <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Complete Nationwide Coverage</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Our marketplace spans all 50 states with regional expertise and local market knowledge. 
                  From major metropolitan areas to rural communities, we connect you with lenders who understand your market.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">50</div>
                    <div className="text-sm text-muted-foreground">States Covered</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Handshake className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">1,500+</div>
                    <div className="text-sm text-muted-foreground">Cities Served</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-financial-navy/10 rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-4">Regional Benefits</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Local market expertise and relationships</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>State-specific lending regulations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Regional industry specializations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Economic development partnerships</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Community-focused lending programs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={marketplaceTeamSuccess} 
                alt="Professional diverse business team celebrating successful loan marketplace connections"
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-primary to-financial-navy rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Marketplace Advantage?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that have found their perfect lending partner through our comprehensive marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary font-semibold" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth">
                  Start Your Application
                  <ArrowRight className="h-5 w-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white">
                Become a Lender Partner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partnerships & Credentials Section */}
      <PartnershipsSection />

      <Footer />
    </div>
  );
};

export default MarketplaceBenefitsPage;