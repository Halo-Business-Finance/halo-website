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

        {/* Executive Process Dashboard */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 sm:p-8 max-w-7xl mx-auto border border-slate-200/50 shadow-xl">
          {/* Executive Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Executive Process Dashboard</h3>
            <p className="text-muted-foreground text-sm sm:text-base">Real-time performance metrics and process analytics</p>
          </div>

          {/* Executive KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200/30">
              <div className="text-3xl font-bold text-primary mb-1">96%</div>
              <div className="text-sm text-muted-foreground">Approval Rate</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200/30">
              <div className="text-3xl font-bold text-emerald-600 mb-1">3.2</div>
              <div className="text-sm text-muted-foreground">Avg Days to Fund</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200/30">
              <div className="text-3xl font-bold text-purple-600 mb-1">$2.1B</div>
              <div className="text-sm text-muted-foreground">Capital Deployed</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200/30">
              <div className="text-3xl font-bold text-amber-600 mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">Client Rating</div>
            </div>
          </div>

          {/* Process Flow with Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => {
              const metrics = [
                { completion: "99.2%", avgTime: "8 min", satisfaction: "4.9/5" },
                { completion: "97.8%", avgTime: "12 min", satisfaction: "4.8/5" },
                { completion: "94.5%", avgTime: "18 hrs", satisfaction: "4.9/5" },
                { completion: "91.3%", avgTime: "1.2 days", satisfaction: "4.7/5" },
                { completion: "96.1%", avgTime: "2.8 hrs", satisfaction: "4.9/5" }
              ];

              return (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 group">
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step.step}
                        </div>
                        <div className="text-sm font-semibold text-foreground">{step.title.split(' ')[0]}</div>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                        {metrics[index].completion}
                      </div>
                    </div>

                    {/* Process Details */}
                    <div className="space-y-2 mb-3">
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                      
                      {/* Performance Indicators */}
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Avg Time:</span>
                        <span className="font-medium text-slate-700">{metrics[index].avgTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Rating:</span>
                        <span className="font-medium text-slate-700">{metrics[index].satisfaction}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300 group-hover:from-primary/80 group-hover:to-primary"
                        style={{ width: metrics[index].completion }}
                      ></div>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Executive Summary */}
          <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">15,000+</div>
                <div className="text-sm text-muted-foreground">Businesses Funded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">72 Hours</div>
                <div className="text-sm text-muted-foreground">Fastest Funding Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">98.7%</div>
                <div className="text-sm text-muted-foreground">Customer Retention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;