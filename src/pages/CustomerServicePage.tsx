import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageSquare, FileText, Users, Headphones } from "lucide-react";
import contactUsHeader from "@/assets/contact-us-header.jpg";
import contactConsultationMeeting from "@/assets/contact-consultation-meeting.jpg";
import customerServiceTeam from "@/assets/customer-service-team.jpg";
import loanOfficersWorking from "@/assets/loan-officers-working.jpg";

const CustomerServicePage = () => {
  return (
    <>
      <SEO 
        title="Customer Service | Halo Business Finance | 24/7 Support"
        description="Get expert customer service and support from Halo Business Finance. Contact our team at (800) 730-8461 for loan assistance, account help, and business financing questions."
        keywords="customer service, business loan support, financing help, account assistance, customer care, loan servicing, business finance support"
        canonical="https://halobusinessfinance.com/customer-service"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <section 
          className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${contactUsHeader})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Service</h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                We're here to help with all your business financing needs. Our dedicated customer service team provides expert support every step of the way.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-2xl font-bold text-primary mb-2">(800) 730-8461</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-lg font-semibold text-primary mb-2">info@halobusinessfinance.com</p>
                  <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Office Location</h3>
                  <p className="font-semibold mb-2">Irvine, California</p>
                  <p className="text-sm text-muted-foreground">Serving nationwide</p>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="font-semibold mb-2">Mon - Fri</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 6:00 PM PST</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">How We Can Help</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <MessageSquare className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Loan Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">
                      Get help with loan applications, document requirements, and application status updates.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Account Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">
                      Manage your existing loans, payment schedules, and account information.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Consultation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">
                      Speak with our financing experts to find the best loan solution for your business.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <Headphones className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Technical Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">
                      Get assistance with our online platform, document uploads, and technical issues.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Professional Team Images Section */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <img 
                    src={contactConsultationMeeting} 
                    alt="Customer consultation meeting with business advisors"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
                  <p className="text-muted-foreground">
                    Our experienced advisors provide personalized guidance for your business financing needs.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src={customerServiceTeam} 
                    alt="Dedicated customer service team at help desk"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                  <p className="text-muted-foreground">
                    Our customer service team is available 24/7 to assist with any questions or concerns.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src={loanOfficersWorking} 
                    alt="Professional loan officers collaborating"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Loan Specialists</h3>
                  <p className="text-muted-foreground">
                    Work directly with our loan officers to find the perfect financing solution for your business.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have a question or need assistance? Fill out the form and our customer service team will get back to you promptly.
                </p>
                
                <div className="space-y-6">
                  <Card className="p-4 bg-accent/50">
                    <CardContent className="p-0">
                      <h4 className="font-semibold mb-2">Quick Response Guarantee</h4>
                      <p className="text-sm text-muted-foreground">
                        We guarantee a response to all inquiries within 24 hours during business days.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 bg-accent/50">
                    <CardContent className="p-0">
                      <h4 className="font-semibold mb-2">Secure Communication</h4>
                      <p className="text-sm text-muted-foreground">
                        All communications are encrypted and handled in accordance with our privacy policy.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name *</label>
                      <Input placeholder="Your first name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name *</label>
                      <Input placeholder="Your last name" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" placeholder="your.email@example.com" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="(XXX) XXX-XXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject *</label>
                    <Input placeholder="How can we help you?" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message *</label>
                    <Textarea placeholder="Please describe your question or issue in detail..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CustomerServicePage;