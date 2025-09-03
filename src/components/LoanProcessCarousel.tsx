import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import LazyImage from "@/components/optimization/LazyImage";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";

const LoanProcessCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    slidesToScroll: 1,
    align: 'start',
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 1 },
      '(min-width: 1024px)': { slidesToScroll: 1 }
    }
  });

  const steps = [
    {
      step: 1,
      title: "Select Your Loan Program",
      description: "Choose from our comprehensive range of loan products",
      detail: "Browse SBA, conventional, and specialized financing options tailored to your business needs.",
      image: step1SelectLoan,
      color: "from-blue-600 to-blue-700"
    },
    {
      step: 2,
      title: "Answer Questions",
      description: "Complete our simple application about your loan request",
      detail: "Our streamlined application takes just 10 minutes to complete with smart form technology.",
      image: step2AnswerQuestions,
      color: "from-emerald-600 to-emerald-700"
    },
    {
      step: 3,
      title: "Get Pre-Approved",
      description: "Authorize a soft credit check for instant pre-approval",
      detail: "Receive conditional approval within 24 hours with no impact to your credit score.",
      image: step3PreApproved,
      color: "from-purple-600 to-purple-700"
    },
    {
      step: 4,
      title: "Upload Financials",
      description: "Submit your documents to receive competitive term sheets",
      detail: "Secure document upload with bank-level encryption and automated verification.",
      image: step4UploadFinancials,
      color: "from-amber-600 to-amber-700"
    },
    {
      step: 5,
      title: "Get Funded",
      description: "Sign your loan documents and receive your funding",
      detail: "Digital closing process with same-day funding for approved applications.",
      image: step5GetFunded,
      color: "from-green-600 to-green-700"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoPlay = () => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    };

    const intervalId = setInterval(autoPlay, 3000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Streamlined Loan Process
          </h2>
          <p className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto px-4">
            We make commercial lending simple with our proven 5-step process that gets you funded faster.
          </p>
        </div>

        {/* Carousel - Mobile shows 1 step, Tablet shows 2 steps, Desktop shows 3 steps */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/30 shadow-lg mb-8 sm:mb-12 max-w-6xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {steps.map((step, index) => (
                <div key={step.step} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                  <Card className="group overflow-hidden border-2 border-slate-300 hover:border-primary shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white mr-4">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <LazyImage 
                        src={step.image} 
                        alt={step.title}
                        width={300}
                        height={192}
                        quality={75}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-primary rounded px-2 py-1 shadow-sm">
                            <span className="text-white font-semibold text-sm tracking-wide">{step.step}</span>
                          </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-shadow leading-tight">{step.title}</h3>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                      <p className="text-slate-600 leading-relaxed mb-3 text-sm sm:text-base">{step.description}</p>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-3">{step.detail}</p>
                      
                      {/* Subtle accent line */}
                      <div className="w-12 h-0.5 bg-primary rounded-full mt-auto group-hover:w-full transition-all duration-300"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corporate Executive Process Overview */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-12 max-w-6xl mx-auto border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Premium background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent mb-3">
                Executive Process Overview
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mb-4"></div>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Our institutional-grade lending process ensures rapid deployment of capital with enterprise-level security
              </p>
            </div>

            {/* Corporate Process Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Process Card */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-600/30 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                    {/* Step Number with Corporate Styling */}
                    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
                      <span className="text-white font-bold text-lg sm:text-xl">{step.step}</span>
                    </div>
                    
                    {/* Process Title */}
                    <h4 className="text-white font-semibold text-sm sm:text-base text-center mb-2 leading-tight">
                      {step.step === 1 && "Program Selection"}
                      {step.step === 2 && "Application Intake"}
                      {step.step === 3 && "Pre-Qualification"}
                      {step.step === 4 && "Document Processing"}
                      {step.step === 5 && "Capital Deployment"}
                    </h4>
                    
                    {/* Process Description */}
                    <p className="text-slate-300 text-xs sm:text-sm text-center leading-relaxed opacity-90">
                      {step.step === 1 && "Curated financing solutions"}
                      {step.step === 2 && "Intelligent data capture"}
                      {step.step === 3 && "Rapid credit assessment"}
                      {step.step === 4 && "Secure verification"}
                      {step.step === 5 && "Immediate funding"}
                    </p>
                    
                    {/* Corporate Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 rounded-b-2xl"></div>
                  </div>
                  
                  {/* Connection Indicator - Corporate Style */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 relative">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Mobile Connection */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-2">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-primary to-primary/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Executive Summary Bar */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary mb-1">24hrs</div>
                  <div className="text-xs sm:text-sm text-slate-400">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary mb-1">95%</div>
                  <div className="text-xs sm:text-sm text-slate-400">Approval Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary mb-1">$2.5B+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Loans Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary mb-1">Bank-Grade</div>
                  <div className="text-xs sm:text-sm text-slate-400">Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;