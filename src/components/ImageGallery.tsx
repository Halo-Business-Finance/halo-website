import { Card, CardContent } from "@/components/ui/card";
import businessMeeting from "@/assets/business-meeting.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import businessHandshake from "@/assets/business-handshake.jpg";
import equipmentFinancing from "@/assets/equipment-financing.jpg";
import financialConsultation from "@/assets/financial-consultation.jpg";
import manufacturingFacility from "@/assets/manufacturing-facility.jpg";
import retailStorefront from "@/assets/retail-storefront.jpg";
import businessSigning from "@/assets/business-signing.jpg";

const ImageGallery = () => {
  const galleryItems = [
    {
      image: financialConsultation,
      title: "Expert Consultation",
      description: "Our experienced loan officers work closely with you to understand your business needs and find the right financing solution."
    },
    {
      image: commercialBuilding,
      title: "Commercial Real Estate",
      description: "Financing solutions for office buildings, retail spaces, warehouses, and other commercial properties."
    },
    {
      image: businessSigning,
      title: "Quick Approvals",
      description: "Streamlined application process with fast decision times to get your business the funding it needs when it needs it."
    },
    {
      image: manufacturingFacility,
      title: "Industry Expertise", 
      description: "Specialized financing solutions for manufacturing, retail, healthcare, construction, and technology sectors."
    },
    {
      image: retailStorefront,
      title: "Small Business Support",
      description: "Dedicated support for small and medium businesses with flexible terms and competitive rates."
    },
    {
      image: equipmentFinancing,
      title: "Equipment Financing",
      description: "Fund the machinery and equipment your business needs to grow and stay competitive in your industry."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Success is Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From initial consultation to loan closing, we're committed to providing the support and financing your business needs to thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take Your Business to the Next Level?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team of financing experts is ready to help you explore your options and find the perfect loan solution for your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Start Your Application
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors font-semibold">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;