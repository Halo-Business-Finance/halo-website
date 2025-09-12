import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  FileText, 
  Clock, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight, 
  Lock,
  Network,
  Star,
  Building2,
  Landmark
} from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import howItWorksHeader from "@/assets/how-it-works-header.jpg";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";
import { LoanApprovalChart } from "@/components/charts/LoanApprovalChart";
import { IndustryStatsChart } from "@/components/charts/IndustryStatsChart";
import { ProcessDiagram } from "@/components/charts/ProcessDiagram";
import SuccessShowcase from "@/components/SuccessShowcase";
import loanProcessingTeam from "@/assets/loan-processing-team.jpg";
import successfulLoanHandshake from "@/assets/successful-loan-handshake.jpg";
import loanProcessExplanation from "@/assets/loan-process-explanation.jpg";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={howItWorksHeader} 
          alt="Professional business consultant explaining fintech loan process to clients in modern office meeting room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 text-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-2xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Our streamlined process connects you with the right lenders for your business financing needs. Get pre-qualified and funded quickly through our marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Our Streamlined Loan Process Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Streamlined Loan Process
            </h2>
            <p className="text-xl text-muted-foreground">
              We make commercial lending simple
            </p>
          </div>

          <div className="relative mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {[
                { step: 1, title: "Select Your Loan Program", description: "Choose from our comprehensive range of loan products", image: step1SelectLoan },
                { step: 2, title: "Answer Questions", description: "Complete our simple application about your loan request", image: step2AnswerQuestions },
                { step: 3, title: "Get Pre-Approved", description: "Authorize a soft credit check for instant pre-approval", image: step3PreApproved },
                { step: 4, title: "Upload Financials", description: "Submit your documents to receive competitive term sheets", image: step4UploadFinancials },
                { step: 5, title: "Get Funded", description: "Sign your loan documents and receive your funding", image: step5GetFunded }
              ].map((item, index) => (
                <div key={index} className="relative flex items-stretch h-full">
                  <div className="relative h-52 lg:h-64 rounded-xl overflow-hidden shadow-[var(--shadow-card)] animate-fade-in hover-scale w-full">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 left-4 right-4">
                      <div className="text-2xl font-bold text-white mb-1">Step {item.step}</div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-sm font-bold mb-1">{item.title}</div>
                      <div className="text-xs text-white/90 leading-relaxed">{item.description}</div>
                    </div>
                  </div>
                  
                  {/* Arrow - only show between steps, not after the last one */}
                  {index < 4 && (
                    <div className="hidden md:flex absolute -right-3 lg:-right-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="bg-primary/10 rounded-full p-2 animate-pulse">
                        <ArrowRight className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Text content below process steps */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Fast, Simple, Secure</h3>
            
            {/* Get Started Button */}
            <div className="mb-6">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold animate-fade-in"
                asChild
              >
                <a href="https://preview--hbf-application.lovable.app/auth">
                  <Lock className="h-4 w-4 mr-2" />
                  Get Started
                </a>
              </Button>
            </div>
            
            <p className="text-lg text-muted-foreground">Professional lending process with modern technology</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Why Our Marketplace Works Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Our Marketplace Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform creates a win-win environment where borrowers get better access to capital and lenders connect with qualified opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Network className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Comprehensive Network</h4>
                    <p className="text-muted-foreground">Access to the most extensive network of commercial lenders in the industry, from community banks to major financial institutions.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Competitive Marketplace</h4>
                    <p className="text-muted-foreground">Lenders compete for your business, resulting in better rates, terms, and loan structures tailored to your needs.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Vetted Partners Only</h4>
                    <p className="text-muted-foreground">All lenders undergo rigorous qualification processes including licensing verification, financial stability, and track record review.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Performance Monitoring</h4>
                    <p className="text-muted-foreground">Continuous monitoring of lender performance, customer satisfaction, and loan quality to maintain high standards.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Marketplace?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Access to Multiple Lenders</h4>
                    <p className="text-muted-foreground">Compare offers from our network of qualified lenders</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Fast Pre-Qualification</h4>
                    <p className="text-muted-foreground">Get pre-qualified in minutes without affecting your credit</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Expert Support</h4>
                    <p className="text-muted-foreground">Our team guides you through the entire process</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Competitive Terms</h4>
                    <p className="text-muted-foreground">Find the best rates and terms for your business</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg mb-6">
                <img 
                  src={loanProcessExplanation} 
                  alt="Professional business consultant explaining loan application process step-by-step"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of business owners who have successfully secured financing through our marketplace.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full" size="lg" asChild><a href="https://preview--hbf-application.lovable.app/auth">Start Your Application</a></Button>
                    <Button variant="outline" className="w-full" size="lg" asChild><a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a></Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Halo Business Finance Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Halo Business Finance?
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              We're committed to providing your business with the capital, expertise, and personalized service you need to achieve your growth goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    SBA Loan Expertise
                  </h3>
                  <p className="text-foreground mb-4">
                    Specialized knowledge in SBA 7(a), 504, and Express loans with a proven track record of successful approvals.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Secure & Compliant
                  </h3>
                  <p className="text-foreground mb-4">
                    Bank-level security and full regulatory compliance ensure your business information and transactions are protected.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Security Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Fast Approval Process
                  </h3>
                  <p className="text-foreground mb-4">
                    Streamlined application process with dedicated loan officers providing quick decisions and personalized service.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary" asChild>
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Commercial Lending Focus
                  </h3>
                  <p className="text-foreground mb-4">
                    Exclusive focus on business financing with deep understanding of commercial real estate and equipment needs.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Our Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Landmark className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Dedicated Loan Officers
                  </h3>
                  <p className="text-foreground mb-4">
                    Work directly with experienced commercial lending professionals who understand your industry and business needs.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Meet Our Team
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none group">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Proven Track Record
                  </h3>
                  <p className="text-foreground mb-4">
                    Years of successful business financing with competitive rates and flexible terms tailored to your business.
                  </p>
                </div>
                <Button variant="ghost" className="group/btn text-primary">
                  Success Stories
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Call to action with business image */}
          <div className="text-center mt-16">
                <div className="relative overflow-hidden rounded-2xl max-w-4xl mx-auto">
                  <img 
                    src={successfulLoanHandshake} 
                    alt="Professional business handshake after successful loan approval"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative bg-gradient-to-r from-financial-navy/95 to-primary/90 text-white p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  <img 
                    src={sbaLogo} 
                    alt="SBA & Commercial Loan Marketplace"
                    className="h-12 w-auto"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-2">
                      Ready to Fuel Your Business Growth?
                    </h3>
                    <p className="text-xl text-blue-100 max-w-2xl">
                      Join hundreds of successful businesses who trust Halo Business Finance for their growth capital. Our expertise in <Link to="/sba-loans" className="text-white underline hover:text-blue-100">SBA lending</Link> and SBA & Commercial Loan Marketplace ensures you get the best rates and terms available.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary font-semibold" asChild>
                    <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                  </Button>
                  <ConsultationPopup
                    trigger={
                      <Button size="lg" variant="outline" className="border-white text-primary">
                        Schedule Consultation
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Driven Success Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Data-Driven Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how we're helping businesses across industries with proven results and streamlined processes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <LoanApprovalChart />
            <IndustryStatsChart />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ProcessDiagram />
          </div>
        </div>
      </section>

      <SuccessShowcase />

      <Footer />
    </div>
  );
};

export default HowItWorksPage;