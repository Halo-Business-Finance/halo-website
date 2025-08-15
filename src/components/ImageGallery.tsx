import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import WebPImageOptimizer from "@/components/optimization/WebPImageOptimizer";
import ConsultationPopup from "@/components/ConsultationPopup";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// Convert to dynamic imports - NO MORE BUNDLE BLOAT!
const ImageGallery = () => {
  const galleryItems = [
    {
      imagePath: "/src/assets/financial-advisor-consultation.jpg",
      title: "Expert Consultation",
      description: "Our experienced loan officers work closely with you to understand your business needs and find the right financing solution."
    },
    {
      imagePath: "/src/assets/modern-commercial-property.jpg",
      title: "Commercial Real Estate",
      description: "Financing solutions for office buildings, retail spaces, warehouses, and other commercial properties."
    },
    {
      imagePath: "/src/assets/loan-approval-celebration.jpg",
      title: "Quick Approvals",
      description: "Streamlined application process with fast decision times to get your business the funding it needs when it needs it."
    },
    {
      imagePath: "/src/assets/manufacturing-success.jpg",
      title: "Manufacturing Success", 
      description: "Specialized financing solutions for manufacturing businesses looking to expand operations and upgrade equipment."
    },
    {
      imagePath: "/src/assets/successful-retail-business.jpg",
      title: "Small Business Support",
      description: "Dedicated support for small and medium businesses with flexible terms and competitive rates."
    },
    {
      imagePath: "/src/assets/tech-startup-workspace.jpg",
      title: "Technology Innovation",
      description: "Supporting tech startups and innovative businesses with growth capital and equipment financing."
    },
    {
      imagePath: "/src/assets/small-business-owner-laptop.jpg",
      title: "Digital-First Experience",
      description: "Modern online application process with dedicated support throughout your financing journey."
    },
    {
      imagePath: "/src/assets/equipment-financing.jpg",
      title: "Equipment Financing",
      description: "Fund the machinery and equipment your business needs to grow and stay competitive in your industry."
    },
    {
      imagePath: "/src/assets/commercial-building.jpg",
      title: "Property Investment",
      description: "Commercial real estate loans for property acquisition, refinancing, and development projects."
    }
  ];

  // Carousel setup with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    containScroll: 'trimSnaps'
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoplay);
  }, [emblaApi, isPlaying]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories & Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how we've helped businesses like yours achieve their goals with the right financing solutions
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                  <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden rounded-t-lg h-56">
                      <WebPImageOptimizer 
                        src={item.imagePath} 
                        alt={item.title}
                        width={400}
                        height={224}
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay with title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Fast Approval
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Competitive Rates
                        </span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoplay}
              className="p-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Fund Your Business Growth?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful businesses that have secured financing through our marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/loan-calculator">Calculate Rates</Link>
              </Button>
              <ConsultationPopup 
                trigger={
                  <Button variant="outline" size="lg">
                    Free Consultation
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;