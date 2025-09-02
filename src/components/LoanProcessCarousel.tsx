import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Clock, Shield, CreditCard, FileText, Zap } from "lucide-react";
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
      image: step1SelectLoan,
      icon: CreditCard,
      bullets: [
        "15+ loan products available",
        "SBA 7(a), SBA 504, Conventional loans",
        "Equipment financing and working capital",
        "Industry-specific solutions",
        "Competitive rates starting at 5.5%"
      ]
    },
    {
      step: 2,
      title: "Answer Questions",
      description: "Complete our simple application about your loan request",
      image: step2AnswerQuestions,
      icon: FileText,
      bullets: [
        "10-minute streamlined application",
        "Smart form technology",
        "Real-time validation",
        "Mobile-optimized interface",
        "No upfront fees required"
      ]
    },
    {
      step: 3,
      title: "Get Pre-Approved",
      description: "Authorize a soft credit check for instant pre-approval",
      image: step3PreApproved,
      icon: Clock,
      bullets: [
        "24-hour conditional approval",
        "Soft credit check (no impact)",
        "Instant eligibility assessment",
        "Preliminary loan terms",
        "No obligation pre-approval"
      ]
    },
    {
      step: 4,
      title: "Upload Financials",
      description: "Submit your documents to receive competitive term sheets",
      image: step4UploadFinancials,
      icon: Shield,
      bullets: [
        "Bank-level security encryption",
        "Automated document verification",
        "Support for multiple file formats",
        "Secure document portal",
        "Dedicated loan officer assistance"
      ]
    },
    {
      step: 5,
      title: "Get Funded",
      description: "Sign your loan documents and receive your funding",
      image: step5GetFunded,
      icon: Zap,
      bullets: [
        "Digital closing process",
        "Same-day funding available",
        "Electronic document signing",
        "Direct deposit to business account",
        "Ongoing customer support"
      ]
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="relative">
      {/* Corporate Navy Blue Background Section */}
      <div className="bg-gradient-to-br from-financial-navy via-financial-navy-light to-financial-navy relative overflow-hidden">
        {/* Corporate Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-financial-gold/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_50%)] bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.08)_0%,transparent_50%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Corporate Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Professional lending process with modern technology
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              Experience our streamlined approach designed for today's business leaders
            </p>
          </div>

          {/* Enhanced Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side: Main Step Card */}
              <div className="order-2 lg:order-1">
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage 
                      src={steps[activeStep].image} 
                      alt={steps[activeStep].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-financial-navy to-financial-blue rounded-lg p-3">
                        {React.createElement(steps[activeStep].icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-financial-navy/70 tracking-wide uppercase">
                          STEP {steps[activeStep].step}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                          {steps[activeStep].title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                      {steps[activeStep].description}
                    </p>

                    {/* Enhanced Bullet Points */}
                    <div className="space-y-3">
                      {steps[activeStep].bullets.map((bullet, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-financial-blue mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Process Progress</span>
                        <span className="font-semibold">{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 bg-gradient-to-r from-financial-navy to-financial-blue rounded-full transition-all duration-1000"
                          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side: Step Navigation */}
              <div className="order-1 lg:order-2">
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`cursor-pointer transition-all duration-300 rounded-xl p-6 border-2 ${
                        index === activeStep
                          ? 'bg-white/20 border-white/40 backdrop-blur-sm shadow-lg'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg p-3 transition-all duration-300 ${
                          index === activeStep
                            ? 'bg-white text-financial-navy'
                            : 'bg-white/20 text-white'
                        }`}>
                          {React.createElement(step.icon, { className: "h-6 w-6" })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white/70 tracking-wider uppercase">
                              STEP {step.step}
                            </span>
                            {index <= activeStep && (
                              <CheckCircle className="h-4 w-4 text-financial-gold" />
                            )}
                          </div>
                          <h4 className="text-white font-bold text-lg leading-tight">
                            {step.title}
                          </h4>
                          <p className="text-white/80 text-sm mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <ArrowRight className="h-5 w-5 text-white rotate-180" />
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-6 py-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="text-white font-medium text-sm">
                      {isPlaying ? 'Pause' : 'Play'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <ArrowRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Corporate Timeline */}
          <div className="mt-16 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
              <div className="flex items-center justify-center space-x-8 overflow-x-auto">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      onClick={() => setActiveStep(index)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        index <= activeStep 
                          ? 'bg-financial-gold text-financial-navy shadow-lg' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {index < activeStep ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">{step.step}</span>
                      )}
                    </button>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-colors duration-500 ${
                        index < activeStep ? 'bg-financial-gold' : 'bg-white/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanProcessCarousel;