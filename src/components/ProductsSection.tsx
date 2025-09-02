import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Clock, Award, CheckCircle, ArrowRight, Building, CreditCard, Truck, Factory, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "@/components/optimization/LazyImage";
import ConsultationPopup from "@/components/ConsultationPopup";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
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
  ChevronLeft,
  RotateCcw,
  Truck,
  Heart
} from "lucide-react";
import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import financialAdvisorConsultation from "@/assets/financial-advisor-consultation.jpg";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";
import businessConsultationProfessional from "@/assets/business-consultation-professional.jpg";
import loanProcessOverview from "@/assets/loan-process-overview.jpg";
import loanProcessExplanation from "@/assets/loan-process-explanation.jpg";
import loanApprovalCelebration from "@/assets/loan-approval-celebration.jpg";
import loanOfficersWorking from "@/assets/loan-officers-working.jpg";
import successfulLoanHandshake from "@/assets/successful-loan-handshake.jpg";


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
      logo: "/lovable-uploads/d5e250b6-8fb4-450c-bc02-d59e46b43e32.png",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
      title: "USDA Rural Development",
      description: "Rural community development and business growth financing programs.",
      rate: "Prime + 1.5%",
      rateLabel: "Starting Rate",
      features: ["Rural area development focus", "Community economic development", "USDA government backing"],
      learnLink: "/usda-rural-development",
      applyLink: "/sba-loan-application",
      badge: null,
      color: "from-emerald-500 to-emerald-600"
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
      icon: Building2,
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80",
      title: "Commercial Real Estate",
      description: "Purchase, refinance, and develop commercial properties with flexible terms.",
      rate: "5.5%",
      rateLabel: "Starting APR",
      features: ["Owner-occupied properties", "Investment real estate", "Commercial property development"],
      learnLink: "/commercial-loans",
      applyLink: "/commercial-real-estate-application",
      badge: null,
      color: "from-purple-500 to-purple-600"
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
    },
    {
      icon: RotateCcw,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
      title: "Equipment Leasing",
      description: "Lease business equipment with flexible terms and upgrade options.",
      rate: "5.5%",
      rateLabel: "Starting Rate",
      features: ["100% financing with no down payment", "Preserve working capital and credit lines", "Easy equipment upgrades and replacements"],
      learnLink: "/equipment-leasing",
      applyLink: "/equipment-loan-application",
      badge: null,
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Truck,
      image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&q=80",
      title: "Heavy Equipment",
      description: "Specialized financing for construction and industrial heavy equipment.",
      rate: "6.5%",
      rateLabel: "Starting APR",
      features: ["Construction and industrial equipment", "New and used equipment options", "Competitive rates and flexible terms"],
      learnLink: "/heavy-equipment",
      applyLink: "/equipment-loan-application",
      badge: null,
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Heart,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80",
      title: "Medical Equipment",
      description: "Healthcare equipment financing for medical practices and facilities.",
      rate: "5.75%",
      rateLabel: "Starting APR",
      features: ["Medical and healthcare equipment", "Practice expansion financing", "Technology upgrade solutions"],
      learnLink: "/medical-equipment",
      applyLink: "/equipment-loan-application",
      badge: null,
      color: "from-blue-500 to-blue-600"
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
      icon: DollarSign,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
      title: "Debt Financing",
      description: "Traditional debt financing solutions for business growth and expansion.",
      rate: "5.5%",
      rateLabel: "Starting APR",
      features: ["Fixed and variable rate options", "Competitive terms and rates", "Flexible repayment structures"],
      learnLink: "/debt-financing",
      applyLink: "/term-loan-application",
      color: "from-slate-500 to-slate-600"
    },
    {
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80",
      title: "Equity Financing",
      description: "Raise capital through equity investment without taking on debt.",
      rate: "Equity Based",
      rateLabel: "Investment",
      features: ["No monthly payments required", "Shared risk with investors", "Business growth partnership"],
      learnLink: "/equity-financing",
      applyLink: "/term-loan-application",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Factory,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
      title: "Mezzanine Financing",
      description: "Hybrid debt-equity financing for expansion and acquisition opportunities.",
      rate: "8-15%",
      rateLabel: "Return Rate",
      features: ["Debt-equity hybrid structure", "Growth capital for expansion", "Acquisition financing solutions"],
      learnLink: "/mezzanine-financing",
      applyLink: "/term-loan-application",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      title: "Private Placement",
      description: "Private capital placement for qualified businesses seeking growth funding.",
      rate: "Market Rate",
      rateLabel: "Negotiable",
      features: ["Accredited investor access", "Private capital markets", "Customized financing terms"],
      learnLink: "/private-placement",
      applyLink: "/term-loan-application",
      color: "from-purple-600 to-purple-700"
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
  const [activeProductIndex, setActiveProductIndex] = useState(0);

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
      <div className="max-w-8xl mx-auto px-4">{/* Increased from container to max-w-8xl for wider layout */}
        {/* Enhanced Header Section - JPMorgan Style */}
        <div className="text-center mb-20">
          
          {/* Our Streamlined Loan Process Section - Merry-go-round */}
          <LoanProcessCarousel />
          
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
                <a href="https://preview--hbf-application.lovable.app/auth">
                  <Lock className="h-4 w-4 mr-2" />
                  Get Started
                </a>
              </Button>
            </div>
            
            <p className="text-lg text-slate-600">Professional lending process with modern technology</p>
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


        {/* SBA & Commercial Financing */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              SBA & Commercial Financing
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive solutions for your business growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <LazyImage 
                    src={product.image}
                    alt={`${product.title} - Commercial Financing Solution`}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge 
                      className={`absolute top-4 right-4 ${
                        product.badge === "Popular" ? "bg-orange-500 hover:bg-orange-600" :
                        product.badge === "Fast" ? "bg-green-500 hover:bg-green-600" :
                        "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-3">{product.title}</h4>
                  
                  <div className="bg-muted rounded-lg p-3 mb-4">
                    <div className="text-2xl font-bold text-primary">{product.rate}</div>
                    <div className="text-sm text-muted-foreground">{product.rateLabel}</div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={product.learnLink}>Learn More</Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <Link to={product.applyLink}>Apply Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

        {/* Enhanced CTA Section - Moved between carousels */}
        <div className="my-12 relative overflow-hidden rounded-2xl shadow-lg">
          <LazyImage 
            src={financialAdvisorConsultation} 
            alt="Professional financial advisor consultation with business owner"
            className="absolute inset-0 w-full h-full object-cover"
            priority={false}
          />
          <div className="relative bg-financial-navy text-white py-12 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Ready to Fuel Your Business Growth?
              </h3>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Check out our <Link to="/resources" className="text-white underline hover:text-blue-100 font-medium">business financing resources</Link> or read <a href="https://www.score.org/resource/business-loan-guide" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-blue-100 font-medium">SCORE's business loan guide</a> for additional insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 font-semibold px-6 py-3 shadow-lg hover:bg-slate-50 hover:shadow-xl transition-all duration-300">
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    Get Pre-Qualified
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <ConsultationPopup 
                  trigger={
                    <Button size="lg" variant="ghost" className="border-2 border-white text-white px-6 py-3 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                      Schedule Consultation
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
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
          <div className="relative rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
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
            <div className="p-8 md:p-12">
              <div className="overflow-hidden max-w-none w-full" ref={businessEmblaRef}>
                <div className="flex gap-3 md:gap-4 pl-2 pr-12 md:pr-16">
                  {businessProducts.slice(0, 4).map((product, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-64 md:w-72 lg:w-80"
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

      </div>
    </section>
  );
};

export default ProductsSection;