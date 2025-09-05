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
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {steps.map((step, index) => (
                <CarouselItem key={step.step} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 flex-shrink-0">
                  <div className="w-full h-[500px] max-w-[400px] mx-auto">
                    <Card className="group bg-white border border-blue-900 hover:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200 w-full h-full flex flex-col">
                      {/* Step Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
                        <LazyImage
                          src={step.image}
                          alt={`Step ${step.step}: ${step.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between text-left">
                        <div className="flex-1">
                          <div className="mb-3">
                            <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">Step {step.step}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight min-h-[56px] tracking-tight text-left">{step.title}</h3>
                          <div className="w-12 h-px bg-slate-300 mb-4"></div>
                          <p className="text-slate-700 leading-relaxed mb-4 min-h-[48px] font-medium text-left">{step.description}</p>
                          <p className="text-sm text-slate-600 leading-relaxed min-h-[60px] font-normal text-left">{step.detail}</p>
                         </div>
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