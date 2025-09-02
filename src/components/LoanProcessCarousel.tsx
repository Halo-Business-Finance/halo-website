import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import LazyImage from "@/components/optimization/LazyImage";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";

const LoanProcessCarousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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

  // Auto-rotate carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="mb-8 bg-financial-navy py-12 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Corporate Header with Navy Background */}
      <div className="text-center mb-4 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          Our Streamlined Loan Process
        </h3>
        <p className="text-lg text-white/90 font-medium">We make commercial lending simple</p>
      </div>

      {/* Corporate Mobile-First Responsive Carousel */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Background with Navy Corporate Styling */}
        <div className="relative h-[450px] sm:h-[500px] md:h-[600px] perspective-1000 px-4 sm:px-0 bg-financial-navy rounded-2xl shadow-xl">
          
          {/* Decorative Corporate Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
          
          {/* Enhanced Corporate Main Feature Card */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <Card className="w-[320px] sm:w-80 md:w-96 h-[380px] sm:h-[400px] md:h-[480px] overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm">
              <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <LazyImage 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4 sm:p-6 h-[140px] sm:h-[152px] md:h-[224px] flex flex-col justify-between bg-white">
                <div>
                  {/* Corporate Step Badge and Title */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-left">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-sm rounded-lg px-3 py-1.5 shrink-0 shadow-sm">
                      <span className="text-white font-semibold text-xs tracking-wide">STEP {steps[activeStep].step}</span>
                    </div>
                    <h4 className="text-gray-900 text-base sm:text-lg md:text-xl font-bold leading-tight text-left tracking-tight">
                      {steps[activeStep].title}
                    </h4>
                  </div>
                  
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3 text-left font-medium">
                    {steps[activeStep].description}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed text-left hidden sm:block">
                    {steps[activeStep].detail}
                  </p>
                </div>
                
                {/* Corporate Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-1000 shadow-sm`}
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Corporate Side Cards */}
          <div className="hidden md:block">
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
                      ? 'right-4 lg:right-8 translate-x-4 rotate-y-12' 
                      : 'left-4 lg:left-8 -translate-x-4 -rotate-y-12'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <Card className="w-56 lg:w-64 h-72 lg:h-80 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 opacity-75 hover:opacity-100 scale-75 hover:scale-80 bg-white/90 backdrop-blur-sm">
                    <div className="relative h-28 lg:h-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <LazyImage 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-gray-800 text-sm font-semibold bg-white/90 backdrop-blur-sm rounded px-2 py-1">
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
          </div>

          {/* Corporate Navigation Arrows */}
          <button
            onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
            className="absolute left-2 sm:left-4 md:left-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 touch-manipulation backdrop-blur-sm"
          >
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 rotate-180" />
          </button>
          
          <button
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
            className="absolute right-2 sm:right-4 md:right-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-30 touch-manipulation backdrop-blur-sm"
          >
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>
        </div>

        {/* Corporate Timeline at Bottom with Navy Background */}
        <div className="mt-8 sm:mt-12 flex justify-center items-center px-2 sm:px-4">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto pb-8 w-full justify-center bg-financial-navy/50 backdrop-blur-sm rounded-2xl py-6 shadow-sm">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center shrink-0">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 shadow-sm ${
                    index <= activeStep 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  {index < activeStep ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="font-bold text-sm sm:text-base">{step.step}</span>
                  )}
                  
                  {/* Label - Better mobile display with proper titles */}
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/80 whitespace-nowrap text-center">
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
                </button>
                
                {/* Corporate Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-4 sm:w-16 h-0.5 mx-0.5 sm:mx-2 transition-colors duration-500 ${
                    index < activeStep ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-white/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanProcessCarousel;