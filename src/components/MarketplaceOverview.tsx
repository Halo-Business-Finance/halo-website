import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  MapPin, 
  CheckCircle,
  Star,
  ArrowRight,
  Network,
  Clock,
  DollarSign,
  Handshake
} from "lucide-react";

const MarketplaceOverview = () => {
  const marketplaceStats = [
    {
      icon: Users,
      value: "150+",
      label: "Active Lenders",
      description: "Regional banks, credit unions, and specialty lenders"
    },
    {
      icon: MapPin,
      value: "50",
      label: "States Covered",
      description: "Nationwide lending network across all US markets"
    },
    {
      icon: DollarSign,
      value: "$2.5B+",
      label: "Loans Facilitated",
      description: "Total loan volume processed through our platform"
    },
    {
      icon: Clock,
      value: "24-48hr",
      label: "Initial Response",
      description: "Average time to receive initial lender feedback"
    }
  ];

  const lenderPartners = [
    {
      category: "Community Banks",
      count: "65+",
      description: "Local and regional banks with deep market knowledge",
      features: ["Relationship-focused lending", "Local decision making", "Flexible underwriting"]
    },
    {
      category: "Credit Unions",
      count: "40+", 
      description: "Member-owned financial cooperatives",
      features: ["Competitive rates", "Member benefits", "Community focus"]
    },
    {
      category: "Alternative Lenders",
      count: "35+",
      description: "Innovative fintech and specialty lenders",
      features: ["Fast approvals", "Flexible criteria", "Technology-driven"]
    },
    {
      category: "National Banks",
      count: "10+",
      description: "Major financial institutions with broad capabilities",
      features: ["Large loan capacity", "Full-service banking", "Established reputation"]
    }
  ];

  const marketplaceAdvantages = [
    {
      icon: Network,
      title: "Comprehensive Network",
      description: "Access to the most extensive network of commercial lenders in the industry, from community banks to major financial institutions."
    },
    {
      icon: TrendingUp,
      title: "Competitive Marketplace",
      description: "Lenders compete for your business, resulting in better rates, terms, and loan structures tailored to your needs."
    },
    {
      icon: Shield,
      title: "Vetted Partners Only",
      description: "All lenders undergo rigorous qualification processes including licensing verification, financial stability, and track record review."
    },
    {
      icon: Star,
      title: "Performance Monitoring",
      description: "Continuous monitoring of lender performance, customer satisfaction, and loan quality to maintain high standards."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">Nationwide Loan Marketplace</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Nation's Leading Commercial Loan Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Connect with 150+ verified lenders across all 50 states through our comprehensive marketplace platform. 
            From community banks to national institutions, find the perfect financing partner for your business needs.
          </p>
        </div>

        {/* Marketplace Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketplaceStats.map((stat, index) => (
            <Card key={index} className="text-center group">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
              We partner with a carefully curated selection of financial institutions, each bringing unique strengths and capabilities to serve your business financing needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {lenderPartners.map((partner, index) => (
              <Card key={index} className="">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{partner.category}</CardTitle>
                    <Badge variant="outline" className="text-primary border-primary">
                      {partner.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{partner.description}</p>
                  <div className="space-y-2">
                    {partner.features.map((feature, i) => (
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

        {/* Marketplace Advantages */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Our Marketplace Works</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform creates a win-win environment where borrowers get better access to capital and lenders connect with qualified opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketplaceAdvantages.map((advantage, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">{advantage.title}</h4>
                    <p className="text-muted-foreground">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Geographic Coverage */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Nationwide Coverage</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our marketplace spans all 50 states with regional expertise and local market knowledge. 
                Whether you're in a major metropolitan area or a small town, we have lenders who understand your market.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50</div>
                  <div className="text-sm text-muted-foreground">States Covered</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Handshake className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">2,500+</div>
                  <div className="text-sm text-muted-foreground">Cities Served</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-financial-navy/10 rounded-xl p-8">
              <h4 className="text-xl font-semibold mb-4">Regional Expertise</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Local market knowledge and relationships</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>State-specific lending regulations expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Regional industry specializations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Economic development program access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-financial-navy rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Experience the Marketplace Advantage</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have found their perfect lending partner through our marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary font-semibold">
              Start Your Application
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent">
              Learn About Our Lenders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceOverview;