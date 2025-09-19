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
      value: "$1.5B+",
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


  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">Nationwide Loan Marketplace</Badge>
          <h2 className="text-2xl md:text-5xl font-bold mb-6">
            The Nation's Leading Commercial Loan Marketplace
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-4xl mx-auto mb-8">
            Connect with 150+ verified lenders across all 50 states through our comprehensive marketplace platform. 
            From community banks to national institutions, find the perfect financing partner for your business needs.
          </p>
        </div>

        {/* Marketplace Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketplaceStats.map((stat, index) => (
            <Card key={index} className="text-center group">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <h4 className="text-lg font-semibold mb-2">{stat.label}</h4>
                <p className="text-sm text-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Geographic Coverage */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Nationwide Coverage</h3>
              <p className="text-lg text-foreground mb-6">
                Our marketplace spans all 50 states with regional expertise and local market knowledge. 
                Whether you're in a major metropolitan area or a small town, we have lenders who understand your market.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50</div>
                  <div className="text-sm text-foreground">States Covered</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Handshake className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">1,500+</div>
                  <div className="text-sm text-foreground">Cities Served</div>
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
        <div className="text-center bg-financial-navy rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Experience the Marketplace Advantage</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have found their perfect lending partner through our marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary font-semibold border-2 border-primary shadow-lg hover:bg-gray-50" asChild>
              <a href="https://app.halolending.com">
                Start Your Application
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
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