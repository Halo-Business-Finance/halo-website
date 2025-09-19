import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Shield, Clock, Award, Star, CheckCircle, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";
import commercialPropertyInvestment from "@/assets/commercial-property-investment.jpg";
import restaurantEquipmentFinancing from "@/assets/restaurant-equipment-financing.jpg";
import healthcareBusinessFinancing from "@/assets/healthcare-business-financing.jpg";
import constructionLoanSuccess from "@/assets/construction-loan-success.jpg";
import apartmentBuildingFinancing from "@/assets/apartment-building-financing.jpg";
import doctorsOfficeConsultation from "@/assets/doctors-office-consultation.jpg";
import oilEnergyIndustry from "@/assets/oil-energy-industry.jpg";
import transportationLogisticsIndustry from "@/assets/transportation-logistics-industry.jpg";
import retailBusinessFinancing from "@/assets/retail-business-financing.jpg";
import hotelMotelFinancing from "@/assets/hotel-motel-financing.jpg";
import carwashBusinessFinancing from "@/assets/carwash-business-financing.jpg";
import gasStationFinancing from "@/assets/gas-station-financing.jpg";

const IndustryShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
    },
    {
      image: oilEnergyIndustry,
      title: "Oil & Energy Industry",
      description: "Specialized financing for oil, gas, and renewable energy projects and operations",
      loanTypes: ["Equipment financing", "Project development", "Working capital"],
      ctaText: "Energy Financing",
      ctaLink: "/equipment-financing"
    },
    {
      image: transportationLogisticsIndustry,
      title: "Transportation & Logistics",
      description: "Financing solutions for trucking companies, freight operations, and logistics businesses",
      loanTypes: ["Fleet financing", "Equipment loans", "Working capital"],
      ctaText: "Transportation Loans",
      ctaLink: "/equipment-financing"
    },
    {
      image: retailBusinessFinancing,
      title: "Retail & E-commerce",
      description: "Business financing for retail stores, online businesses, and e-commerce operations",
      loanTypes: ["Inventory financing", "Store expansion", "Working capital"],
      ctaText: "Retail Financing",
      ctaLink: "/working-capital"
    },
    {
      image: hotelMotelFinancing,
      title: "Hotel & Motel Industry",
      description: "Hospitality financing for hotels, motels, and accommodation businesses",
      loanTypes: ["Property acquisition", "Renovation loans", "Equipment financing"],
      ctaText: "Hospitality Financing",
      ctaLink: "/sba-504-loans"
    },
    {
      image: carwashBusinessFinancing,
      title: "Car Wash Financing",
      description: "Financing solutions for car wash businesses, equipment, and facility development",
      loanTypes: ["Equipment financing", "Facility construction", "Working capital"],
      ctaText: "Car Wash Financing",
      ctaLink: "/equipment-financing"
    },
    {
      image: gasStationFinancing,
      title: "Gas Station Financing",
      description: "Financing for gas stations, fuel operations, and convenience store businesses",
      loanTypes: ["Property acquisition", "Construction loans", "Working capital"],
      ctaText: "Gas Station Financing",
      ctaLink: "/commercial-loans"
    }
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, industries.length - 4);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [industries.length]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, industries.length - 4);
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, industries.length - 4);
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const getCurrentCards = () => {
    return industries.slice(currentIndex, currentIndex + 4);
  };

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

        {/* Carousel Container */}
        <div className="relative mb-12">
          {/* Navigation removed for auto-play only */}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
              {getCurrentCards().map((industry, index) => (
                <Card key={`${currentIndex}-${index}`} className="overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in">
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
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: Math.max(1, industries.length - 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Success Stories</h3>
            <p className="text-foreground mb-6">
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
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img 
                  src={sbaLoanHandshake} 
                  alt="SBA loan approval handshake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
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