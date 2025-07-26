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
      icon: PiggyBank,
      title: "High-Yield Savings",
      description: "Earn more with our competitive interest rates and no monthly fees.",
      rate: "4.25%",
      rateLabel: "APY",
      features: ["No minimum balance", "Mobile banking", "24/7 customer support"],
      cta: "Open Savings Account",
      badge: "Popular"
    },
    {
      icon: CheckCircle,
      title: "Checking Account",
      description: "Everyday banking made simple with digital tools and nationwide ATM access.",
      rate: "$0",
      rateLabel: "Monthly Fee",
      features: ["Free online banking", "Mobile check deposit", "Overdraft protection"],
      cta: "Open Checking Account",
      badge: null
    },
    {
      icon: CreditCard,
      title: "Rewards Credit Card",
      description: "Earn cash back on every purchase with our premium rewards program.",
      rate: "2%",
      rateLabel: "Cash Back",
      features: ["No annual fee", "Travel insurance", "Purchase protection"],
      cta: "Apply Now",
      badge: "New"
    },
    {
      icon: Home,
      title: "Home Loans",
      description: "Competitive rates and personalized service for your home financing needs.",
      rate: "6.75%",
      rateLabel: "Starting APR",
      features: ["Quick pre-approval", "Local lending experts", "Flexible terms"],
      cta: "Get Pre-Qualified",
      badge: null
    },
    {
      icon: Car,
      title: "Auto Loans",
      description: "Finance your next vehicle with competitive rates and flexible terms.",
      rate: "5.99%",
      rateLabel: "Starting APR",
      features: ["Fast approval", "New & used cars", "Refinancing available"],
      cta: "Apply for Auto Loan",
      badge: null
    },
    {
      icon: TrendingUp,
      title: "Investment Services",
      description: "Grow your wealth with professional investment management and planning.",
      rate: "Free",
      rateLabel: "Consultation",
      features: ["Portfolio management", "Retirement planning", "Financial advice"],
      cta: "Schedule Consultation",
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
        {/* Personal Banking Products */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose what's right for you
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our full range of personal banking products designed to help you achieve your financial goals.
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