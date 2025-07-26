import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator, FileText, Building2, Phone, Mail, MapPin } from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";

const ResourcesPage = () => {
  const resources = [
    {
      icon: Calculator,
      title: "Loan Calculator",
      description: "Calculate loan payments and compare financing options with our interactive tools.",
      link: "/loan-calculator",
      cta: "Use Calculator"
    },
    {
      icon: FileText,
      title: "Pre-qualification",
      description: "Get pre-qualified for financing in minutes with our streamlined application process.",
      link: "/pre-qualification",
      cta: "Get Pre-Qualified"
    },
    {
      icon: Building2,
      title: "Industry Solutions",
      description: "Specialized financing solutions tailored to your specific industry needs.",
      link: "/industry-solutions",
      cta: "Explore Industries"
    }
  ];

  const industries = [
    "Healthcare & Medical",
    "Construction & Contractors", 
    "Manufacturing",
    "Retail & E-commerce",
    "Hospitality & Food Service",
    "Transportation & Logistics",
    "Professional Services",
    "Technology & Software",
    "Real Estate",
    "Agriculture",
    "Auto Repair & Services",
    "Fitness & Recreation"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Business Financing Resources
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Access our comprehensive collection of tools, calculators, and industry-specific solutions to help you make informed financing decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Explore Tools
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="Business financing resources"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Financing Tools & Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Take advantage of our comprehensive suite of business financing tools and resources designed to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <resource.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{resource.title}</h3>
                  <p className="text-muted-foreground mb-6">{resource.description}</p>
                  <Button asChild>
                    <Link to={resource.link}>{resource.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We understand that every industry has unique financing needs. Explore our specialized solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-sm">{industry}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg">
              View All Industry Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Personal Assistance?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our experienced team is here to help you navigate your financing options and find the best solution for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">Speak with a financing specialist</p>
                <Button variant="outline">
                  (800) 730-8461
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">Get answers to your questions</p>
                <Button variant="outline">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground mb-4">Irvine, California office</p>
                <Button variant="outline">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResourcesPage;