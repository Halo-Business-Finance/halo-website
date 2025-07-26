import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      title: "SBA Express Loans",
      description: "Fast approval for smaller loan amounts with quick turnaround times.",
      rate: "Prime + 4.5%",
      rateLabel: "Starting Rate",
      features: ["Up to $500,000", "Fast 36-hour approval", "Streamlined process"],
      cta: "Apply Express",
      badge: "Fast"
    },
    {
      icon: Building2,
      title: "Commercial Real Estate",
      description: "Financing solutions for purchasing or refinancing commercial properties.",
      rate: "5.5%",
      rateLabel: "Starting APR",
      features: ["Competitive rates", "Flexible terms", "Local expertise"],
      cta: "Get CRE Quote",
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
      icon: Building2,
      title: "Business Checking",
      description: "Streamlined business banking with advanced cash management tools.",
      rate: "500",
      rateLabel: "Free Transactions",
      features: ["Online banking", "Mobile deposits", "ACH processing"],
      cta: "Open Business Account"
    },
    {
      icon: CreditCard,
      title: "Business Credit Cards",
      description: "Build business credit while earning rewards on everyday purchases.",
      rate: "1.5%",
      rateLabel: "Cash Back",
      features: ["Expense tracking", "Employee cards", "Detailed reporting"],
      cta: "Apply for Business Card"
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
                  <CardTitle className="text-xl">{product.title}</CardTitle>
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

                <Button className="w-full group">
                  {product.cta}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Banking Section */}
        <div className="border-t pt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Banking Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful banking tools to help your business grow and succeed.
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
                    <CardTitle className="text-xl">{product.title}</CardTitle>
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

                  <Button className="w-full group">
                    {product.cta}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;