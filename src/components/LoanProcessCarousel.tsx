import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Pause } from "lucide-react";
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
      image: loanProcessOverview
    },
    {
      step: 2,
      title: "Answer Questions",
      description: "Complete our simple application about your loan request",
      image: loanProcessExplanation
    },
    {
      step: 3,
      title: "Get Pre-Approved",
      description: "Authorize a soft credit check for instant pre-approval",
      image: loanApprovalCelebration
    },
    {
      step: 4,
      title: "Upload Financials",
      description: "Submit your documents to receive competitive term sheets",
      image: loanOfficersWorking
    },
    {
      step: 5,
      title: "Get Funded",
      description: "Sign your loan documents and receive your funding",
      image: successfulLoanHandshake
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const getStepPosition = (index: number) => {
    const position = (index - activeStep + steps.length) % steps.length;
    const angle = (position * 72); // 360/5 = 72 degrees per step
    const radius = 120; // Reduced radius for better fit
    const centerX = 50;
    const centerY = 50;
    
    const radians = (angle * Math.PI) / 180;
    const x = centerX + (radius * Math.cos(radians)) / 2.5; // Adjusted scaling
    const y = centerY + (radius * Math.sin(radians)) / 2.5; // Adjusted scaling
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      scale: position === 0 ? 1.1 : position === 1 || position === 4 ? 0.9 : 0.75,
      zIndex: position === 0 ? 20 : position === 1 || position === 4 ? 10 : 5,
      opacity: position === 0 ? 1 : position === 1 || position === 4 ? 0.8 : 0.6
    };
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h3 className="text-3xl md:text-4xl font-bold">Our Streamlined Loan Process</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-primary/10 hover:bg-primary/20 rounded-full p-3 transition-colors"
          aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-primary" />
          ) : (
            <Play className="h-5 w-5 text-primary" />
          )}
        </button>
      </div>
      
      <p className="text-xl text-slate-600 mb-12 text-center">We make commercial lending simple</p>
      
      {/* Merry-go-round Container */}
      <div className="relative mx-auto w-full max-w-5xl h-[600px] md:h-[700px] overflow-visible bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 shadow-lg">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] rounded-3xl"></div>
        {steps.map((step, index) => {
          const position = getStepPosition(index);
          const isActive = index === activeStep;
          
          return (
            <div
              key={index}
              className="absolute transition-all duration-1000 ease-in-out cursor-pointer"
              style={{
                ...position,
                transform: `translate(-50%, -50%) scale(${position.scale})`,
                zIndex: position.zIndex,
                opacity: position.opacity
              }}
              onClick={() => setActiveStep(index)}
            >
              <Card 
                className={`group overflow-hidden shadow-lg transition-all duration-500 bg-white w-52 md:w-64 ${
                  isActive 
                    ? 'border-2 border-primary shadow-2xl' 
                    : 'border border-slate-300 hover:border-primary hover:shadow-xl'
                }`}
              >
                <div className="relative h-36 md:h-44 overflow-hidden">
                  <LazyImage 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isActive ? 'bg-primary animate-pulse' : 'bg-primary/80'
                    }`}>
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h4 className="text-sm md:text-base font-bold text-shadow line-clamp-2">{step.title}</h4>
                  </div>
                </div>
                
                <CardContent className="p-3 md:p-4">
                  <p className="text-slate-600 leading-relaxed text-xs md:text-sm line-clamp-3">
                    {step.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className={`w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden ${
                    isActive ? 'bg-primary/20' : ''
                  }`}>
                    <div 
                      className={`h-full bg-primary rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Connector Arrow for Active Step */}
              {isActive && index < steps.length - 1 && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 animate-pulse">
                  <div className="bg-primary/20 rounded-full p-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-full flex items-center justify-center shadow-2xl border-4 border-white z-30">
          <div className="text-white font-bold text-center">
            <div className="text-xs uppercase tracking-wide">Step</div>
            <div className="text-2xl font-black">{steps[activeStep].step}</div>
          </div>
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-center mt-8 space-x-3">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeStep 
                ? 'bg-primary scale-125' 
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Active Step Details */}
      <div className="text-center mt-8 max-w-2xl mx-auto">
        <h4 className="text-xl font-bold text-primary mb-2">
          Step {steps[activeStep].step}: {steps[activeStep].title}
        </h4>
        <p className="text-slate-600 text-lg">
          {steps[activeStep].description}
        </p>
      </div>
    </div>
  );
};

export default LoanProcessCarousel;