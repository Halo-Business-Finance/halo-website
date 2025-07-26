import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  PiggyBank, 
  Home, 
  Car, 
  TrendingUp, 
  Building2,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";

const ProductsSection = () => {
  const products = [
    {
      icon: Building2,
      title: "SBA 7(a) Loans",
      description: "Versatile financing for working capital, equipment, and real estate purchases.",
      rate: "Prime + 2.75%",
      rateLabel: "Starting Rate",
      features: ["Up to $5 million", "Long-term financing", "SBA guarantee"],
      cta: "Apply for SBA 7(a)",
      badge: "Popular"
    },
    {
      icon: Home,
      title: "SBA 504 Loans",
      description: "Fixed-rate financing for real estate and major equipment purchases.",
      rate: "Fixed Rate",
      rateLabel: "Long-term",
      features: ["Up to $5.5 million", "10% down payment", "Fixed rates"],
      cta: "Learn About 504",
      badge: null
    },
    {
      icon: TrendingUp,
      title: "Bridge Loans",
      description: "Short-term financing to bridge cash flow gaps while securing permanent financing.",
      rate: "8.5%",
      rateLabel: "Starting APR",
      features: ["Fast 7-day closing", "Up to $10 million", "Flexible terms"],
      cta: "Get Bridge Financing",
      badge: "Fast"
    },
    {
      icon: Building2,
      title: "Conventional Loans",
      description: "Traditional commercial financing for established businesses with strong credit profiles.",
      rate: "5.25%",
      rateLabel: "Starting APR",
      features: ["No government guarantee", "Faster approval", "Flexible terms"],
      cta: "Apply for Conventional",
      badge: null
    },
    {
      icon: Car,
      title: "Equipment Financing",
      description: "Fund new or used equipment purchases with competitive terms.",
      rate: "6.25%",
      rateLabel: "Starting APR",
      features: ["100% financing available", "Fast approval", "Flexible payments"],
      cta: "Finance Equipment",
      badge: null
    },
    {
      icon: CreditCard,
      title: "Working Capital",
      description: "Bridge cash flow gaps and fund day-to-day business operations.",
      rate: "Prime + 1%",
      rateLabel: "Starting Rate",
      features: ["Revolving credit line", "Quick access", "Flexible repayment"],
      cta: "Get Working Capital",
      badge: null
    }
  ];

  const businessProducts = [
    {
      icon: TrendingUp,
      title: "Business Line of Credit",
      description: "Flexible access to capital when you need it with revolving credit lines.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Draw as needed", "Pay interest only on used funds", "Revolving credit"],
      cta: "Apply for Line of Credit"
    },
    {
      icon: Building2,
      title: "Term Loans",
      description: "Fixed-rate business loans for major investments and growth initiatives.",
      rate: "5.75%",
      rateLabel: "Starting APR",
      features: ["Fixed monthly payments", "Competitive rates", "Quick approval"],
      cta: "Get Term Loan Quote"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* SBA and Commercial Loans */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            SBA & Commercial Loan Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of SBA and commercial financing options designed to fuel your business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {products.map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 relative">
              {product.badge && (
                <Badge className="absolute top-4 right-4 bg-primary text-white">
                  {product.badge}
                </Badge>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <product.icon className="h-6 w-6 text-primary" />
                  </div>
                   <h3 className="text-xl">{product.title}</h3>
                </div>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-primary">{product.rate}</div>
                  <div className="text-sm text-gray-600">{product.rateLabel}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full group">
                  <Link to="/pre-qualification">
                    {product.cta}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Banking Section */}
        <div className="border-t pt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Capital Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful capital tools to help your business grow and succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {businessProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <product.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl">{product.title}</h3>
                  </div>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary">{product.rate}</div>
                    <div className="text-sm text-gray-600">{product.rateLabel}</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full group">
                    <Link to="/business-capital">
                      {product.cta}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section with Background Image */}
        <div className="mt-16 relative overflow-hidden rounded-lg">
          <img 
            src={loanConsultation} 
            alt="Professional loan consultation meeting"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative bg-gradient-to-r from-financial-navy/90 to-primary/80 text-white py-16 px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Fuel Your Business Growth?
              </h2>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Join hundreds of successful businesses who trust Halo Business Finance for their growth capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                  <Link to="/pre-qualification">Get Pre-Qualified</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/contact-us">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;