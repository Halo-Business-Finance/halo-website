import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import contactUsHeader from "@/assets/contact-us-header.jpg";
import contactConsultationMeeting from "@/assets/contact-consultation-meeting.jpg";
import customerServiceTeam from "@/assets/customer-service-team.jpg";

const ContactUsPage = () => {
  return (
    <>
      <SEO 
        title="Contact Halo Business Finance | Business Loan Experts | (800) 730-8461"
        description="Contact Halo Business Finance for business financing solutions. Call (800) 730-8461 or visit our Irvine, CA office. Expert loan consultation available."
        keywords="contact halo business finance, business loan consultation, commercial financing contact, SBA loan help, business financing experts, loan application assistance"
        canonical="https://halobusinessfinance.com/contact-us"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={contactUsHeader} 
          alt="Professional business team working in modern fintech office with financial data displays"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get in touch with our business financing experts. We're here to help you find the right loan solution for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg mb-8">
                <img 
                  src={customerServiceTeam} 
                  alt="Professional customer service team helping clients with financial solutions"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              <div className="space-y-6">
                <Card className="p-6">
                  <CardContent className="p-0 flex items-center gap-4">
                    <Phone className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">(800) 730-8461</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0 flex items-center gap-4">
                    <Mail className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">info@halobusinessfinance.com</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0 flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p className="text-muted-foreground">Irvine, California</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6">
                  <CardContent className="p-0 flex items-center gap-4">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM PST</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg mb-8">
                <img 
                  src={contactConsultationMeeting} 
                  alt="Professional business consultant meeting with clients in modern fintech office"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input placeholder="Your first name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input placeholder="Your last name" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="(XXX) XXX-XXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Tell us about your financing needs..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default ContactUsPage;