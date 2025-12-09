import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Building2, Truck, Stethoscope, ShoppingBag, Utensils, Factory, 
  ChevronRight, ChevronLeft, DollarSign, Clock, CheckCircle2 
} from 'lucide-react';

// Industry images
import doctorsOfficeConsultation from "@/assets/doctors-office-consultation.jpg";
import restaurantEquipmentFinancing from "@/assets/restaurant-equipment-financing.jpg";
import constructionLoanSuccess from "@/assets/construction-loan-success.jpg";
import apartmentBuildingFinancing from "@/assets/apartment-building-financing.jpg";
import oilEnergyIndustry from "@/assets/oil-energy-industry.jpg";
import transportationLogisticsIndustry from "@/assets/transportation-logistics-industry.jpg";
import retailBusinessFinancing from "@/assets/retail-business-financing.jpg";
import hotelMotelFinancing from "@/assets/hotel-motel-financing.jpg";
import carwashBusinessFinancing from "@/assets/carwash-business-financing.jpg";
import gasStationFinancing from "@/assets/gas-station-financing.jpg";

interface LoanType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  features: string[];
  amount: string;
  timeline: string;
}

const FinancingSolutions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const industries = [
    { image: doctorsOfficeConsultation, title: "Healthcare & Medical", description: "Specialized financing for medical practices, dental offices, and healthcare facilities", loanTypes: ["Equipment financing", "Practice expansion", "Working capital"], ctaText: "Healthcare Loans", ctaLink: "/medical-equipment" },
    { image: restaurantEquipmentFinancing, title: "Restaurant & Food Service", description: "Complete financing solutions for restaurants, cafes, and food service businesses", loanTypes: ["Kitchen equipment", "Restaurant acquisition", "Renovation loans"], ctaText: "Restaurant Financing", ctaLink: "/equipment-financing" },
    { image: constructionLoanSuccess, title: "Construction Financing", description: "Commercial construction loans and development financing for builders and contractors", loanTypes: ["Construction loans", "Equipment financing", "Working capital"], ctaText: "Construction Loans", ctaLink: "/construction-loans" },
    { image: apartmentBuildingFinancing, title: "Multi-Family Financing", description: "Commercial real estate loans for property acquisition and investment projects", loanTypes: ["Property acquisition", "Refinancing", "Portfolio loans"], ctaText: "Real Estate Loans", ctaLink: "/sba-504-loans" },
    { image: oilEnergyIndustry, title: "Oil & Energy Industry", description: "Specialized financing for oil, gas, and renewable energy projects and operations", loanTypes: ["Equipment financing", "Project development", "Working capital"], ctaText: "Energy Financing", ctaLink: "/equipment-financing" },
    { image: transportationLogisticsIndustry, title: "Transportation & Logistics", description: "Financing solutions for trucking companies, freight operations, and logistics businesses", loanTypes: ["Fleet financing", "Equipment loans", "Working capital"], ctaText: "Transportation Loans", ctaLink: "/equipment-financing" },
    { image: retailBusinessFinancing, title: "Retail & E-commerce", description: "Business financing for retail stores, online businesses, and e-commerce operations", loanTypes: ["Inventory financing", "Store expansion", "Working capital"], ctaText: "Retail Financing", ctaLink: "/working-capital" },
    { image: hotelMotelFinancing, title: "Hotel & Motel Industry", description: "Hospitality financing for hotels, motels, and accommodation businesses", loanTypes: ["Property acquisition", "Renovation loans", "Construction loans"], ctaText: "Hospitality Financing", ctaLink: "/sba-504-loans" },
    { image: carwashBusinessFinancing, title: "Car Wash Financing", description: "Financing solutions for car wash businesses, equipment, and facility development", loanTypes: ["Equipment financing", "Facility construction", "Working capital"], ctaText: "Car Wash Financing", ctaLink: "/equipment-financing" },
    { image: gasStationFinancing, title: "Gas Station Financing", description: "Financing for gas stations, fuel operations, and convenience store businesses", loanTypes: ["Property acquisition", "Construction loans", "Working capital"], ctaText: "Gas Station Financing", ctaLink: "/commercial-loans" }
  ];

  const quizIndustries = [
    { id: 'real-estate', label: 'Real Estate', icon: Building2 },
    { id: 'transportation', label: 'Transportation', icon: Truck },
    { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
    { id: 'retail', label: 'Retail', icon: ShoppingBag },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'manufacturing', label: 'Manufacturing', icon: Factory }
  ];

  const amounts = [
    { id: 'small', label: '$25K - $150K', value: 'small' },
    { id: 'medium', label: '$150K - $500K', value: 'medium' },
    { id: 'large', label: '$500K - $2M', value: 'large' },
    { id: 'enterprise', label: '$2M - $25M+', value: 'enterprise' }
  ];

  const loanRecommendations: Record<string, LoanType[]> = {
    'small': [
      { id: 'sba-express', title: 'SBA Express Loan', description: 'Fast approval for smaller loan amounts with flexible terms', icon: DollarSign, link: '/sba-express-loans', features: ['Quick 36-hour approval', 'Up to $500K', 'Lower documentation'], amount: '$25K - $500K', timeline: '1-2 weeks' },
      { id: 'loc', title: 'Business Line of Credit', description: 'Flexible revolving credit for ongoing business needs', icon: CheckCircle2, link: '/business-line-of-credit', features: ['Draw as needed', 'Pay interest only on used funds', 'Reusable credit'], amount: '$10K - $500K', timeline: '3-5 days' }
    ],
    'medium': [
      { id: 'sba-7a', title: 'SBA 7(a) Loan', description: 'Most popular SBA loan for general business purposes', icon: DollarSign, link: '/sba-7a-loans', features: ['Up to $5M', 'Competitive rates', 'Long repayment terms'], amount: '$50K - $5M', timeline: '2-4 weeks' },
      { id: 'equipment', title: 'Equipment Financing', description: 'Finance essential business equipment with the asset as collateral', icon: Factory, link: '/equipment-financing', features: ['100% equipment financing', 'Fixed monthly payments', 'Tax benefits'], amount: '$25K - $5M', timeline: '1-2 weeks' }
    ],
    'large': [
      { id: 'sba-504', title: 'SBA 504 Loan', description: 'Ideal for real estate and major fixed assets', icon: Building2, link: '/sba-504-loans', features: ['Up to $5.5M', 'Low down payment', '25-year terms available'], amount: '$125K - $5.5M', timeline: '4-6 weeks' },
      { id: 'conventional', title: 'Conventional Commercial Loan', description: 'Traditional financing with competitive terms', icon: DollarSign, link: '/conventional-loans', features: ['Flexible terms', 'Various property types', 'Quick closing'], amount: '$250K - $25M', timeline: '2-4 weeks' }
    ],
    'enterprise': [
      { id: 'cmbs', title: 'CMBS Loans', description: 'Commercial mortgage-backed securities for large properties', icon: Building2, link: '/cmbs-loans', features: ['Non-recourse options', 'Large loan amounts', 'Competitive rates'], amount: '$2M - $100M+', timeline: '4-8 weeks' },
      { id: 'bridge', title: 'Bridge Financing', description: 'Short-term financing for time-sensitive opportunities', icon: Clock, link: '/bridge-financing', features: ['Fast closing', 'Flexible terms', 'Interest-only options'], amount: '$500K - $50M+', timeline: '1-2 weeks' }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = Math.max(0, industries.length - 4);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [industries.length]);

  const nextSlide = () => {
    const maxIndex = typeof window !== 'undefined' && window.innerWidth < 768 ? industries.length - 1 : Math.max(0, industries.length - 4);
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const maxIndex = typeof window !== 'undefined' && window.innerWidth < 768 ? industries.length - 1 : Math.max(0, industries.length - 4);
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const getRecommendations = () => {
    if (!selectedAmount) return [];
    return loanRecommendations[selectedAmount] || [];
  };

  const handleNext = () => {
    if (step === 1 && selectedIndustry) setStep(2);
    else if (step === 2 && selectedAmount) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedIndustry(null);
    setSelectedAmount(null);
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Tailored Business Solutions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Industry-Specific Financing Solutions
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            We understand that every industry has unique financing needs. Our specialized loan programs are designed to support businesses across diverse sectors.
          </p>
        </div>

        {/* Industry Carousel */}
        <div className="mb-20">
          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {industries.map((industry, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-3">
                    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border-slate-700 bg-slate-800">
                      <div className="relative h-48 overflow-hidden">
                        <img src={industry.image} alt={industry.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-semibold mb-1">{industry.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-slate-800">
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{industry.description}</p>
                        <ul className="space-y-2 mb-4">
                          {industry.loanTypes.map((type, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                              {type}
                            </li>
                          ))}
                        </ul>
                        <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                          <Link to={industry.ctaLink}>{industry.ctaText}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" size="sm" onClick={prevSlide} className="h-10 w-10 p-0 border-slate-600 text-slate-300 hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextSlide} className="h-10 w-10 p-0 border-slate-600 text-slate-300 hover:bg-slate-800">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {industries.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentIndex(index)} 
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-primary scale-110' : 'bg-slate-600 hover:bg-slate-500'}`} 
                />
              ))}
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out" 
                style={{ transform: `translateX(-${currentIndex * 25}%)` }}
              >
                {industries.map((industry, index) => (
                  <div key={index} className="w-1/4 flex-shrink-0 px-3">
                    <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-slate-700 bg-slate-800">
                      <div className="relative h-48 overflow-hidden">
                        <img src={industry.image} alt={industry.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-semibold mb-1">{industry.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-slate-800">
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{industry.description}</p>
                        <ul className="space-y-2 mb-4">
                          {industry.loanTypes.map((type, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                              {type}
                            </li>
                          ))}
                        </ul>
                        <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                          <Link to={industry.ctaLink}>{industry.ctaText}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-slate-600" />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Find Your Loan</span>
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-600 to-slate-600" />
        </div>

        {/* Loan Quiz */}
        <div className="max-w-3xl mx-auto">
          {step === 1 && (
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Find Your Perfect Loan</h3>
                  <p className="text-slate-300 max-w-2xl text-lg">
                    Answer a few quick questions to get personalized commercial loan recommendations tailored to your business industry.
                  </p>
                </div>
                <CardTitle className="text-xl text-white">What industry is your business in?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quizIndustries.map(industry => (
                    <button 
                      key={industry.id} 
                      onClick={() => setSelectedIndustry(industry.id)} 
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                        selectedIndustry === industry.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-slate-600 hover:border-primary/50 bg-slate-700/50'
                      }`}
                    >
                      <industry.icon className={`h-8 w-8 ${selectedIndustry === industry.id ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="font-medium text-white">{industry.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} disabled={!selectedIndustry} className="bg-primary hover:bg-primary/90 text-white">
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">How much funding do you need?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {amounts.map(amount => (
                    <button 
                      key={amount.id} 
                      onClick={() => setSelectedAmount(amount.value)} 
                      className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                        selectedAmount === amount.value 
                          ? 'border-primary bg-primary/10' 
                          : 'border-slate-600 hover:border-primary/50 bg-slate-700/50'
                      }`}
                    >
                      <DollarSign className={`h-6 w-6 ${selectedAmount === amount.value ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="font-semibold text-white">{amount.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="border-slate-600 text-slate-300 hover:bg-slate-700">Back</Button>
                  <Button onClick={handleNext} disabled={!selectedAmount} className="bg-primary hover:bg-primary/90">
                    See Recommendations <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Recommended Loans for Your Business</h3>
                <p className="text-slate-400">Based on your selections, here are the best financing options:</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {getRecommendations().map(loan => (
                  <Card key={loan.id} className="border-slate-700 bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <loan.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{loan.title}</h4>
                          <p className="text-sm text-slate-400">{loan.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {loan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-slate-400 mb-4 pt-4 border-t border-slate-700">
                        <span>Amount: <strong className="text-white">{loan.amount}</strong></span>
                        <span>Timeline: <strong className="text-white">{loan.timeline}</strong></span>
                      </div>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link to={loan.link}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center pt-6">
                <Button variant="outline" onClick={handleReset} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinancingSolutions;
