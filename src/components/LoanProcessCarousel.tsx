import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";
import loanProcessOverview from "@/assets/loan-process-overview.jpg";
import loanProcessExplanation from "@/assets/loan-process-explanation.jpg";
import loanApprovalCelebration from "@/assets/loan-approval-celebration.jpg";
import loanOfficersWorking from "@/assets/loan-officers-working.jpg";
import successfulLoanHandshake from "@/assets/successful-loan-handshake.jpg";

const LoanProcessCarousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      step: 1,
      title: "Select Your Loan Program",
      description: "Choose from our comprehensive range of loan products",
      detail: "Browse SBA, conventional, and specialized financing options tailored to your business needs.",
      image: loanProcessOverview,
      color: "from-blue-600 to-blue-700"
    },
    {
      step: 2,
      title: "Answer Questions",
      description: "Complete our simple application about your loan request",
      detail: "Our streamlined application takes just 10 minutes to complete with smart form technology.",
      image: loanProcessExplanation,
      color: "from-emerald-600 to-emerald-700"
    },
    {
      step: 3,
      title: "Get Pre-Approved",
      description: "Authorize a soft credit check for instant pre-approval",
      detail: "Receive conditional approval within 24 hours with no impact to your credit score.",
      image: loanApprovalCelebration,
      color: "from-purple-600 to-purple-700"
    },
    {
      step: 4,
      title: "Upload Financials",
      description: "Submit your documents to receive competitive term sheets",
      detail: "Secure document upload with bank-level encryption and automated verification.",
      image: loanOfficersWorking,
      color: "from-amber-600 to-amber-700"
    },
    {
      step: 5,
      title: "Get Funded",
      description: "Sign your loan documents and receive your funding",
      detail: "Digital closing process with same-day funding for approved applications.",
      image: successfulLoanHandshake,
      color: "from-green-600 to-green-700"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Our Streamlined Loan Process
        </h3>
        <p className="text-xl text-slate-600">We make commercial lending simple</p>
      </div>

      {/* Premium 3D Perspective Carousel */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Background with perspective */}
        <div className="relative h-[500px] md:h-[600px] perspective-1000">
          
          {/* Main Feature Card */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <Card className="w-80 md:w-96 h-[400px] md:h-[480px] overflow-hidden shadow-2xl border-2 border-primary/20">
              <div className="relative h-48 md:h-56 overflow-hidden">
                <LazyImage 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Step badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                    <span className="text-white font-bold">Step {steps[activeStep].step}</span>
                  </div>
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white text-xl md:text-2xl font-bold leading-tight">
                    {steps[activeStep].title}
                  </h4>
                </div>
              </div>
              
              <CardContent className="p-6 h-[152px] md:h-[224px] flex flex-col justify-between">
                <div>
                  <p className="text-slate-700 text-lg leading-relaxed mb-4">
                    {steps[activeStep].description}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {steps[activeStep].detail}
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 bg-gradient-to-r ${steps[activeStep].color} rounded-full transition-all duration-1000`}
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Cards with 3D perspective */}
          {steps.map((step, index) => {
            if (index === activeStep) return null;
            
            const isNext = (index === (activeStep + 1) % steps.length);
            const isPrev = (index === (activeStep - 1 + steps.length) % steps.length);
            
            if (!isNext && !isPrev) return null;
            
            return (
              <div
                key={index}
                className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-700 cursor-pointer z-10 ${
                  isNext 
                    ? 'right-4 md:right-8 translate-x-4 rotate-y-12' 
                    : 'left-4 md:left-8 -translate-x-4 -rotate-y-12'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <Card className="w-64 h-80 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 opacity-75 hover:opacity-100 scale-75 hover:scale-80">
                  <div className="relative h-32 overflow-hidden">
                    <LazyImage 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-sm font-semibold">
                        Step {step.step}: {step.title}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-slate-600 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Navigation arrows */}
          <button
            onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30"
          >
            <ArrowRight className="h-6 w-6 text-slate-700 rotate-180" />
          </button>
          
          <button
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30"
          >
            <ArrowRight className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        {/* Timeline at bottom */}
        <div className="mt-12 flex justify-center items-center space-x-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setActiveStep(index)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  index <= activeStep 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}
              >
                {index < activeStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="font-bold">{step.step}</span>
                )}
                
                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap">
                  {step.title.split(' ')[0]}
                </div>
              </button>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 transition-colors duration-500 ${
                  index < activeStep ? 'bg-primary' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanProcessCarousel;