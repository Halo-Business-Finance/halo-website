import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users,
  Award,
  Building2,
  ArrowRight
} from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";

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
      link: "/auth"
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
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose Halo Business Finance?
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            We're committed to providing your business with the capital, expertise, and personalized service you need to achieve your growth goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground mb-4">
                    {feature.description}
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary" asChild>
                  <a href={feature.link.startsWith('https') ? feature.link : '#'}>
                    {feature.link.startsWith('https') ? 'Apply Now' : feature.link}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Call to action with business image */}
        <div className="text-center mt-16">
          <div className="relative overflow-hidden rounded-2xl max-w-4xl mx-auto">
            <img 
              src={businessGrowth} 
              alt="Business success and growth"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative bg-financial-navy text-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <img 
                  src={sbaLogo} 
                  alt="SBA & Commercial Loan Marketplace"
                  className="h-12 w-auto"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2">
                    Ready to Fuel Your Business Growth?
                  </h3>
                  <p className="text-xl text-blue-100 max-w-2xl">
                    Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Our expertise in <Link to="/sba-loans" className="text-white underline hover:text-blue-100">SBA lending</Link> and SBA & Commercial Loan Marketplace ensures you get the best rates and terms available.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary font-semibold border-2 border-primary shadow-lg hover:bg-gray-50">
                  <Link to="/auth">Get Pre-Qualified</Link>
                </Button>
                <ConsultationPopup
                  trigger={
                    <Button size="lg" variant="outline" className="border-white text-primary">
                      Schedule Consultation
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;