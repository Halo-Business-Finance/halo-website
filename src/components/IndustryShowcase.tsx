import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Shield, Clock, Award, Star, CheckCircle, Lock } from "lucide-react";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";
import commercialPropertyInvestment from "@/assets/commercial-property-investment.jpg";
import restaurantEquipmentFinancing from "@/assets/restaurant-equipment-financing.jpg";
import healthcareBusinessFinancing from "@/assets/healthcare-business-financing.jpg";
import constructionLoanSuccess from "@/assets/construction-loan-success.jpg";
import apartmentBuildingFinancing from "@/assets/apartment-building-financing.jpg";
import doctorsOfficeConsultation from "@/assets/doctors-office-consultation.jpg";

const IndustryShowcase = () => {
  const industries = [
    {
      image: doctorsOfficeConsultation,
      title: "Healthcare & Medical",
      description: "Specialized financing for medical practices, dental offices, and healthcare facilities",
      loanTypes: ["Equipment financing", "Practice expansion", "Working capital"],
      ctaText: "Healthcare Loans",
      ctaLink: "/medical-equipment"
    },
    {
      image: restaurantEquipmentFinancing,
      title: "Restaurant & Food Service",
      description: "Complete financing solutions for restaurants, cafes, and food service businesses",
      loanTypes: ["Kitchen equipment", "Restaurant acquisition", "Renovation loans"],
      ctaText: "Restaurant Financing",
      ctaLink: "/equipment-financing"
    },
    {
      image: constructionLoanSuccess,
      title: "Construction Financing",
      description: "Commercial construction loans and development financing for builders and contractors",
      loanTypes: ["Construction loans", "Equipment financing", "Working capital"],
      ctaText: "Construction Loans",
      ctaLink: "/construction-loans"
    },
    {
      image: apartmentBuildingFinancing,
      title: "Multi-Family Financing",
      description: "Commercial real estate loans for property acquisition and investment projects",
      loanTypes: ["Property acquisition", "Refinancing", "Portfolio loans"],
      ctaText: "Real Estate Loans",
      ctaLink: "/sba-504-loans"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Industry-Specific Financing Solutions
          </h2>
          <p className="text-base text-foreground max-w-3xl mx-auto">
            We understand that every industry has unique financing needs. Our specialized loan programs are designed to support businesses across diverse sectors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {industries.map((industry, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={industry.image} 
                  alt={industry.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{industry.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {industry.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {industry.loanTypes.map((type, i) => (
                    <li key={i} className="text-xs flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {type}
                    </li>
                  ))}
                </ul>
                <Button asChild size="sm" className="w-full">
                  <Link to={industry.ctaLink}>
                    {industry.ctaText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Success Stories</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of businesses that have successfully grown with our financing solutions. From small startups to established enterprises, we've helped businesses achieve their goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">95% loan approval rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">$2.5B+ in funding provided</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm font-medium">2,500+ satisfied clients</span>
                </div>
              </div>
              <Button asChild className="mt-6">
                <Link to="/pre-qualification">
                  <Lock className="h-4 w-4 mr-2" />
                  Get Started Today
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img 
                  src={sbaLoanHandshake} 
                  alt="SBA loan approval handshake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img 
                  src={businessFinancingMeeting} 
                  alt="Business financing consultation meeting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;