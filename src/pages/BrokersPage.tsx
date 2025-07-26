import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <section className="bg-gradient-to-br from-primary to-financial-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Partner With Halo Business Finance
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our network of successful brokers and grow your business with access to competitive loan products, superior support, and industry-leading commissions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Apply to Become a Broker
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Download Broker Kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed as a commercial loan broker.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Commission Structure
              </h2>
              <p className="text-xl text-gray-600">
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
                    <p className="text-sm text-gray-600">Commission Rate</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Bonuses</h3>
              <ul className="space-y-1 text-gray-600">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What You Get as a Partner
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive support and resources to maximize your success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-financial-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact our broker partnership team to learn more about joining our network.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-blue-100">(800) 730-8461</p>
                  <p className="text-sm text-blue-200">Broker Partnership Line</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-blue-100">brokers@halobusinessfinance.com</p>
                  <p className="text-sm text-blue-200">Partnership Inquiries</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
              Apply Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrokersPage;