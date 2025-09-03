import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Streamlined Loan Process
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            We make commercial lending simple with our proven 5-step process that gets you funded faster.
          </p>
        </div>

        {/* All Five Steps Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/30 shadow-lg mb-12">
          
          {/* Five Step Cards */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <Card key={step.step} className="group overflow-hidden border-2 border-slate-300 hover:border-primary shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white min-w-0">
                <div className="relative h-32 overflow-hidden">
                  <LazyImage 
                    src={step.image} 
                    alt={step.title}
                    width={200}
                    height={128}
                    quality={75}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="bg-primary rounded px-1.5 py-0.5 shadow-sm">
                        <span className="text-white font-semibold text-xs tracking-wide">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-shadow leading-tight truncate">{step.title}</h3>
                  </div>
                </div>
                
                <CardContent className="p-3 flex-1 flex flex-col">
                  <p className="text-slate-600 leading-relaxed mb-2 text-xs line-clamp-2">{step.description}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2 line-clamp-2">{step.detail}</p>
                  
                  {/* Subtle accent line */}
                  <div className="w-8 h-0.5 bg-primary rounded-full mt-auto group-hover:w-full transition-all duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Complete Process Timeline */}
        <div className="bg-slate-50 rounded-2xl p-8 max-w-5xl mx-auto border border-slate-200/50 shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-6 text-foreground">Complete Process Overview</h3>
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto pb-4 w-full justify-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center shrink-0">
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 shadow-sm bg-primary text-white">
                  <span className="font-bold text-sm sm:text-base">{step.step}</span>
                  
                  {/* Label */}
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap text-center">
                    <span className="block sm:hidden">
                      {step.step === 1 && "Select"}
                      {step.step === 2 && "Answer"}
                      {step.step === 3 && "Get Pre-approved"}
                      {step.step === 4 && "Upload"}
                      {step.step === 5 && "Get Funded"}
                    </span>
                    <span className="hidden sm:block">
                      {step.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="w-4 sm:w-16 h-0.5 mx-0.5 sm:mx-2 bg-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;