import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  DollarSign,
  Clock
} from "lucide-react";

const LendersPage = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Quality Loan Flow",
      description: "Access to pre-qualified borrowers with vetted loan applications and strong credit profiles."
    },
    {
      icon: Building2,
      title: "Diverse Portfolio",
      description: "Opportunities across multiple industries and loan types to diversify your lending portfolio."
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Comprehensive underwriting support and risk assessment tools to minimize default rates."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Personal account management and technical support to streamline your lending operations."
    }
  ];

  const loanTypes = [
    {
      type: "SBA 7(a) Loans",
      range: "$50K - $5M",
      features: ["Government guarantee", "Flexible use of funds", "Competitive rates"]
    },
    {
      type: "Commercial Real Estate",
      range: "$250K - $20M",
      features: ["Owner-occupied properties", "Investment properties", "Refinancing options"]
    },
    {
      type: "Equipment Financing",
      range: "$25K - $2M",
      features: ["New and used equipment", "100% financing available", "Fast approval process"]
    },
    {
      type: "Working Capital",
      range: "$50K - $1M",
      features: ["Revolving credit lines", "Seasonal businesses", "Quick access to funds"]
    }
  ];

  const requirements = [
    "Minimum $10M lending capacity",
    "Valid lending license (NMLS or state license)",
    "Strong financial standing and reputation",
    "Competitive interest rates and terms",
    "Ability to close loans within 30-45 days",
    "Comprehensive loan documentation",
    "Proven track record in commercial lending",
    "Technology integration capabilities"
  ];

  const marketplaceAdvantages = [
    {
      icon: TrendingUp,
      title: "Nationwide Reach",
      description: "Access borrowers from all 50 states through our comprehensive marketplace platform",
      metrics: "2,500+ Cities"
    },
    {
      icon: Users,
      title: "Quality Borrowers",
      description: "Pre-screened applications with verified business information and creditworthiness",
      metrics: "95% Quality Score"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced underwriting tools and compliance support to minimize default risk",
      metrics: "3.2% Default Rate"
    },
    {
      icon: Clock,
      title: "Fast Origination",
      description: "Streamlined digital process reduces origination time and operational costs",
      metrics: "30-Day Average"
    }
  ];

  const partnershipBenefits = [
    {
      category: "Technology Platform",
      benefits: [
        "Advanced loan matching algorithms",
        "Real-time pipeline management",
        "Digital document processing",
        "Automated compliance checks",
        "Performance analytics dashboard"
      ]
    },
    {
      category: "Marketing Support",
      benefits: [
        "Co-branded marketing materials",
        "Lead generation campaigns",
        "Industry event participation",
        "Digital marketing exposure",
        "PR and media opportunities"
      ]
    },
    {
      category: "Operational Support", 
      benefits: [
        "Dedicated account management",
        "Technical integration assistance",
        "Training and onboarding",
        "Ongoing support and maintenance",
        "Best practices consultation"
      ]
    },
    {
      category: "Business Growth",
      benefits: [
        "Access to new markets",
        "Portfolio diversification",
        "Competitive deal flow",
        "Reduced acquisition costs",
        "Scalable loan origination"
      ]
    }
  ];

  const platformFeatures = [
    {
      title: "Advanced Loan Matching",
      description: "AI-powered system matches loan applications with your lending criteria automatically."
    },
    {
      title: "Real-Time Analytics",
      description: "Comprehensive dashboard with loan pipeline, approval rates, and performance metrics."
    },
    {
      title: "Streamlined Processing",
      description: "Digital document management and electronic signature capabilities for faster closings."
    },
    {
      title: "Compliance Management",
      description: "Built-in compliance tools to ensure all loans meet regulatory requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca" 
          alt="Medical facility representing lender services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-financial-navy/80 text-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Join Our Lender Network
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with pre-qualified borrowers and grow your commercial lending portfolio through our comprehensive marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary font-semibold">
                Apply to Become a Lender
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white">
                Download Lender Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Marketplace Advantages
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join America's most comprehensive commercial loan marketplace and connect with pre-qualified borrowers nationwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {marketplaceAdvantages.map((advantage, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground mb-3">{advantage.description}</p>
                  <div className="text-2xl font-bold text-primary">{advantage.metrics}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Partnership Benefits</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support and resources to help you succeed in our marketplace
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {partnershipBenefits.map((benefit, index) => (
                <Card key={index} className="">
                  <CardHeader>
                    <CardTitle className="text-xl">{benefit.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {benefit.benefits.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Join Our Network?
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Access a steady flow of qualified commercial loan opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loan Opportunities
            </h2>
            <p className="text-xl text-foreground">
              Diverse commercial lending opportunities across multiple sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className="">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{loan.type}</span>
                    <span className="text-lg text-primary">{loan.range}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-foreground">
              Advanced technology to streamline your lending operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Lender Requirements
              </h2>
              <p className="text-xl text-foreground">
                Qualification criteria for joining our lender network.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{requirement}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-financial-navy/10 rounded-lg">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">$500M+</h3>
                  <p className="text-foreground">Total Loan Volume</p>
                </div>
                <div>
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">30 Days</h3>
                  <p className="text-foreground">Average Close Time</p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">95%</h3>
                  <p className="text-foreground">Lender Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-financial-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join Our Network?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact our lender relations team to discuss partnership opportunities.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-blue-100">(800) 730-8461</p>
                  <p className="text-sm text-blue-200">Lender Relations</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-blue-100">lenders@halobusinessfinance.com</p>
                  <p className="text-sm text-blue-200">Partnership Inquiries</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="bg-white text-primary font-semibold">
              Apply to Join Network
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LendersPage;