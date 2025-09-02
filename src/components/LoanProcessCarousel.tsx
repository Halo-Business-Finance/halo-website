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
  const [activeStep, setActiveStep] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

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
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [steps.length]);

  const scrollPrev = useCallback(() => {
    setActiveStep((activeStep - 1 + steps.length) % steps.length);
  }, [activeStep, steps.length]);

  const scrollNext = useCallback(() => {
    setActiveStep((activeStep + 1) % steps.length);
  }, [activeStep, steps.length]);

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

        {/* Elegant Carousel Section */}
        <div className="relative mb-12 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/30 shadow-lg">
          
          {/* Enhanced Corporate Main Feature Card */}
          <div className="flex justify-center mb-8">
            <Card className="group overflow-hidden border-2 border-slate-300 hover:border-primary shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white w-full max-w-md">
              <div className="relative h-56 overflow-hidden">
                <LazyImage 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title}
                  width={400}
                  height={224}
                  quality={75}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary rounded-lg px-3 py-1.5 shadow-sm">
                      <span className="text-white font-semibold text-xs tracking-wide">STEP {steps[activeStep].step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-shadow">{steps[activeStep].title}</h3>
                </div>
              </div>
              
              <CardContent className="p-6 flex-1 flex flex-col">
                <p className="text-slate-600 leading-relaxed mb-3">{steps[activeStep].description}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{steps[activeStep].detail}</p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 bg-primary rounded-full transition-all duration-1000 shadow-sm`}
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Subtle accent line */}
                <div className="w-12 h-1 bg-primary rounded-full mt-4 group-hover:w-full transition-all duration-300"></div>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Navigation Arrows */}
          <button
            onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-30"
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>
          
          <button
            onClick={() => setActiveStep((activeStep + 1) % steps.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-30"
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="h-6 w-6 text-slate-700" />
          </button>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === activeStep ? 'bg-primary' : 'bg-slate-300 hover:bg-primary'
                }`}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>

        {/* Corporate Timeline at Bottom */}
        <div className="bg-slate-50 rounded-2xl p-8 max-w-4xl mx-auto border border-slate-200/50 shadow-lg">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto pb-4 w-full justify-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center shrink-0">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 shadow-sm ${
                    index <= activeStep 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                >
                  {index < activeStep ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="font-bold text-sm sm:text-base">{step.step}</span>
                  )}
                  
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
                </button>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-4 sm:w-16 h-0.5 mx-0.5 sm:mx-2 transition-colors duration-500 ${
                    index < activeStep ? 'bg-primary' : 'bg-slate-300'
                  }`} />
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