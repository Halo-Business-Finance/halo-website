import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LazyImage from "@/components/optimization/LazyImage";
import ConsultationPopup from "@/components/ConsultationPopup";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import businessMeeting from "@/assets/business-meeting.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import businessHandshake from "@/assets/business-handshake.jpg";
import equipmentFinancing from "@/assets/equipment-financing.jpg";
import financialConsultation from "@/assets/financial-consultation.jpg";
import manufacturingFacility from "@/assets/manufacturing-facility.jpg";
import retailStorefront from "@/assets/retail-storefront.jpg";
import businessSigning from "@/assets/business-signing.jpg";
import smallBusinessOwnerLaptop from "@/assets/small-business-owner-laptop.jpg";
import loanApprovalCelebration from "@/assets/loan-approval-celebration.jpg";
import successfulRetailBusiness from "@/assets/successful-retail-business.jpg";
import financialAdvisorConsultation from "@/assets/financial-advisor-consultation.jpg";
import manufacturingSuccess from "@/assets/manufacturing-success.jpg";
import modernCommercialProperty from "@/assets/modern-commercial-property.jpg";
import techStartupWorkspace from "@/assets/tech-startup-workspace.jpg";

const ImageGallery = () => {
  const galleryItems = [
    {
      image: financialAdvisorConsultation,
      title: "Expert Consultation",
      description: "Our experienced loan officers work closely with you to understand your business needs and find the right financing solution."
    },
    {
      image: modernCommercialProperty,
      title: "Commercial Real Estate",
      description: "Financing solutions for office buildings, retail spaces, warehouses, and other commercial properties."
    },
    {
      image: loanApprovalCelebration,
      title: "Quick Approvals",
      description: "Streamlined application process with fast decision times to get your business the funding it needs when it needs it."
    },
    {
      image: manufacturingSuccess,
      title: "Manufacturing Success", 
      description: "Specialized financing solutions for manufacturing businesses looking to expand operations and upgrade equipment."
    },
    {
      image: successfulRetailBusiness,
      title: "Small Business Support",
      description: "Dedicated support for small and medium businesses with flexible terms and competitive rates."
    },
    {
      image: techStartupWorkspace,
      title: "Technology Innovation",
      description: "Supporting tech startups and innovative businesses with growth capital and equipment financing."
    },
    {
      image: smallBusinessOwnerLaptop,
      title: "Digital-First Experience",
      description: "Modern online application process with dedicated support throughout your financing journey."
    },
    {
      image: equipmentFinancing,
      title: "Equipment Financing",
      description: "Fund the machinery and equipment your business needs to grow and stay competitive in your industry."
    },
    {
      image: commercialBuilding,
      title: "Property Investment",
      description: "Commercial real estate loans for property acquisition, refinancing, and development projects."
    }
  ];

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    containScroll: 'trimSnaps'
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Enterprise Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-financial-navy to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-financial-blue to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-financial-navy/10 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-financial-gold rounded-full"></div>
            <span className="text-financial-navy font-semibold text-sm tracking-wide uppercase">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-financial-navy mb-6 tracking-tight">
            Your Success is Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From initial consultation to loan closing, we're committed to providing enterprise-grade support and financing solutions that drive business growth.
          </p>
        </div>

        {/* Premium Carousel Section */}
        <div className="relative mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-2xl">
            
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-financial-navy">Featured Success Stories</h3>
              <div className="flex gap-3">
                <button
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className="bg-financial-navy hover:bg-financial-navy-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className="bg-financial-navy hover:bg-financial-navy-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Enhanced Carousel Container */}
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {galleryItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3"
                  >
                    <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white h-full">
                      <div className="relative h-64 overflow-hidden">
                        <LazyImage 
                          src={item.image} 
                          alt={item.title}
                          width={400}
                          height={256}
                          quality={85}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Premium Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-financial-navy/80 via-financial-navy/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-financial-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Enterprise Badge */}
                        <div className="absolute top-4 right-4 bg-financial-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-financial-navy text-xs font-bold">SUCCESS</span>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-xl font-bold mb-1 drop-shadow-lg">{item.title}</h3>
                        </div>
                      </div>
                      
                      <CardContent className="p-8 flex-1 flex flex-col">
                        <p className="text-gray-700 leading-relaxed flex-grow text-lg font-light">{item.description}</p>
                        
                        {/* Premium Accent */}
                        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                          <div className="w-3 h-3 bg-financial-gold rounded-full"></div>
                          <span className="text-financial-navy font-semibold text-sm tracking-wide">VERIFIED SUCCESS</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Indicators */}
            <div className="flex justify-center mt-8 gap-3">
              {Array.from({ length: Math.ceil(galleryItems.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  className="w-3 h-3 rounded-full bg-gray-300 hover:bg-financial-navy transition-all duration-300 data-[active=true]:bg-financial-navy data-[active=true]:w-8"
                  onClick={() => emblaApi?.scrollTo(index * 3)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-financial-navy via-financial-navy-light to-financial-navy rounded-3xl p-12 max-w-5xl mx-auto border border-financial-navy/20 shadow-2xl relative overflow-hidden">
            
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-white to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-financial-gold to-transparent rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Our team of enterprise financing experts is ready to help you explore premium solutions and find the perfect financing strategy for your business growth. Learn more about <Link to="/how-it-works" className="text-financial-gold hover:underline font-medium transition-colors">our streamlined enterprise process</Link> or explore financing options recommended by the <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-financial-gold hover:underline font-medium transition-colors">Small Business Administration</a>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-financial-gold hover:bg-financial-gold/90 text-financial-navy font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-0"
                >
                  <a href="https://preview--hbf-application.lovable.app/auth">
                    Start Enterprise Application
                  </a>
                </Button>
                <ConsultationPopup 
                  trigger={
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white/30 text-white px-10 py-4 text-lg hover:bg-white/10 hover:border-white transition-all duration-300 bg-white/5 backdrop-blur-sm"
                    >
                      Schedule Executive Consultation
                    </Button>
                  }
                />
              </div>
              
              {/* Enterprise Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/20">
                <div className="text-center">
                  <div className="text-financial-gold font-bold text-2xl">$2.5B+</div>
                  <div className="text-white/80">Enterprise Funding Deployed</div>
                </div>
                <div className="text-center">
                  <div className="text-financial-gold font-bold text-2xl">2,500+</div>
                  <div className="text-white/80">Businesses Served</div>
                </div>
                <div className="text-center">
                  <div className="text-financial-gold font-bold text-2xl">24hrs</div>
                  <div className="text-white/80">Average Approval Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;