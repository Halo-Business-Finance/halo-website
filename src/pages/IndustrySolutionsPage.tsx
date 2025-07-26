import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Utensils, Wrench, ShoppingCart, Stethoscope, Truck } from "lucide-react";

const IndustrySolutionsPage = () => {
  const industries = [
    {
      icon: Utensils,
      title: "Restaurant & Food Service",
      description: "Equipment financing, working capital, and expansion loans for restaurants, cafes, and food service businesses.",
      solutions: ["Equipment Financing", "Working Capital", "Franchise Loans", "Renovation Financing"]
    },
    {
      icon: ShoppingCart,
      title: "Retail",
      description: "Inventory financing, store expansion, and seasonal capital for retail businesses of all sizes.",
      solutions: ["Inventory Financing", "Store Expansion", "Seasonal Capital", "POS Systems"]
    },
    {
      icon: Wrench,
      title: "Construction",
      description: "Heavy equipment financing, project funding, and bonding for construction companies.",
      solutions: ["Equipment Loans", "Project Financing", "Bonding", "Fleet Financing"]
    },
    {
      icon: Stethoscope,
      title: "Healthcare",
      description: "Medical equipment financing, practice expansion, and specialized healthcare lending solutions.",
      solutions: ["Medical Equipment", "Practice Acquisition", "EMR Systems", "Facility Expansion"]
    },
    {
      icon: Truck,
      title: "Transportation",
      description: "Fleet financing, equipment loans, and working capital for trucking and logistics companies.",
      solutions: ["Fleet Financing", "Trailer Loans", "Fuel Cards", "Working Capital"]
    },
    {
      icon: Building,
      title: "Manufacturing",
      description: "Machinery financing, facility expansion, and working capital for manufacturing businesses.",
      solutions: ["Machinery Loans", "Facility Expansion", "Inventory Financing", "Export Financing"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Specialized Solutions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Industry Solutions</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Tailored financing solutions designed for the unique needs of your industry. We understand your business and provide specialized lending products.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-8 w-8 text-primary" />
                      <CardTitle className="text-xl">{industry.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{industry.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Financing Solutions:</h4>
                      <div className="space-y-2">
                        {industry.solutions.map((solution, sIndex) => (
                          <div key={sIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{solution}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Industry?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We work with businesses across all industries. Our experienced team can create custom financing solutions 
              for your specific business needs, regardless of your industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Our Specialists</Button>
              <Button size="lg" variant="outline">View All Loan Products</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Industry-Specific Financing?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our industry experts understand the unique challenges and opportunities in your field.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Industry Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our lending specialists have deep knowledge of industry-specific cash flow patterns, seasonal trends, and growth opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tailored Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer specialized loan products designed for your industry's unique equipment, inventory, and working capital needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flexible Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our terms are structured to match your industry's revenue cycles, seasonal patterns, and growth phases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndustrySolutionsPage;