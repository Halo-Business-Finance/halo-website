import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Your Success is Our Mission
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            From initial consultation to loan closing, we're committed to providing the support and financing your business needs to thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Take Your Business to the Next Level?
            </h3>
            <p className="text-foreground mb-6">
              Our team of financing experts is ready to help you explore your options and find the perfect loan solution for your business goals. Learn more about <Link to="/how-it-works" className="text-primary hover:underline">our streamlined application process</Link> or explore financing options recommended by the <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Small Business Administration</a>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pre-qualification" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-center">
                Start Your Application
              </Link>
              <Link to="/contact-us" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-center">
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;