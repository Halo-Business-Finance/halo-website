import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  FileText, 
  Clock, 
  DollarSign, 
  Building,
  Star,
  Zap,
  Target,
  Lock,
  ArrowRight,
  Building2,
  Landmark
} from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";

import loanConsultation from "@/assets/loan-consultation.jpg";
import businessGrowth from "@/assets/business-growth.jpg";
import sbaLogo from "@/assets/sba-logo.jpg";
import missionProfessionals from "@/assets/mission-professionals.jpg";
import ethicsProfessionals from "@/assets/ethics-professionals.jpg";
import transparencyProfessionals from "@/assets/transparency-professionals.jpg";
import clientFirstProfessionals from "@/assets/client-first-professionals.jpg";
import innovationProfessionals from "@/assets/innovation-professionals.jpg";
import expertiseProfessionals from "@/assets/expertise-professionals.jpg";
import resultsProfessionals from "@/assets/results-professionals.jpg";
import securityProfessionals from "@/assets/security-professionals.jpg";
import officeWorkspace from "@/assets/office-workspace.jpg";
import licensesProfessionals from "@/assets/licenses-professionals.jpg";
import complianceProfessionals from "@/assets/compliance-professionals.jpg";
import nmlsProfessionals from "@/assets/nmls-professionals.jpg";
import sbaProfessionals from "@/assets/sba-professionals.jpg";
import bbbProfessionals from "@/assets/bbb-professionals.jpg";
import associationsProfessionals from "@/assets/associations-professionals.jpg";
import marketplaceUser from "@/assets/marketplace-user.jpg";
import step1SelectLoan from "@/assets/step1-select-loan.jpg";
import step2AnswerQuestions from "@/assets/step2-answer-questions.jpg";
import step3PreApproved from "@/assets/step3-pre-approved.jpg";
import step4UploadFinancials from "@/assets/step4-upload-financials.jpg";
import step5GetFunded from "@/assets/step5-get-funded.jpg";
import loanProcessOverview from "@/assets/loan-process-overview.jpg";
import fintechLoanMarketplace from "@/assets/fintech-loan-marketplace.jpg";

const CompanyOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src={officeWorkspace}
          alt="Professional office workspace representing company overview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              About Halo Business Finance
            </h1>
            <p className="text-lg md:text-2xl mb-8 opacity-90">
              Nationwide SBA, Commercial and Equipment Loan Marketplace
            </p>
            <p className="text-lg opacity-80">
              Our commercial loan marketplace offers a streamlined loan process without 
              the hassle of looking for the best interest rate or the right lender.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-4xl font-bold mb-4">
              Our Streamlined Loan Process
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              We make commercial lending simple
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: 1, title: "Select Your Loan Program", description: "Choose from our comprehensive range of loan products", image: step1SelectLoan },
                { step: 2, title: "Answer Questions", description: "Complete our simple application about your loan request", image: step2AnswerQuestions },
                { step: 3, title: "Get Pre-Approved", description: "Authorize a soft credit check for instant pre-approval", image: step3PreApproved },
                { step: 4, title: "Upload Financials", description: "Submit your documents to receive competitive term sheets", image: step4UploadFinancials },
                { step: 5, title: "Get Funded", description: "Sign your loan documents and receive your funding", image: step5GetFunded }
              ].map((item, index) => (
                <div key={index} className="relative flex items-stretch h-full">
                  <Card className="text-center p-6 animate-fade-in hover-scale w-full flex flex-col">
                    <CardContent className="p-0">
                      <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-4">Step {item.step}</div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow - only show between steps, not after the last one */}
                  {index < 4 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
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
                onClick={() => window.open('/halo-application', '_blank')}
              >
                <Lock className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
            
            <p className="text-lg text-muted-foreground">Professional lending process with modern technology</p>
          </div>
        </div>
      </section>

      {/* Marketplace & Lending Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Marketplace Platform</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Halo Business Finance operates a sophisticated marketplace platform that connects 
                  businesses with a network of trusted lenders, ensuring you get the best rates 
                  and terms for your commercial financing needs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Access to 150+ vetted commercial lenders nationwide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">AI-powered matching technology for optimal loan terms</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real-time rate comparison and pre-approval process</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Streamlined application with single point of contact</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Landmark className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Lending Partners</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  We've carefully selected and partnered with top-tier financial institutions, 
                  credit unions, and alternative lenders to provide diverse financing options 
                  that meet the unique needs of businesses across all industries.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Regional and national banks with competitive rates</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">SBA & Commercial Loan Marketplace for government-backed loans</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Alternative lenders for flexible financing solutions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Specialized equipment and real estate financing partners</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketplace Benefits Stats */}
          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <p className="text-sm text-muted-foreground">Lending Partners</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">1,500+</div>
              <p className="text-sm text-muted-foreground">Businesses Funded</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Approval Rate</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">48hrs</div>
              <p className="text-sm text-muted-foreground">Average Response Time</p>
          </div>
          
          {/* Action Button after Marketplace & Lending Partners */}
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
              onClick={() => window.open('/contact-us', '_blank')}
            >
              Contact Our Team
            </Button>
          </div>
        </div>
        </div>
      </section>


      {/* Marketplace Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-4xl font-bold mb-4">
              Our Marketplace Benefits
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Our commercial loan marketplace helps borrowers get the best interest rate 
              without the hassle of looking for a lender.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Simple Loan Application",
                description: "Our loan application process is quick, easy and hassle-free"
              },
              {
                icon: TrendingUp,
                title: "Fast Approval Process",
                description: "Get approved quickly with our streamlined loan process"
              },
              {
                icon: Award,
                title: "Competitive Rates",
                description: "Get the most competitive interest rate in the market"
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Our loan specialists will guide you through the loan process"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Second set of Action Buttons after Marketplace Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              onClick={() => window.open('/sba-loans', '_blank')}
            >
              Explore SBA Loans
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
              onClick={() => window.open('/marketplace-benefits', '_blank')}
            >
              Learn More Benefits
            </Button>
          </div>
        </div>
      </section>

      {/* Commercial Real Estate Focus */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-12 w-12 text-primary" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Nationwide Commercial Real Estate Loans
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Our commercial loan marketplace can help you find the best interest rate 
                    without wasting time looking for a bank or lender.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-1 gap-4 mb-8">
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Purchase Loans</h3>
                    <p className="text-sm text-muted-foreground">Finance your commercial property acquisition</p>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Refinance Loans</h3>
                    <p className="text-sm text-muted-foreground">Optimize your existing commercial property financing</p>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Construction Loans</h3>
                    <p className="text-sm text-muted-foreground">Fund your commercial development projects</p>
                  </CardContent>
                </Card>
              </div>

              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Lock className="h-4 w-4 mr-2" />
                Get Started Today
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={loanConsultation} 
                alt="Commercial real estate loan consultation"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Ethics & Transparency Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values & Commitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At Halo Business Finance, we're committed to ethical lending practices, 
              transparency, and empowering businesses through innovative financial solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Mission Statement */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={missionProfessionals} alt="Mission" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  To revolutionize commercial lending by creating a transparent, efficient 
                  marketplace that connects businesses with the right lenders, ensuring 
                  competitive rates and exceptional service for every client.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Simplify the commercial lending process</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Provide access to competitive financing options</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Support business growth and success</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ethics */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={ethicsProfessionals} alt="Ethics" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ethical Standards</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We uphold the highest ethical standards in all our business practices, 
                  ensuring fair treatment, honest communication, and responsible lending 
                  that puts our clients' best interests first.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">NMLS compliant lending practices</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fair and honest fee structures</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Responsible lending guidelines</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transparency */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={transparencyProfessionals} alt="Transparency" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Transparency</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We believe in complete transparency throughout the lending process. 
                  Our clients always know exactly what to expect, with clear terms, 
                  upfront fees, and honest communication at every step.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Clear, upfront fee disclosure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Transparent lending process</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Open communication and updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Commitments */}
          <div className="bg-background rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Our Commitments to You</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Halo Business Finance
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Client-First Approach</h4>
                <p className="text-sm text-muted-foreground">
                  Your success is our priority in every decision we make
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Continuous Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Always improving our technology and processes for better service
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Industry Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  Deep knowledge of commercial lending and market trends
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Proven Results</h4>
                <p className="text-sm text-muted-foreground">
                  Track record of successful funding for 1,500+ businesses
                </p>
              </div>
            </div>
          </div>
          
          {/* Apply Here Button for Values & Commitment */}
          <div className="flex justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              onClick={() => window.open('/halo-application', '_blank')}
            >
              Apply Here
            </Button>
          </div>
        </div>
      </section>

      {/* Security, Licenses & Compliance Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Security, Licenses & Compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trust is paramount. We maintain the highest standards of security, 
              regulatory compliance, and professional licensing to protect your business and data.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Security */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={securityProfessionals} alt="Data Security" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Data Security</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We employ enterprise-grade security measures to protect your sensitive 
                  business and financial information throughout the entire lending process.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">256-bit SSL encryption for all data transmission</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">SOC 2 Type II compliant data handling</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Regular security audits and penetration testing</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Multi-factor authentication for secure access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licenses */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={licensesProfessionals} alt="Professional Licenses" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Professional Licenses</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Our team holds all required professional licenses and certifications 
                  to operate as a trusted commercial lending marketplace nationwide.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">NMLS Registered Mortgage Loan Originator</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">State-licensed commercial lending operations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">SBA & Commercial Loan Marketplace participant</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Better Business Bureau A+ Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-full h-44 mb-4 rounded-lg overflow-hidden">
                    <img src={complianceProfessionals} alt="Regulatory Compliance" className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Regulatory Compliance</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We adhere to all federal and state regulations governing commercial 
                  lending, ensuring full compliance with industry standards and requirements.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fair Credit Reporting Act (FCRA) compliance</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Equal Credit Opportunity Act (ECOA) adherence</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Truth in Lending Act (TILA) compliance</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Bank Secrecy Act (BSA) reporting requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications & Memberships */}
          <div className="bg-muted/50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Industry Certifications & Memberships</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our commitment to excellence is recognized through various industry certifications and professional memberships
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">NMLS Licensed</h4>
                <p className="text-sm text-muted-foreground">
                  Nationwide Multistate Licensing System registered and compliant
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">SBA & Commercial Loan Marketplace</h4>
                <p className="text-sm text-muted-foreground">
                  SBA & Commercial Loan Marketplace
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">BBB Accredited</h4>
                <p className="text-sm text-muted-foreground">
                  Better Business Bureau A+ Rating and accreditation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Industry Associations</h4>
                <p className="text-sm text-muted-foreground">
                  Active member of commercial lending professional organizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
};

export default CompanyOverview;