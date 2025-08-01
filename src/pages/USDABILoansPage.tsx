import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Building, Users, DollarSign, Clock, ArrowRight, FileText, Calculator, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const USDABILoansPage = () => {
  const benefits = [
    "Loan amounts up to $25 million",
    "Competitive interest rates",
    "Longer repayment terms",
    "Lower down payment requirements",
    "Job creation and retention focus",
    "Rural and small town development"
  ];

  const eligibilityRequirements = [
    "Business located in eligible rural area",
    "For-profit business entity",
    "Tangible net worth not exceeding $15 million",
    "Average net income not exceeding $5 million",
    "Unable to obtain credit elsewhere",
    "Creates or saves jobs in rural areas"
  ];

  const useCases = [
    {
      title: "Manufacturing Facilities",
      description: "Expand or establish manufacturing operations in rural communities",
      icon: Building
    },
    {
      title: "Processing Plants",
      description: "Food processing, agricultural value-added processing facilities",
      icon: Users
    },
    {
      title: "Business Acquisition", 
      description: "Purchase existing businesses to maintain rural employment",
      icon: DollarSign
    },
    {
      title: "Working Capital",
      description: "Fund operations, inventory, and business growth initiatives",
      icon: Clock
    }
  ];

  return (
    <>
      <SEO 
        title="USDA Business & Industry (B&I) Loans | Rural Business Financing"
        description="USDA Business & Industry loans provide up to $25 million for rural business development. Competitive rates, longer terms, and job creation focus. Apply today."
        keywords="USDA B&I loans, rural business loans, USDA Business Industry loans, rural development financing, agricultural business loans"
        canonical="/usda-bi-loans"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-primary-glow text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                USDA Rural Development Program
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                USDA Business & Industry Loans
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Up to $25 million for rural business development with competitive rates and flexible terms
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                  <a href="https://preview--hbf-application.lovable.app/auth?loan=usda">
                    <Calculator className="mr-2 h-5 w-5" />
                    Apply Now
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/loan-calculator">
                    <FileText className="mr-2 h-5 w-5" />
                    Calculate Payment
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose USDA B&I Loans?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  USDA Business & Industry loans are designed to improve the economic climate in rural communities 
                  by supporting business development and job creation.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Loan Features</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Maximum Amount:</span>
                      <span className="font-semibold">Up to $25 Million</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Term Length:</span>
                      <span className="font-semibold">Up to 30 Years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Down Payment:</span>
                      <span className="font-semibold">As Low as 10%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="font-semibold">Competitive Rates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Common Use Cases</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                USDA B&I loans support a wide range of rural business activities that create jobs and strengthen local economies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <useCase.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Eligibility Requirements</h2>
                <p className="text-lg text-muted-foreground">
                  Meet these key requirements to qualify for USDA Business & Industry loan financing.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {eligibilityRequirements.slice(0, 3).map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {eligibilityRequirements.slice(3).map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-glow text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Rural Business?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Get started with your USDA B&I loan application today and take advantage of competitive financing for rural business development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link to="/sba-loan-application">
                  Start Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/contact-us">
                  <Phone className="mr-2 h-5 w-5" />
                  Speak with Expert
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default USDABILoansPage;