import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { LazyImage } from "@/components/optimization/LazyImage";
import ConsultationPopup from "@/components/ConsultationPopup";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { 
  CreditCard, 
  PiggyBank, 
  Car, 
  TrendingUp, 
  Building2,
  ArrowRight,
  CheckCircle,
  Factory,
  Landmark,
  Hammer,
  Users,
  DollarSign,
  Receipt,
  Sparkles,
  Star,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import financialAdvisorConsultation from "@/assets/financial-advisor-consultation.jpg";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";
import businessConsultationProfessional from "@/assets/business-consultation-professional.jpg";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";


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
      badge: "Popular",
      color: "from-blue-600 to-blue-700"
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
      badge: null,
      color: "from-green-600 to-green-700"
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
      badge: "Fast",
      color: "from-orange-600 to-orange-700"
    },
    {
      logo: "/lovable-uploads/d5e250b6-8fb4-450c-bc02-d59e46b43e32.png",
      title: "USDA B&I Loans",
      description: "Rural business development financing backed by USDA guarantee.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Up to $25 million", "Rural area focus", "USDA guarantee"],
      learnLink: "/usda-bi-loans",
      applyLink: "/sba-loan-application",
      badge: null,
      color: "from-emerald-600 to-emerald-700"
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
      badge: null,
      color: "from-purple-600 to-purple-700"
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
      badge: null,
      color: "from-indigo-600 to-indigo-700"
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
      badge: null,
      color: "from-teal-600 to-teal-700"
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
      badge: null,
      color: "from-amber-600 to-amber-700"
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
      badge: "Fast",
      color: "from-red-600 to-red-700"
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
      badge: null,
      color: "from-cyan-600 to-cyan-700"
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
      badge: null,
      color: "from-violet-600 to-violet-700"
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
      badge: null,
      color: "from-pink-600 to-pink-700"
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
      applyLink: "/working-capital-application",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Business Line of Credit",
      description: "Flexible access to capital when you need it with revolving credit lines.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Draw as needed", "Pay interest only on used funds", "Revolving credit"],
      learnLink: "/business-line-of-credit",
      applyLink: "/business-line-of-credit-application",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Building2,
      title: "Term Loans",
      description: "Fixed-rate business loans for major investments and growth initiatives.",
      rate: "5.75%",
      rateLabel: "Starting APR",
      features: ["Fixed monthly payments", "Competitive rates", "Quick approval"],
      learnLink: "/term-loans",
      applyLink: "/term-loan-application",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Receipt,
      title: "Factoring-Based Financing",
      description: "Convert outstanding invoices into immediate working capital through factoring.",
      rate: "1-3%",
      rateLabel: "Factor Rate",
      features: ["Immediate cash flow", "No debt on balance sheet", "Credit protection"],
      learnLink: "/factoring-based-financing",
      applyLink: "/working-capital-application",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Carousel hooks for SBA & Commercial Loans
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
      '(min-width: 1280px)': { slidesToScroll: 4 }
    }
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Carousel hooks for Business Capital
  const [businessEmblaRef, businessEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1280px)': { slidesToScroll: 4 }
    }
  });

  const [businessPrevBtnDisabled, setBusinessPrevBtnDisabled] = useState(true);
  const [businessNextBtnDisabled, setBusinessNextBtnDisabled] = useState(true);

  const businessScrollPrev = useCallback(() => businessEmblaApi && businessEmblaApi.scrollPrev(), [businessEmblaApi]);
  const businessScrollNext = useCallback(() => businessEmblaApi && businessEmblaApi.scrollNext(), [businessEmblaApi]);

  const businessOnSelect = useCallback(() => {
    if (!businessEmblaApi) return;
    setBusinessPrevBtnDisabled(!businessEmblaApi.canScrollPrev());
    setBusinessNextBtnDisabled(!businessEmblaApi.canScrollNext());
  }, [businessEmblaApi]);

  useEffect(() => {
    if (!businessEmblaApi) return;
    businessOnSelect();
    businessEmblaApi.on('select', businessOnSelect);
    businessEmblaApi.on('reInit', businessOnSelect);
  }, [businessEmblaApi, businessOnSelect]);

  return (
    <section className="py-20 md:py-28 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Enhanced Header Section - JPMorgan Style */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-[var(--shadow-card)]">
            <Sparkles className="h-5 w-5" />
            Nationwide SBA & Commercial Loan Marketplace
          </div>
          
          {/* Our Streamlined Loan Process Section */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-financial-navy mb-2">Our Streamlined Loan Process</h3>
            <p className="text-lg text-slate-600 mb-8">We make commercial lending simple</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={step1SelectLoan} 
                    alt="Select loan program interface"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-financial-navy mb-2 mt-4">Select Your Loan Program</h4>
                <p className="text-slate-600 text-sm">Choose from our comprehensive range of loan products</p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={step2AnswerQuestions} 
                    alt="Answer questions form"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-financial-navy mb-2 mt-4">Answer Questions</h4>
                <p className="text-slate-600 text-sm">Complete our simple application about your loan request</p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={step3PreApproved} 
                    alt="Pre-approval process"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-financial-navy mb-2 mt-4">Get Pre-Approved</h4>
                <p className="text-slate-600 text-sm">Authorize a soft credit check for instant pre-approval</p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={step4UploadFinancials} 
                    alt="Upload financial documents"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-financial-navy mb-2 mt-4">Upload Financials</h4>
                <p className="text-slate-600 text-sm">Submit your documents to receive competitive term sheets</p>
              </div>
              <div className="text-center">
                <div className="relative mb-4">
                  <img 
                    src={step5GetFunded} 
                    alt="Get funded"
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">5</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg text-financial-navy mb-2 mt-4">Get Funded</h4>
                <p className="text-slate-600 text-sm">Sign your loan documents and receive your funding</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-lg font-semibold text-financial-navy mb-4">Fast, Simple, Secure</p>
              <Button className="bg-financial-navy text-white font-semibold px-6 py-3 shadow-[var(--shadow-button)] hover:shadow-lg transition-all duration-300" asChild>
                <a href="https://preview--hbf-application.lovable.app/auth">Get Started</a>
              </Button>
            </div>
          </div>
          
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="text-financial-navy">
              Comprehensive Business
            </span>
            <br />
            <span className="text-financial-navy">
              Financing Solutions
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            We provide credit, financing, treasury and payment solutions to help your business succeed. 
            Discover our comprehensive range of <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">SBA-backed</a> and conventional financing options designed to fuel your business growth.
          </p>
        </div>


        {/* Professional Carousel Section - JPMorgan Inspired */}
        <div className="relative mb-24 bg-transparent rounded-3xl shadow-[var(--shadow-professional)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-financial-navy mb-2">
                  SBA & Commercial Loan Solutions
                </h3>
                <p className="text-slate-600">
                  Explore our {products.length} comprehensive financing programs
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className="h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className="h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-30 transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Embla Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 min-w-0"
                >
                  <Card className="group relative overflow-hidden border-2 border-slate-300 hover:border-primary transition-all duration-300 hover:shadow-xl bg-transparent backdrop-blur-sm h-full">
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium shadow-sm z-10">
                        {product.badge}
                      </Badge>
                    )}
                    
                    <CardHeader className="pb-3 pt-4">
                      {/* Compact Icon/Logo Section */}
                      <div className="flex items-center gap-3 mb-3">
                        {product.logo ? (
                          <div className="p-2 bg-white rounded-lg border shadow-sm">
                            <img src={product.logo} alt={`${product.title} logo`} className="h-6 w-auto" />
                          </div>
                        ) : (
                          <div className={`p-2 bg-gradient-to-br ${product.color} rounded-lg`}>
                            <product.icon className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-200 truncate">
                            {product.title}
                          </h4>
                        </div>
                      </div>
                      
                      {/* Inline Rate Display */}
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-lg px-3 py-2">
                        <div className="text-xl font-bold text-primary">{product.rate}</div>
                        <div className="text-xs text-slate-600">{product.rateLabel}</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-4 flex flex-col flex-1">
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                      
                      {/* Compact Features */}
                      <div className="space-y-2 mb-4">
                        {product.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="flex items-center text-xs text-slate-700">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 2 && (
                          <div className="text-xs text-slate-500 ml-5">
                            +{product.features.length - 2} more benefits
                          </div>
                        )}
                      </div>

                      {/* Compact Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                          <Link to={product.learnLink}>
                            Learn
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1 text-xs">
                           <a href="https://preview--hbf-application.lovable.app/auth">
                              Apply
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(products.length / 4) }).map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-slate-300 hover:bg-primary transition-colors duration-200"
                onClick={() => emblaApi?.scrollTo(index * 4)}
              />
            ))}
          </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="relative h-24 md:h-32 overflow-hidden bg-gradient-to-r from-blue-50 to-emerald-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-500/5"></div>
        </div>

        {/* Business Capital Section */}
        <div className="border-t border-slate-200 pt-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Business Growth Capital
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Business Capital Solutions
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful capital tools designed to help your business grow and succeed.
            </p>
          </div>

          {/* Business Capital Carousel */}
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-4">
              {businessProducts.map((product, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 xl:basis-1/4">
                  <Card 
                    className="group relative border-2 border-slate-300 hover:border-primary transition-all duration-300 hover:shadow-lg bg-transparent backdrop-blur-sm h-full"
                  >
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 bg-gradient-to-br ${product.color} rounded-lg`}>
                          <product.icon className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-200 flex-1 min-w-0 truncate">
                          {product.title}
                        </h5>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <div className="text-xl font-bold text-primary">{product.rate}</div>
                        <div className="text-xs text-slate-600">{product.rateLabel}</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-4">
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {product.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="flex items-center text-xs text-slate-700">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 2 && (
                          <div className="text-xs text-slate-500 ml-5">+{product.features.length - 2} more</div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                          <Link to={product.learnLink}>
                            Learn
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1 text-xs">
                          <a href="https://preview--hbf-application.lovable.app/auth">
                            Apply
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl shadow-2xl">
          <LazyImage 
            src={financialAdvisorConsultation} 
            alt="Professional financial advisor consultation with business owner"
            className="absolute inset-0 w-full h-full object-cover"
            priority={false}
          />
          <div className="relative bg-financial-navy text-white py-20 px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4" />
                Join 2,500+ Successful Businesses
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Ready to Fuel Your Business Growth?
              </h3>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Check out our <Link to="/resources" className="text-white underline hover:text-blue-100 font-medium">business financing resources</Link> or read <a href="https://www.score.org/resource/business-loan-guide" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-blue-100 font-medium">SCORE's business loan guide</a> for additional insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 font-semibold text-lg px-8 py-4 shadow-xl hover:bg-slate-50 hover:shadow-2xl transition-all duration-300">
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    Get Pre-Qualified
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                </Button>
                <ConsultationPopup 
                  trigger={
                    <Button size="lg" variant="ghost" className="border-2 border-white text-white text-lg px-8 py-4 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                      Schedule Consultation
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;