import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Shield, 
  Clock, 
  MapPin,
  Users,
  Award,
  ArrowRight
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile Banking",
      description: "Bank anywhere, anytime with our award-winning mobile app. Deposit checks, transfer funds, and manage your accounts on the go.",
      link: "Download App"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Your money and information are protected with multi-layer security, including biometric authentication and fraud monitoring.",
      link: "Learn About Security"
    },
    {
      icon: Clock,
      title: "24/7 Customer Service",
      description: "Get help when you need it with round-the-clock customer support available online, by phone, or in-person.",
      link: "Contact Support"
    },
    {
      icon: MapPin,
      title: "Nationwide ATM Network",
      description: "Access your money fee-free at over 16,000 ATMs nationwide, plus reimbursement for out-of-network fees.",
      link: "Find ATMs"
    },
    {
      icon: Users,
      title: "Personal Financial Advisors",
      description: "Work one-on-one with dedicated financial advisors to create a personalized plan for your financial future.",
      link: "Meet Our Advisors"
    },
    {
      icon: Award,
      title: "Award-Winning Service",
      description: "Consistently rated as one of the top banks for customer satisfaction and innovative financial solutions.",
      link: "View Awards"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Halo Finance?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the tools, technology, and personal service you need to achieve your financial goals.
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
              Ready to Experience Better Banking?
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join over 500,000 customers who trust Halo Finance with their financial future. Open an account today and discover the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Open Account Now
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