import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, DollarSign, TrendingUp, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const ReferralPartnersPage = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      title: "Competitive Commissions",
      description: "Earn attractive commissions on successful loan placements with transparent payout structures."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Dedicated Support",
      description: "Access to dedicated partner support team to help you close deals faster."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Growing Network",
      description: "Join our expanding network of successful referral partners nationwide."
    }
  ];

  const requirements = [
    "Professional business license or certification",
    "Established client base or network",
    "Commitment to ethical business practices",
    "Willingness to participate in training programs"
  ];

  return (
    <>
      <SEO 
        title="Referral Partners | Join Our Network - Halo Business Finance"
        description="Partner with Halo Business Finance and earn competitive commissions by referring clients to our comprehensive loan marketplace. Join our growing network of successful referral partners."
        keywords="referral partners, business financing referrals, loan referral program, partner network, commission earnings, business partnerships"
        canonical="https://halobusinessfinance.com/referral-partners"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Referral Partner Program
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Partner with Halo Business Finance and earn competitive commissions by connecting your clients with our comprehensive loan marketplace and expert financing solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/contact-us" className="flex items-center">
                    Apply Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/contact-us" className="flex items-center">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partner Benefits
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join our referral program and enjoy these exclusive benefits designed to help you succeed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Program Details */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  How It Works
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply to Join</h3>
                      <p className="text-gray-600">Submit your application and meet our partner requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Approved</h3>
                      <p className="text-gray-600">Once approved, receive your partner materials and training.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Refer Clients</h3>
                      <p className="text-gray-600">Start referring clients and track your commissions through our portal.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Commissions</h3>
                      <p className="text-gray-600">Receive competitive commissions on successful loan closings.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Partner Requirements
                </h2>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ready to Get Started?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact our partnership team to learn more about joining our referral program.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">(800) 730-8461</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">partners@halobusinessfinance.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Partner Network Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start earning commissions by referring clients to our comprehensive loan marketplace.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/contact-us">
                Apply for Partnership
              </Link>
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ReferralPartnersPage;