import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import LazyImage from "@/components/optimization/LazyImage";
import { CheckCircle, Clock, FileText, CreditCard, DollarSign, ArrowRight } from "lucide-react";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";

const LoanProcessCarousel = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Select Your Loan Program",
      description: "Choose from our comprehensive range of loan products",
      detail: "Browse SBA, conventional, and specialized financing options tailored to your business needs.",
      image: step1SelectLoan,
      icon: FileText,
      color: "bg-blue-500",
      time: "2 min"
    },
    {
      step: 2,
      title: "Answer Questions",
      description: "Complete our simple application about your loan request",
      detail: "Our streamlined application takes just 10 minutes to complete with smart form technology.",
      image: step2AnswerQuestions,
      icon: CreditCard,
      color: "bg-emerald-500",
      time: "10 min"
    },
    {
      step: 3,
      title: "Get Pre-Approved",
      description: "Authorize a soft credit check for instant pre-approval",
      detail: "Receive conditional approval within 24 hours with no impact to your credit score.",
      image: step3PreApproved,
      icon: CheckCircle,
      color: "bg-purple-500",
      time: "24 hrs"
    },
    {
      step: 4,
      title: "Upload Financials",
      description: "Submit your documents to receive competitive term sheets",
      detail: "Secure document upload with bank-level encryption and automated verification.",
      image: step4UploadFinancials,
      icon: FileText,
      color: "bg-amber-500",
      time: "1-2 days"
    },
    {
      step: 5,
      title: "Get Funded",
      description: "Sign your loan documents and receive your funding",
      detail: "Digital closing process with same-day funding for approved applications.",
      image: step5GetFunded,
      icon: DollarSign,
      color: "bg-green-500",
      time: "Same day"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Simple 5-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Our Streamlined Loan Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We make commercial lending simple. Get funded in as little as 5 business days.
          </p>
        </div>

        {/* Interactive Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12 hidden md:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((activeStep - 1) / 4) * 100}%` }}
              />
            </div>
            
            {/* Step Buttons */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`flex flex-col items-center group transition-all duration-300 ${
                    activeStep === step.step ? 'scale-110' : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 ${
                      step.step <= activeStep 
                        ? step.color 
                        : 'bg-slate-300'
                    } ${activeStep === step.step ? 'ring-4 ring-primary/20' : ''}`}
                  >
                    {step.step < activeStep ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.step
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium transition-colors ${
                    activeStep === step.step ? 'text-primary' : 'text-slate-500'
                  }`}>
                    {step.title.split(' ')[0]}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Step Detail - Desktop */}
        <div className="max-w-4xl mx-auto mb-12 hidden md:block">
          {steps.filter(s => s.step === activeStep).map((step) => (
            <Card key={step.step} className="overflow-hidden border-border/50 shadow-xl animate-fade-in">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <LazyImage
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`${step.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      Step {step.step}
                    </span>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className={`inline-flex w-12 h-12 ${step.color} rounded-lg items-center justify-center mb-4`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-lg text-slate-700 mb-2">{step.description}</p>
                  <p className="text-slate-500 mb-6">{step.detail}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: <strong className="text-slate-700">{step.time}</strong></span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden" style={{ contain: 'layout style paint' }}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {steps.map((step) => (
                <CarouselItem key={step.step} className="pl-2 basis-[85%]">
                  <Card className="group bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <LazyImage
                        src={step.image}
                        alt={`Step ${step.step}: ${step.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`${step.color} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                          Step {step.step}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="h-5 w-5 text-primary" />
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.time}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="https://app.halolending.com"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Application
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessCarousel;