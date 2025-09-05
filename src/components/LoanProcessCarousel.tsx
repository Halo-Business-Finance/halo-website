import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import LazyImage from "@/components/optimization/LazyImage";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";

const LoanProcessCarousel = () => {
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

        <div className="max-w-6xl mx-auto px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {steps.map((step, index) => (
                <CarouselItem key={step.step} className="pl-2 md:pl-4 min-w-[320px] max-w-[320px]">
                  <div className="w-[320px] h-[500px]">
                    <Card className="group bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 w-full h-full flex flex-col">
                      {/* Step Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
                        <LazyImage
                          src={step.image}
                          alt={`Step ${step.step}: ${step.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Step number overlay */}
                        <div className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 bg-slate-900/90 text-white rounded-full text-lg font-medium">
                          {step.step}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-tight min-h-[56px]">{step.title}</h3>
                          <p className="text-slate-600 leading-relaxed mb-4 min-h-[48px]">{step.description}</p>
                          <p className="text-sm text-slate-500 leading-relaxed min-h-[60px]">{step.detail}</p>
                        </div>
                        
                        {/* Subtle blue accent line */}
                        <div className="w-8 h-0.5 bg-slate-900 mt-6 flex-shrink-0"></div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;