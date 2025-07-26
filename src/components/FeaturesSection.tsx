import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users,
  Award,
  Building2,
  ArrowRight
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "SBA Loan Expertise",
      description: "Specialized knowledge in SBA 7(a), 504, and Express loans with a proven track record of successful approvals.",
      link: "Learn More"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-level security and full regulatory compliance ensure your business information and transactions are protected.",
      link: "Security Details"
    },
    {
      icon: Clock,
      title: "Fast Approval Process",
      description: "Streamlined application process with dedicated loan officers providing quick decisions and personalized service.",
      link: "Apply Now"
    },
    {
      icon: Building2,
      title: "Commercial Lending Focus",
      description: "Exclusive focus on business financing with deep understanding of commercial real estate and equipment needs.",
      link: "Our Services"
    },
    {
      icon: Users,
      title: "Dedicated Loan Officers",
      description: "Work directly with experienced commercial lending professionals who understand your industry and business needs.",
      link: "Meet Our Team"
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Years of successful business financing with competitive rates and flexible terms tailored to your business.",
      link: "Success Stories"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Halo Business Finance?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing your business with the capital, expertise, and personalized service you need to achieve your growth goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-none hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary hover:text-primary">
                  {feature.link}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-financial-navy rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Fuel Your Business Growth?
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Get pre-qualified today and discover the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Get Pre-Qualified
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;