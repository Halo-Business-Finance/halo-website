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
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
            Our Streamlined Loan Process
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We make commercial lending simple with our proven 5-step process that gets you funded faster.
          </p>
        </div>

        {/* Clean JP Morgan Style Carousel */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-16 sm:mb-20 max-w-7xl mx-auto">
          <div className="overflow-hidden p-6 sm:p-8 md:p-10" ref={emblaRef}>
            <div className="flex">
              {steps.map((step, index) => (
                <div key={step.step} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                  <Card className="group bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 mr-4 h-full">
                    <div className="p-6 sm:p-8">
                      {/* Clean step number */}
                      <div className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-full mb-6 text-lg font-medium">
                        {step.step}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-tight">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{step.description}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.detail}</p>
                      
                      {/* Subtle blue accent line */}
                      <div className="w-8 h-0.5 bg-slate-900 mt-6"></div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JP Morgan Style Executive Process Overview */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 sm:p-12 md:p-16 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 mb-4 tracking-tight">
              Executive Process Overview
            </h3>
            <div className="w-12 h-0.5 bg-slate-900 mx-auto mb-6"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our institutional-grade lending process ensures rapid deployment of capital with enterprise-level security
            </p>
          </div>

          {/* Clean Process Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Clean Process Card */}
                <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 sm:p-8 transition-all duration-200 hover:shadow-sm">
                  {/* Clean step number */}
                  <div className="flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full mx-auto mb-6 text-xl font-medium">
                    {step.step}
                  </div>
                  
                  {/* Process Title */}
                  <h4 className="text-slate-900 font-semibold text-lg text-center mb-3 leading-tight">
                    {step.step === 1 && "Select"}
                    {step.step === 2 && "Answer"}
                    {step.step === 3 && "Get"}
                    {step.step === 4 && "Upload"}
                    {step.step === 5 && "Funded"}
                  </h4>
                  
                  {/* Process Description */}
                  <p className="text-slate-600 text-sm text-center leading-relaxed">
                    {step.step === 1 && "Choose your loan program from our comprehensive suite"}
                    {step.step === 2 && "Complete our streamlined application process"}
                    {step.step === 3 && "Receive pre-approval within 24 hours"}
                    {step.step === 4 && "Submit documents through secure portal"}
                    {step.step === 5 && "Get funded with digital closing process"}
                  </p>
                </div>
                
                {/* Clean Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-0.5 bg-slate-300"></div>
                  </div>
                )}
                
                {/* Mobile Connection */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-slate-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Clean Executive Summary */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-light text-slate-900 mb-2">24hrs</div>
                <div className="text-sm text-slate-600">Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-light text-slate-900 mb-2">95%</div>
                <div className="text-sm text-slate-600">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-light text-slate-900 mb-2">$2.5B+</div>
                <div className="text-sm text-slate-600">Loans Funded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-light text-slate-900 mb-2">Bank-Grade</div>
                <div className="text-sm text-slate-600">Security</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;