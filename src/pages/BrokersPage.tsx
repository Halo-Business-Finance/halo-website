import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MarketplaceOverview from "@/components/MarketplaceOverview";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";

const BrokersPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Commissions",
      description: "Earn industry-leading commissions on funded loans with transparent fee structures."
    },
    {
      icon: TrendingUp,
      title: "Multiple Loan Products",
      description: "Access to SBA loans, commercial real estate, equipment financing, and working capital."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Personal broker support team to help you close more deals faster."
    },
    {
      icon: Award,
      title: "Marketing Resources",
      description: "Professional marketing materials and co-branded resources to grow your business."
    }
  ];

  const features = [
    "Access to 50+ lenders in our network",
    "Real-time loan status tracking",
    "Streamlined application process",
    "Fast pre-approval decisions",
    "Dedicated broker portal",
    "Training and certification programs",
    "Monthly performance reports",
    "Priority customer support"
  ];

  const commissionStructure = [
    { range: "$0 - $250K", rate: "1.5%" },
    { range: "$250K - $500K", rate: "2.0%" },
    { range: "$500K - $1M", rate: "2.5%" },
    { range: "$1M+", rate: "3.0%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0" 
          alt="Industrial warehouse representing broker services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 text-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Partner With Halo Business Finance
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our network of successful brokers and grow your business with access to competitive loan products, superior support, and industry-leading commissions.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-primary font-semibold">
                Apply to Become a Broker
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as a commercial loan broker.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Commission Structure
              </h3>
              <p className="text-lg md:text-xl text-foreground">
                Transparent and competitive commission rates based on loan volume.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {commissionStructure.map((tier, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{tier.range}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{tier.rate}</div>
                    <p className="text-sm text-foreground">Commission Rate</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 border border-primary/20 rounded-lg">
              <h4 className="text-lg font-semibold text-foreground mb-2">Additional Bonuses</h4>
              <ul className="space-y-1 text-foreground">
                <li>• Volume bonuses for top performers</li>
                <li>• Quarterly incentive programs</li>
                <li>• Referral bonuses for new broker partners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                What You Get as a Partner
              </h3>
              <p className="text-lg md:text-xl text-foreground">
                Comprehensive support and resources to maximize your success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Overview Section */}
      <MarketplaceOverview />

      {/* Contact Section */}
      <section className="py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Contact our broker partnership team to learn more about joining our network.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4 text-white" />
                  <h4 className="text-lg font-semibold mb-2">Call Us</h4>
                  <p className="text-blue-100">(800) 730-8461</p>
                  <p className="text-sm text-blue-200">Broker Partnership Line</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4 text-white" />
                  <h4 className="text-lg font-semibold mb-2">Email Us</h4>
                  <p className="text-blue-100">brokers@halobusinessfinance.com</p>
                  <p className="text-sm text-blue-200">Partnership Inquiries</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="bg-white text-primary font-semibold" asChild>
              <a href="https://preview--hbf-application.lovable.app/auth">
                Apply Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrokersPage;