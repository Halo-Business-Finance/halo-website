import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Calculator,
  CheckCircle,
  Building2,
  Package,
  DollarSign,
  FileText,
  Phone,
  Banknote,
  Truck,
  Factory
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";

const AssetBasedLoansPage = () => {
  const loanFeatures = [
    {
      icon: DollarSign,
      title: "High Loan-to-Value",
      description: "Borrow up to 85% of eligible asset value with flexible advance rates based on asset quality and liquidity."
    },
    {
      icon: Clock,
      title: "Quick Access to Capital",
      description: "Get funding in 7-14 days with streamlined underwriting focused on asset value rather than credit scores."
    },
    {
      icon: TrendingUp,
      title: "Revolving Credit Lines",
      description: "Access funds as needed with revolving credit facilities that grow with your business and asset base."
    },
    {
      icon: Shield,
      title: "Flexible Qualification",
      description: "Qualify based on asset value and business cash flow rather than traditional credit requirements."
    }
  ];

  const eligibleAssets = [
    {
      category: "Accounts Receivable",
      description: "Outstanding invoices from creditworthy customers",
      advanceRate: "80-85%",
      icon: FileText
    },
    {
      category: "Inventory",
      description: "Raw materials, work-in-progress, and finished goods",
      advanceRate: "50-70%",
      icon: Package
    },
    {
      category: "Equipment & Machinery",
      description: "Manufacturing equipment, vehicles, and technology",
      advanceRate: "60-75%",
      icon: Factory
    },
    {
      category: "Real Estate",
      description: "Commercial property and business real estate",
      advanceRate: "70-80%",
      icon: Building2
    }
  ];

  const loanPrograms = [
    {
      title: "Accounts Receivable Financing",
      description: "Convert outstanding invoices into immediate working capital",
      features: ["Up to 85% advance rate", "No minimum credit score", "Same-day funding available", "Invoice verification process"],
      idealFor: "B2B companies with 30-90 day payment terms"
    },
    {
      title: "Inventory Financing",
      description: "Leverage inventory to secure working capital loans",
      features: ["50-70% of inventory value", "Seasonal payment options", "Field examination included", "Various inventory types accepted"],
      idealFor: "Retailers, wholesalers, and manufacturers"
    },
    {
      title: "Equipment Financing",
      description: "Use business equipment as collateral for growth capital",
      features: ["60-75% of equipment value", "Keep using equipment", "Professional appraisals", "Multiple equipment types"],
      idealFor: "Manufacturing and construction companies"
    },
    {
      title: "Asset-Based Credit Lines",
      description: "Revolving credit facilities secured by multiple asset types",
      features: ["$250K - $50M+ facilities", "Prime + margin pricing", "Monthly borrowing base", "Multiple asset categories"],
      idealFor: "Growing businesses with diverse asset portfolios"
    }
  ];

  const industries = [
    "Manufacturing & Distribution",
    "Wholesale & Retail Trade",
    "Transportation & Logistics",
    "Construction & Contracting",
    "Healthcare & Medical Services",
    "Technology & Software",
    "Import/Export Companies",
    "Energy & Oil Services"
  ];

  const qualificationCriteria = [
    "Minimum $1M annual revenue (varies by program)",
    "Business operational for at least 12 months",
    "Acceptable asset quality and aging",
    "Basic financial reporting capability",
    "Management experience in industry",
    "Adequate insurance on collateral assets"
  ];

  return (
    <>
      <SEO
        title="Asset-Based Loans - Accounts Receivable & Inventory Financing | Halo Business Finance"
        description="Unlock working capital with asset-based loans. Finance against accounts receivable, inventory, equipment & real estate. Up to 85% advance rates with fast approval."
        keywords="asset based loans, accounts receivable financing, inventory financing, equipment financing, working capital, asset based lending"
        canonical="https://halobusinessfinance.com/asset-based-loans"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs />
        
        <main>
          {/* Hero Section */}
          <section className="relative py-24 bg-gradient-to-br from-financial-navy via-financial-navy/95 to-primary/20">
            <div className="absolute inset-0 bg-[url('/src/assets/warehouse-logistics.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
                  <Banknote className="w-4 h-4 mr-2" />
                  Asset-Based Lending Specialists
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Asset-Based <span className="text-primary">Loan Solutions</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  Turn your business assets into working capital. Finance against accounts receivable, inventory, 
                  equipment, and real estate with advance rates up to 85%.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                    <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                    <Link to="/contact-us">Speak with Specialist</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Asset-Based Financing</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Unlock the hidden value in your business assets with flexible financing solutions designed for growing companies.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loanFeatures.map((feature, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Eligible Assets */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Eligible Asset Categories</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  We finance against a wide range of business assets with competitive advance rates based on asset quality and marketability.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {eligibleAssets.map((asset, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <asset.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{asset.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm mb-4">{asset.description}</p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Up to {asset.advanceRate}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Loan Programs */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Asset-Based Loan Programs</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Tailored financing solutions for different asset types and business needs.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {loanPrograms.map((program, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">{program.title}</CardTitle>
                      <CardDescription className="text-base">{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {program.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Ideal For:</h4>
                          <p className="text-sm text-muted-foreground">{program.idealFor}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Industries Served */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Industries We Serve</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Our asset-based lending solutions serve businesses across diverse industries with varying asset profiles and financing needs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {industries.map((industry, index) => (
                      <div key={index} className="flex items-center">
                        <Truck className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
                  <div className="text-center">
                    <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Loan Terms & Rates</h3>
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between">
                        <span className="font-medium">Loan Amounts:</span>
                        <span className="text-primary font-bold">$250K - $50M+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Interest Rates:</span>
                        <span className="text-primary font-bold">Prime + 1-6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Terms:</span>
                        <span className="text-primary font-bold">Revolving</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Advance Rates:</span>
                        <span className="text-primary font-bold">Up to 85%</span>
                      </div>
                      <Separator />
                      <p className="text-xs text-muted-foreground">
                        *Terms vary based on asset type, quality, and borrower profile
                      </p>
                    </div>
                    <Button className="w-full mt-6" asChild>
                      <Link to="/loan-calculator">Calculate Payments</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Qualification Requirements */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Qualification Guidelines</h2>
                  <p className="text-xl text-muted-foreground">
                    General requirements for asset-based lending approval. Asset quality and business performance are primary factors.
                  </p>
                </div>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Building2 className="w-5 h-5 mr-2 text-primary" />
                          Business Requirements
                        </h3>
                        <ul className="space-y-3">
                          {qualificationCriteria.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-primary" />
                          Additional Criteria
                        </h3>
                        <ul className="space-y-3">
                          {qualificationCriteria.slice(3).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Asset-Based Lending Process</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Streamlined underwriting focused on asset value and business cash flow for faster decisions.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Asset Evaluation", description: "Analyze and value eligible business assets" },
                  { step: "2", title: "Financial Review", description: "Review business performance and cash flow" },
                  { step: "3", title: "Credit Decision", description: "Approval based on asset value and business strength" },
                  { step: "4", title: "Documentation", description: "Complete paperwork and begin accessing funds" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Turn Your Assets Into Working Capital</h2>
              <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Stop waiting for customer payments. Convert your business assets into immediate cash flow 
                with competitive asset-based financing solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    <FileText className="w-4 h-4 mr-2" />
                    Start Application
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact-us">
                    <Phone className="w-4 h-4 mr-2" />
                    Call (555) 123-4567
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AssetBasedLoansPage;