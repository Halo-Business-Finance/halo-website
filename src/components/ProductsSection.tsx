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
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80",
      title: "SBA 7(a) Loans",
      description: "Versatile financing for working capital, equipment, and real estate purchases.",
      rate: "Prime + 2.75%",
      rateLabel: "Starting Rate",
      features: ["Up to $5 million loan amount", "Long-term financing up to 25 years", "SBA government guarantee protection"],
      learnLink: "/sba-7a-loans",
      applyLink: "/sba-loan-application",
      badge: "Popular",
      color: "from-blue-600 to-blue-700"
    },
    {
      logo: "/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png",
      image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&q=80",
      title: "SBA 504 Loans",
      description: "Fixed-rate financing for real estate and major equipment purchases.",
      rate: "Fixed Rate",
      rateLabel: "Long-term",
      features: ["Up to $5.5 million total project", "Only 10% down payment required", "Fixed interest rates available"],
      learnLink: "/sba-504-loans",
      applyLink: "/sba-504-application",
      badge: null,
      color: "from-green-600 to-green-700"
    },
    {
      logo: "/lovable-uploads/d5e250b6-8fb4-450c-bc02-d59e46b43e32.png",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
      title: "USDA B&I Loans",
      description: "Rural business development financing backed by USDA guarantee.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Up to $25 million loan amount", "Rural area business focus only", "USDA government guarantee backing"],
      learnLink: "/usda-bi-loans",
      applyLink: "/sba-loan-application",
      badge: null,
      color: "from-emerald-600 to-emerald-700"
    },
    {
      icon: Building2,
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80",
      title: "Conventional Loans",
      description: "Traditional commercial financing for established businesses with strong credit profiles.",
      rate: "5.25%",
      rateLabel: "Starting APR",
      features: ["No government guarantee required", "Faster approval process timeline", "Flexible repayment terms available"],
      learnLink: "/conventional-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-purple-600 to-purple-700"
    },
    {
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&q=80",
      title: "CMBS Loans",
      description: "Commercial mortgage-backed securities for large commercial real estate transactions.",
      rate: "4.75%",
      rateLabel: "Starting Rate",
      features: ["$2 million minimum loan amounts", "Non-recourse financing options available", "Fixed interest rates guaranteed"],
      learnLink: "/cmbs-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-indigo-600 to-indigo-700"
    },
    {
      icon: PiggyBank,
      image: "https://images.unsplash.com/photo-1590755777752-62d83737776c?auto=format&fit=crop&q=80",
      title: "Portfolio Loans",
      description: "Held-in-portfolio lending solutions with flexible underwriting standards.",
      rate: "5.5%",
      rateLabel: "Starting APR",
      features: ["Flexible underwriting standards applied", "Quick decision making process", "Relationship-based banking approach"],
      learnLink: "/portfolio-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-teal-600 to-teal-700"
    },
    {
      icon: Hammer,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
      title: "Construction Loans",
      description: "Financing for new construction and major renovation projects.",
      rate: "Prime + 1.5%",
      rateLabel: "Starting Rate",
      features: ["Interest-only payments during construction", "Progress-based funding disbursement schedule", "Convert to permanent financing option"],
      learnLink: "/construction-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-amber-600 to-amber-700"
    },
    {
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80",
      title: "Bridge Loans",
      description: "Short-term financing to bridge cash flow gaps while securing permanent financing.",
      rate: "8.5%",
      rateLabel: "Starting APR",
      features: ["Fast 7-day closing process", "Up to $10 million available", "Flexible short-term repayment options"],
      learnLink: "/bridge-financing",
      applyLink: "/bridge-loan-application",
      badge: "Fast",
      color: "from-red-600 to-red-700"
    },
    {
      icon: Users,
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80",
      title: "Multifamily Loans",
      description: "Financing for apartment buildings and multi-unit residential properties.",
      rate: "4.5%",
      rateLabel: "Starting Rate",
      features: ["5+ unit properties qualified", "Non-recourse financing options available", "Long-term fixed rate stability"],
      learnLink: "/multifamily-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-cyan-600 to-cyan-700"
    },
    {
      icon: DollarSign,
      image: "https://images.unsplash.com/photo-1590755777752-62d83737776c?auto=format&fit=crop&q=80",
      title: "Asset-Based Loans",
      description: "Collateral-based financing using business assets as security.",
      rate: "6.75%",
      rateLabel: "Starting APR",
      features: ["Asset-backed security collateral required", "Flexible repayment terms available", "Fast approval process timeline"],
      learnLink: "/asset-based-loans",
      applyLink: "/conventional-loan-application",
      badge: null,
      color: "from-violet-600 to-violet-700"
    },
    {
      icon: Car,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
      title: "Equipment Financing",
      description: "Fund new or used equipment purchases with competitive terms.",
      rate: "6.25%",
      rateLabel: "Starting APR",
      features: ["100% financing available option", "Fast approval process guaranteed", "Flexible payment schedules offered"],
      learnLink: "/equipment-financing",
      applyLink: "/equipment-loan-application",
      badge: null,
      color: "from-pink-600 to-pink-700"
    }
  ];

  const businessProducts = [
    {
      icon: CreditCard,
      image: "https://images.unsplash.com/photo-1590755777752-62d83737776c?auto=format&fit=crop&q=80",
      title: "Working Capital",
      description: "Bridge cash flow gaps and fund day-to-day business operations.",
      rate: "Prime + 1%",
      rateLabel: "Starting Rate",
      features: ["Revolving credit line available", "Quick access to funds", "Flexible repayment terms"],
      learnLink: "/working-capital",
      applyLink: "/working-capital-application",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
      title: "Business Line of Credit",
      description: "Flexible access to capital when you need it with revolving credit lines.",
      rate: "Prime + 2%",
      rateLabel: "Starting Rate",
      features: ["Draw funds as needed only", "Pay interest only on used funds", "Revolving credit facility"],
      learnLink: "/business-line-of-credit",
      applyLink: "/business-line-of-credit-application",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Building2,
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80",
      title: "Term Loans",
      description: "Fixed-rate business loans for major investments and growth initiatives.",
      rate: "5.75%",
      rateLabel: "Starting APR",
      features: ["Fixed monthly payments", "Competitive rates", "Quick approval process"],
      learnLink: "/term-loans",
      applyLink: "/term-loan-application",
      color: "from-purple-500 to-purple-600"
    },
    {
      logo: "/lovable-uploads/ace45563-970c-4960-91fe-f803a90fd0a3.png",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
      title: "SBA Express Loans",
      description: "Fast-track SBA financing with expedited approval process.",
      rate: "Prime + 4.5%",
      rateLabel: "Starting Rate",
      features: ["Up to $500,000 loan amount", "36-hour approval timeline guaranteed", "Revolving credit line option available"],
      learnLink: "/sba-express-loans",
      applyLink: "/sba-loan-application",
      badge: "Fast",
      color: "from-orange-600 to-orange-700"
    },
    {
      icon: Receipt,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80",
      title: "Factoring-Based Financing",
      description: "Convert outstanding invoices into immediate working capital through factoring.",
      rate: "1-3%",
      rateLabel: "Factor Rate",
      features: ["Immediate cash flow solutions", "No debt on balance sheet", "Customer credit protection included"],
      learnLink: "/factoring-based-financing",
      applyLink: "/working-capital-application",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Carousel hooks for SBA & Commercial Loans
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(max-width: 768px)': { slidesToScroll: 1 },
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
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
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(max-width: 768px)': { slidesToScroll: 1 },
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
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
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Streamlined Loan Process</h3>
            <p className="text-xl text-slate-600 mb-8">We make commercial lending simple</p>
            
            <div className="relative">
              <div className="grid md:grid-cols-5 gap-8">
                {[
                  { step: 1, title: "Select Your Loan Program", description: "Choose from our comprehensive range of loan products", image: step1SelectLoan },
                  { step: 2, title: "Answer Questions", description: "Complete our simple application about your loan request", image: step2AnswerQuestions },
                  { step: 3, title: "Get Pre-Approved", description: "Authorize a soft credit check for instant pre-approval", image: step3PreApproved },
                  { step: 4, title: "Upload Financials", description: "Submit your documents to receive competitive term sheets", image: step4UploadFinancials },
                  { step: 5, title: "Get Funded", description: "Sign your loan documents and receive your funding", image: step5GetFunded }
                ].map((item, index) => (
                  <div key={index} className="relative flex items-stretch h-full">
                    <Card className="text-center p-6 animate-fade-in hover-scale w-full flex flex-col h-[480px]">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
                        </div>
                        <div className="text-3xl font-bold text-primary mb-4">Step {item.step}</div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Arrow - only show between steps, not after the last one */}
                    {index < 4 && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="bg-primary/10 rounded-full p-2 animate-pulse">
                          <ArrowRight className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Text content below process steps */}
            <div className="text-center mt-12">
              <h4 className="text-2xl font-semibold mb-6 text-primary">Fast, Simple, Secure</h4>
              
              {/* Get Started Button */}
              <div className="mb-6">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold animate-fade-in"
                  asChild
                >
                  <a href="https://preview--hbf-application.lovable.app/auth">Get Started</a>
                </Button>
              </div>
              
              <p className="text-lg text-slate-600">Professional lending process with modern technology</p>
            </div>
          </div>
          
          {/* Section Divider */}
          <div className="flex items-center justify-center my-20">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="px-8">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
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


        {/* Professional Financial Services Carousel - SBA & Commercial Loans */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Elegant Header Section */}
          <div className="bg-gradient-to-r from-financial-navy to-primary p-8 md:p-12 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-light mb-2">
                  SBA & Commercial Financing
                </h3>
                <p className="text-blue-100 text-lg font-light">
                  Comprehensive solutions for your business growth
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className="h-12 w-12 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 transition-all duration-300 text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className="h-12 w-12 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 transition-all duration-300 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Carousel Content */}
          <div className="p-8 md:p-12 bg-slate-50/30">

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 pl-2 pr-8">
                {products.map((product, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-64 md:w-60"
                  >
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white h-full hover:-translate-y-1">
                        
                        {/* Cover Image */}
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          {product.badge && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                                {product.badge}
                              </span>
                            </div>
                          )}
                          {/* Title Overlay */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white text-lg font-semibold leading-tight">
                              {product.title}
                            </h4>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-3 pt-4">
                          {/* Rate Display */}
                          <div className="bg-gradient-to-r from-blue-50 to-primary/5 rounded-lg px-3 py-2 border border-blue-100">
                            <div className="text-xl font-bold text-primary mb-1">{product.rate}</div>
                            <div className="text-xs text-slate-600 font-medium">{product.rateLabel}</div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 pb-4 flex flex-col flex-1">
                          <p className="text-slate-600 mb-4 leading-relaxed flex-grow text-sm">
                            {product.description}
                          </p>
                          
                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {product.features.slice(0, 2).map((feature, i) => (
                              <div key={i} className="flex items-center text-xs">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                <span className="text-slate-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            <Button asChild variant="outline" size="sm" className="flex-1 border-slate-300 hover:border-primary hover:bg-primary/5 text-xs">
                              <Link to={product.learnLink}>
                                Learn
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-md text-xs">
                              <a href="https://preview--hbf-application.lovable.app/auth">
                                Apply
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
        <div className="flex items-center justify-center my-20">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          <div className="px-8">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>

        {/* Business Capital Section */}
        <div className="pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Business Capital Solutions
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful capital tools designed to help your business grow and succeed.
            </p>
          </div>

          {/* Professional Financial Services Carousel - Business Capital */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Elegant Header Section */}
            <div className="bg-gradient-to-r from-financial-navy to-primary p-8 md:p-12 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-2xl md:text-3xl font-light mb-2">
                    Business Capital Solutions
                  </h4>
                  <p className="text-white text-lg font-light">
                    Flexible capital tools for your business needs
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={businessScrollPrev}
                    disabled={businessPrevBtnDisabled}
                    className="h-12 w-12 rounded-full border border-white hover:bg-white hover:border-white disabled:opacity-50 text-white hover:text-financial-navy"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={businessScrollNext}
                    disabled={businessNextBtnDisabled}
                    className="h-12 w-12 rounded-full border border-white hover:bg-white hover:border-white disabled:opacity-50 text-white hover:text-financial-navy"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="p-8 md:p-12 bg-slate-50/30">
              <div className="overflow-hidden" ref={businessEmblaRef}>
                <div className="flex gap-4 pl-2 pr-8">
                  {businessProducts.map((product, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-64 md:w-60"
                    >
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white h-[420px] hover:-translate-y-1 flex flex-col">
                        
                        {/* Cover Image */}
                         <div className="relative h-64 overflow-hidden">
                          <img 
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          {/* Title Overlay */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white text-lg font-semibold leading-tight">
                              {product.title}
                            </h4>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-3 pt-4">
                          {/* Rate Display */}
                          <div className="bg-gradient-to-r from-blue-50 to-primary/5 rounded-lg px-3 py-2 border border-blue-100">
                            <div className="text-xl font-bold text-primary mb-1">{product.rate}</div>
                            <div className="text-xs text-slate-600 font-medium">{product.rateLabel}</div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 pb-4 flex flex-col flex-1">
                          <p className="text-slate-600 mb-4 leading-relaxed flex-grow text-sm">
                            {product.description}
                          </p>
                          
                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {product.features.slice(0, 2).map((feature, i) => (
                              <div key={i} className="flex items-center text-xs">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                <span className="text-slate-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            <Button asChild variant="outline" size="sm" className="flex-1 border-slate-300 hover:border-primary hover:bg-primary/5 text-xs">
                              <Link to={product.learnLink}>
                                Learn
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-md text-xs">
                              <a href="https://preview--hbf-application.lovable.app/auth">
                                Apply
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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