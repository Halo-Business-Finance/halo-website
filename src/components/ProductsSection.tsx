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
  CheckCircle,
  Shield,
  Factory,
  Landmark,
  Hammer,
  Users,
  Banknote,
  DollarSign,
  Receipt
} from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import financialAdvisorConsultation from "@/assets/financial-advisor-consultation.jpg";

const ProductsSection = () => {
  const products = [
    {
      logo: "/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png",
      title: "SBA 7(a) Loans",
      description: "Versatile financing for working capital, equipment, and real estate purchases.",
      rate: "Prime + 2.75%",
      rateLabel: "Starting Rate",
      features: ["Up to $5 million", "Long-term financing", "SBA guarantee"],
      learnLink: "/sba-7a-loans",
      applyLink: "/sba-loan-application",
      badge: "Popular"
    },
    {
      logo: "/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png",
      title: "SBA 504 Loans",
      description: "Fixed-rate financing for real estate and major equipment purchases.",
      rate: "Fixed Rate",
      rateLabel: "Long-term",
      features: ["Up to $5.5 million", "10% down payment", "Fixed rates"],
      learnLink: "/sba-504-loans",
      applyLink: "/sba-504-application",
      badge: null
    },
    {
      logo: "/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png",
      title: "SBA Express Loans",
      description: "Fast-track SBA financing with expedited approval process.",
      rate: "Prime + 4.5%",
      rateLabel: "Starting Rate",
      features: ["Up to $500,000", "36-hour approval", "Revolving credit option"],
      learnLink: "/sba-express-loans",
      applyLink: "/sba-loan-application",
      badge: "Fast"
    },
    {
      icon: Factory,
      title: "USDA B&I Loans",
      description: "Rural business development financing backed by USDA guarantee.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Up to $25 million", "Rural area focus", "USDA guarantee"],
      learnLink: "/usda-bi-loans",
      applyLink: "/sba-loan-application",
      badge: null
    },
    {
      icon: Building2,
      title: "Conventional Loans",
      description: "Traditional commercial financing for established businesses with strong credit profiles.",
      rate: "5.25%",
      rateLabel: "Starting APR",
      features: ["No government guarantee", "Faster approval", "Flexible terms"],
      learnLink: "/conventional-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: Landmark,
      title: "CMBS Loans",
      description: "Commercial mortgage-backed securities for large commercial real estate transactions.",
      rate: "4.75%",
      rateLabel: "Starting Rate",
      features: ["$2M+ loan amounts", "Non-recourse options", "Fixed rates"],
      learnLink: "/cmbs-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: PiggyBank,
      title: "Portfolio Loans",
      description: "Held-in-portfolio lending solutions with flexible underwriting standards.",
      rate: "5.5%",
      rateLabel: "Starting APR",
      features: ["Flexible underwriting", "Quick decisions", "Relationship banking"],
      learnLink: "/portfolio-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: Hammer,
      title: "Construction Loans",
      description: "Financing for new construction and major renovation projects.",
      rate: "Prime + 1.5%",
      rateLabel: "Starting Rate",
      features: ["Interest-only payments", "Progress-based funding", "Convert to permanent"],
      learnLink: "/construction-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: TrendingUp,
      title: "Bridge Loans",
      description: "Short-term financing to bridge cash flow gaps while securing permanent financing.",
      rate: "8.5%",
      rateLabel: "Starting APR",
      features: ["Fast 7-day closing", "Up to $10 million", "Flexible terms"],
      learnLink: "/bridge-financing",
      applyLink: "/bridge-loan-application",
      badge: "Fast"
    },
    {
      icon: Users,
      title: "Multifamily Loans",
      description: "Financing for apartment buildings and multi-unit residential properties.",
      rate: "4.5%",
      rateLabel: "Starting Rate",
      features: ["5+ unit properties", "Non-recourse options", "Long-term fixed rates"],
      learnLink: "/multifamily-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: DollarSign,
      title: "Asset-Based Loans",
      description: "Collateral-based financing using business assets as security.",
      rate: "6.75%",
      rateLabel: "Starting APR",
      features: ["Asset-backed security", "Flexible terms", "Fast approval"],
      learnLink: "/asset-based-loans",
      applyLink: "/conventional-loan-application",
      badge: null
    },
    {
      icon: Car,
      title: "Equipment Financing",
      description: "Fund new or used equipment purchases with competitive terms.",
      rate: "6.25%",
      rateLabel: "Starting APR",
      features: ["100% financing available", "Fast approval", "Flexible payments"],
      learnLink: "/equipment-financing",
      applyLink: "/equipment-loan-application",
      badge: null
    }
  ];

  const businessProducts = [
    {
      icon: CreditCard,
      title: "Working Capital",
      description: "Bridge cash flow gaps and fund day-to-day business operations.",
      rate: "Prime + 1%",
      rateLabel: "Starting Rate",
      features: ["Revolving credit line", "Quick access", "Flexible repayment"],
      learnLink: "/working-capital",
      applyLink: "/working-capital-application"
    },
    {
      icon: TrendingUp,
      title: "Business Line of Credit",
      description: "Flexible access to capital when you need it with revolving credit lines.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Draw as needed", "Pay interest only on used funds", "Revolving credit"],
      learnLink: "/business-line-of-credit",
      applyLink: "/business-line-of-credit-application"
    },
    {
      icon: Building2,
      title: "Term Loans",
      description: "Fixed-rate business loans for major investments and growth initiatives.",
      rate: "5.75%",
      rateLabel: "Starting APR",
      features: ["Fixed monthly payments", "Competitive rates", "Quick approval"],
      learnLink: "/term-loans",
      applyLink: "/term-loan-application"
    },
    {
      icon: Receipt,
      title: "Factoring-Based Financing",
      description: "Convert outstanding invoices into immediate working capital through factoring.",
      rate: "1-3%",
      rateLabel: "Factor Rate",
      features: ["Immediate cash flow", "No debt on balance sheet", "Credit protection"],
      learnLink: "/factoring-based-financing",
      applyLink: "/working-capital-application"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* SBA and Commercial Loans */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            SBA & Commercial Loan Solutions
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SBA-backed</a> and conventional financing options designed to fuel your business growth. Learn more about <Link to="/how-it-works" className="text-primary hover:underline">how our lending process works</Link>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {products.map((product, index) => (
            <Card key={index} className="relative">
              {product.badge && (
                <Badge className="absolute top-4 right-4 bg-primary text-white text-xs">
                  {product.badge}
                </Badge>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-3">
                  {product.logo ? (
                    <div className="p-2 bg-white rounded-lg border">
                      <img src={product.logo} alt={`${product.title} logo`} className="h-8 w-auto" />
                    </div>
                  ) : (
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <product.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="text-center py-4">
                  <h4 className="text-lg md:text-xl font-bold mb-4">{product.title}</h4>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{product.rate}</div>
                  <div className="text-xs md:text-sm text-foreground">{product.rateLabel}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm md:text-base text-foreground mb-4">{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-xs md:text-sm text-foreground">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-success mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Button asChild variant="outline" className="flex-1 text-xs md:text-sm">
                    <Link to={product.learnLink}>
                      Learn About
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 group text-xs md:text-sm">
                     <a href="https://preview--hbf-application.lovable.app/auth">
                       Apply For
                       <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                     </a>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Banking Section */}
        <div className="border-t pt-12 md:pt-16">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Business Capital Solutions
            </h3>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
              Powerful capital tools to help your business grow and succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {businessProducts.map((product, index) => (
              <Card key={index} className="">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <product.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h5 className="text-lg md:text-xl">{product.title}</h5>
                  </div>
                  <div className="text-center py-4">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{product.rate}</div>
                    <div className="text-xs md:text-sm text-foreground">{product.rateLabel}</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm md:text-base text-foreground mb-4">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-xs md:text-sm text-foreground">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <Button asChild variant="outline" className="flex-1 text-xs md:text-sm">
                      <Link to={product.learnLink}>
                        Learn About
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 group text-xs md:text-sm">
                      <a href="https://preview--hbf-application.lovable.app/auth">
                        Apply For
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section with Background Image */}
        <div className="mt-12 md:mt-16 relative overflow-hidden rounded-lg">
          <img 
            src={financialAdvisorConsultation} 
            alt="Professional financial advisor consultation with business owner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative bg-gradient-to-r from-financial-navy/90 to-primary/80 text-white py-12 md:py-16 px-6 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Fuel Your Business Growth?
              </h3>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Check out our <Link to="/resources" className="text-white underline hover:text-blue-100">business financing resources</Link> or read <a href="https://www.score.org/resource/business-loan-guide" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-blue-100">SCORE's business loan guide</a> for additional insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary font-semibold text-sm md:text-base border-2 border-financial-navy shadow-lg">
                  <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="border border-white text-white text-sm md:text-base">
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