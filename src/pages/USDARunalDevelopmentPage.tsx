import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import DefaultPageHeader from "@/components/DefaultPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  TrendingUp, 
  Users, 
  Calculator,
  CheckCircle,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Phone
} from "lucide-react";

const USDARunalDevelopmentPage = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      title: "Below Market Interest Rates",
      description: "Access competitive rates typically 1-3% below conventional commercial rates"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Flexible Terms",
      description: "Loan terms up to 30 years for real estate and 15 years for equipment"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
      title: "Up to 90% Financing",
      description: "High loan-to-value ratios with minimal down payment requirements"
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-600" />,
      title: "Rural Focus",
      description: "Specifically designed to support rural communities and businesses"
    }
  ];

  const eligibleProjects = [
    "Manufacturing facilities",
    "Processing plants", 
    "Distribution centers",
    "Healthcare facilities",
    "Educational institutions",
    "Essential community services",
    "Tourism and recreational facilities",
    "Energy projects"
  ];

  const requirements = [
    "Business must be located in eligible rural area",
    "Create or save jobs in rural communities", 
    "Demonstrate repayment ability",
    "Meet USDA environmental requirements",
    "Provide economic benefit to the community"
  ];

  return (
    <>
      <SEO 
        title="USDA Rural Development Loans | Business Financing for Rural Communities"
        description="Access USDA Rural Development financing for businesses in rural areas. Below-market rates, flexible terms, and up to 90% financing for qualifying projects."
        keywords="USDA rural development, rural business loans, USDA financing, rural economic development, agricultural business loans"
        canonical="https://halobusinessfinance.com/usda-rural-development"
      />
      
      <Helmet>
        <title>USDA Rural Development Loans | Business Financing for Rural Communities</title>
        <meta name="description" content="Access USDA Rural Development financing for businesses in rural areas. Below-market rates, flexible terms, and up to 90% financing for qualifying projects." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <DefaultPageHeader 
          title="USDA Rural Development Loans"
          subtitle="Empowering Rural Communities Through Strategic Business Financing"
        />

        <div className="container mx-auto px-4 py-12">
          {/* Overview Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Government-Backed Financing
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Supporting Rural Economic Development
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                USDA Rural Development programs provide crucial financing to help businesses 
                create jobs and stimulate economic growth in rural communities across America. 
                These government-backed loans offer favorable terms and rates to qualifying businesses.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Program Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Eligible Projects
                </CardTitle>
                <CardDescription>
                  Types of businesses and projects that qualify for USDA Rural Development financing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {eligibleProjects.map((project, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">{project}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Eligibility Requirements
                </CardTitle>
                <CardDescription>
                  Key criteria your business must meet to qualify for USDA financing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Loan Terms */}
          <Card className="mb-16">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Loan Terms & Features</CardTitle>
              <CardDescription>
                Competitive financing options designed for rural business success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto" />
                  <h3 className="font-semibold">Loan Amounts</h3>
                  <p className="text-muted-foreground">Up to $25 million for qualifying projects</p>
                </div>
                <div className="space-y-2">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto" />
                  <h3 className="font-semibold">Interest Rates</h3>
                  <p className="text-muted-foreground">Below-market rates based on Treasury yields</p>
                </div>
                <div className="space-y-2">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto" />
                  <h3 className="font-semibold">Repayment Terms</h3>
                  <p className="text-muted-foreground">Up to 30 years for real estate projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Explore USDA Rural Development Financing?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our USDA specialists will help you determine eligibility and navigate the application process 
                for rural development financing that can transform your business and community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/sba-loan-application">
                    Apply Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/loan-calculator">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Payments
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+18007308461">
                    <Phone className="h-4 w-4 mr-2" />
                    (800) 730-8461
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default USDARunalDevelopmentPage;