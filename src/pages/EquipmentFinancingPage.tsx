import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Building2, Stethoscope, ArrowRight } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import equipmentFinancing from "@/assets/equipment-financing.jpg";

const EquipmentFinancingPage = () => {
  const equipmentProducts = [
    {
      title: "Equipment Loans",
      description: "Traditional equipment financing for new and used business equipment purchases.",
      rate: "6.25%",
      amount: "Up to $5 Million",
      term: "2-7 Years",
      features: ["100% financing available", "New and used equipment", "Fixed and variable rates", "Fast approval"],
      link: "/equipment-loans",
      badge: "Most Popular"
    },
    {
      title: "Equipment Leasing",
      description: "Flexible leasing options that preserve capital and provide tax advantages.",
      rate: "Starting at 5.5%",
      amount: "Up to $10 Million",
      term: "2-5 Years",
      features: ["No down payment options", "Tax benefits", "Upgrade flexibility", "End-of-lease options"],
      link: "/equipment-leasing",
      badge: "Tax Benefits"
    },
    {
      title: "Heavy Equipment Financing",
      description: "Specialized financing for construction, manufacturing, and industrial equipment.",
      rate: "6.75%",
      amount: "Up to $15 Million",
      term: "5-10 Years",
      features: ["Construction equipment", "Manufacturing machinery", "Agricultural equipment", "Transportation fleet"],
      link: "/heavy-equipment",
      badge: "Industrial Focus"
    },
    {
      title: "Medical Equipment Financing",
      description: "Healthcare-focused equipment financing for medical practices and facilities.",
      rate: "5.75%",
      amount: "Up to $3 Million",
      term: "3-7 Years",
      features: ["Medical devices", "Diagnostic equipment", "Practice management systems", "Technology upgrades"],
      link: "/medical-equipment",
      badge: "Healthcare"
    }
  ];

  const equipmentTypes = [
    "Construction Equipment",
    "Manufacturing Machinery",
    "Medical Equipment",
    "Restaurant Equipment",
    "Transportation Vehicles",
    "Computer & Technology",
    "Agricultural Equipment",
    "Office Equipment",
    "Warehouse Equipment",
    "Professional Services Equipment"
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
                Equipment Financing That Powers Your Business
              </h1>
              <p className="text-xl mb-8 opacity-90">
                From construction equipment to medical devices, we provide flexible financing solutions to help you acquire the equipment your business needs to thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Equipment Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Consultation
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={equipmentFinancing} 
                alt="Equipment financing consultation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Financing Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Equipment Financing Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive equipment financing options designed to meet the unique needs of your industry and business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {equipmentProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
                {product.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-white">
                    {product.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">{product.title}</CardTitle>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{product.rate}</div>
                      <div className="text-sm text-muted-foreground">Starting Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{product.amount}</div>
                      <div className="text-sm text-muted-foreground">Financing Amount</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{product.term}</div>
                      <div className="text-sm text-muted-foreground">Terms Available</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full group" asChild>
                    <a href={product.link}>
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Types We Finance */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Equipment Types We Finance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide financing for a wide range of business equipment across all industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {equipmentTypes.map((type, index) => (
              <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-sm">{type}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Equipment Financing?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Industry Expertise</h3>
                <p className="text-muted-foreground">
                  Deep understanding of equipment values and industry needs across all sectors.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Flexible Terms</h3>
                <p className="text-muted-foreground">
                  Customizable repayment terms that align with your equipment's useful life and cash flow.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Tax Advantages</h3>
                <p className="text-muted-foreground">
                  Equipment financing often provides tax benefits through depreciation and interest deductions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src={businessGrowth} 
          alt="Business equipment success"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative bg-gradient-to-r from-financial-navy/90 to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Upgrade Your Equipment?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our equipment financing specialists are ready to help you acquire the equipment your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Equipment Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Speak with Specialist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EquipmentFinancingPage;