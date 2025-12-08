import React, { useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Truck, Stethoscope, ShoppingBag, Utensils, Factory, ChevronRight, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
const IndustryShowcase = lazy(() => import("@/components/IndustryShowcase"));
interface LoanType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  features: string[];
  amount: string;
  timeline: string;
}
const LoanQuiz = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const industries = [{
    id: 'real-estate',
    label: 'Real Estate',
    icon: Building2
  }, {
    id: 'transportation',
    label: 'Transportation',
    icon: Truck
  }, {
    id: 'healthcare',
    label: 'Healthcare',
    icon: Stethoscope
  }, {
    id: 'retail',
    label: 'Retail',
    icon: ShoppingBag
  }, {
    id: 'restaurant',
    label: 'Restaurant',
    icon: Utensils
  }, {
    id: 'manufacturing',
    label: 'Manufacturing',
    icon: Factory
  }];
  const amounts = [{
    id: 'small',
    label: '$25K - $150K',
    value: 'small'
  }, {
    id: 'medium',
    label: '$150K - $500K',
    value: 'medium'
  }, {
    id: 'large',
    label: '$500K - $2M',
    value: 'large'
  }, {
    id: 'enterprise',
    label: '$2M - $25M+',
    value: 'enterprise'
  }];
  const loanRecommendations: Record<string, LoanType[]> = {
    'small': [{
      id: 'sba-express',
      title: 'SBA Express Loan',
      description: 'Fast approval for smaller loan amounts with flexible terms',
      icon: DollarSign,
      link: '/sba-express-loans',
      features: ['Quick 36-hour approval', 'Up to $500K', 'Lower documentation'],
      amount: '$25K - $500K',
      timeline: '1-2 weeks'
    }, {
      id: 'loc',
      title: 'Business Line of Credit',
      description: 'Flexible revolving credit for ongoing business needs',
      icon: CheckCircle2,
      link: '/business-line-of-credit',
      features: ['Draw as needed', 'Pay interest only on used funds', 'Reusable credit'],
      amount: '$10K - $500K',
      timeline: '3-5 days'
    }],
    'medium': [{
      id: 'sba-7a',
      title: 'SBA 7(a) Loan',
      description: 'Most popular SBA loan for general business purposes',
      icon: DollarSign,
      link: '/sba-7a-loans',
      features: ['Up to $5M', 'Competitive rates', 'Long repayment terms'],
      amount: '$50K - $5M',
      timeline: '2-4 weeks'
    }, {
      id: 'equipment',
      title: 'Equipment Financing',
      description: 'Finance essential business equipment with the asset as collateral',
      icon: Factory,
      link: '/equipment-financing',
      features: ['100% equipment financing', 'Fixed monthly payments', 'Tax benefits'],
      amount: '$25K - $5M',
      timeline: '1-2 weeks'
    }],
    'large': [{
      id: 'sba-504',
      title: 'SBA 504 Loan',
      description: 'Ideal for real estate and major fixed assets',
      icon: Building2,
      link: '/sba-504-loans',
      features: ['Up to $5.5M', 'Low down payment', '25-year terms available'],
      amount: '$125K - $5.5M',
      timeline: '4-6 weeks'
    }, {
      id: 'conventional',
      title: 'Conventional Commercial Loan',
      description: 'Traditional financing with competitive terms',
      icon: DollarSign,
      link: '/conventional-loans',
      features: ['Flexible terms', 'Various property types', 'Quick closing'],
      amount: '$250K - $25M',
      timeline: '2-4 weeks'
    }],
    'enterprise': [{
      id: 'cmbs',
      title: 'CMBS Loans',
      description: 'Commercial mortgage-backed securities for large properties',
      icon: Building2,
      link: '/cmbs-loans',
      features: ['Non-recourse options', 'Large loan amounts', 'Competitive rates'],
      amount: '$2M - $100M+',
      timeline: '4-8 weeks'
    }, {
      id: 'bridge',
      title: 'Bridge Financing',
      description: 'Short-term financing for time-sensitive opportunities',
      icon: Clock,
      link: '/bridge-financing',
      features: ['Fast closing', 'Flexible terms', 'Interest-only options'],
      amount: '$500K - $50M+',
      timeline: '1-2 weeks'
    }]
  };
  const getRecommendations = () => {
    if (!selectedAmount) return [];
    return loanRecommendations[selectedAmount] || [];
  };
  const handleNext = () => {
    if (step === 1 && selectedIndustry) {
      setStep(2);
    } else if (step === 2 && selectedAmount) {
      setStep(3);
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleReset = () => {
    setStep(1);
    setSelectedIndustry(null);
    setSelectedAmount(null);
  };
  return <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 bg-white">
        {/* Industry Showcase */}
        <Suspense fallback={<div className="h-60 bg-muted animate-pulse rounded-md mx-4 mb-8" />}>
          <IndustryShowcase />
        </Suspense>

        <div className="max-w-3xl mx-auto">
          {/* Step 1: Industry Selection */}
          {step === 1 && <Card className="border-border/50 bg-white">
              <CardHeader>
                <div className="">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-justify">
                    Find Your Perfect Loan
                  </h2>
                  <p className="text-muted-foreground max-w-2xl text-left">
                    Answer a few quick questions to get personalized commercial loan recommendations tailored to your business industry.
                  </p>
                </div>
                <CardTitle className="text-xl">What industry is your business in?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {industries.map(industry => <button key={industry.id} onClick={() => setSelectedIndustry(industry.id)} className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${selectedIndustry === industry.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <industry.icon className={`h-8 w-8 ${selectedIndustry === industry.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-foreground">{industry.label}</span>
                    </button>)}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} disabled={!selectedIndustry}>
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>}

          {/* Step 2: Amount Selection */}
          {step === 2 && <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">How much funding do you need?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {amounts.map(amount => <button key={amount.id} onClick={() => setSelectedAmount(amount.value)} className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${selectedAmount === amount.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <DollarSign className={`h-6 w-6 ${selectedAmount === amount.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-foreground">{amount.label}</span>
                    </button>)}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext} disabled={!selectedAmount}>
                    See Recommendations <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>}

          {/* Step 3: Results */}
          {step === 3 && <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Recommended Loans for Your Business
                </h3>
                <p className="text-muted-foreground">
                  Based on your selections, here are the best financing options:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {getRecommendations().map(loan => <Card key={loan.id} className="border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <loan.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{loan.title}</h4>
                          <p className="text-sm text-muted-foreground">{loan.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {loan.features.map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-foreground">{feature}</span>
                          </div>)}
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground mb-4 pt-4 border-t border-border">
                        <span>Amount: <strong className="text-foreground">{loan.amount}</strong></span>
                        <span>Timeline: <strong className="text-foreground">{loan.timeline}</strong></span>
                      </div>

                      <Button asChild className="w-full">
                        <Link to={loan.link}>Learn More</Link>
                      </Button>
                    </CardContent>
                  </Card>)}
              </div>

              <div className="text-center pt-6">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
              </div>
            </div>}
        </div>
      </div>
    </section>;
};
export default LoanQuiz;