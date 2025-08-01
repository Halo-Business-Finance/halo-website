import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Target, TrendingUp } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import loanConsultation from "@/assets/loan-consultation.jpg";

const AboutUsPage = () => {
  return (
    <>
      <SEO 
        title="About Halo Business Finance | SBA Preferred Lender | Commercial Financing"
        description="Learn about Halo Business Finance, an SBA Preferred Lender providing business financing solutions. Expert team, personalized service, competitive rates nationwide."
        keywords="about halo business finance, SBA preferred lender, commercial lending company, business financing company, loan marketplace, commercial loan broker"
        canonical="https://halobusinessfinance.com/about-us"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Halo Business Finance</h1>
              <p className="text-xl mb-8 opacity-90">
                Dedicated to providing exceptional business financing solutions with personalized service and competitive rates.
              </p>
              <Button size="lg" className="bg-white text-primary">
                Learn More About Our Services
              </Button>
            </div>
            <div className="relative">
              <img src={businessGrowth} alt="About Halo Business Finance" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              To simplify business financing by connecting entrepreneurs with the right lending solutions 
              through our innovative marketplace platform and expert guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-foreground">Experienced professionals dedicated to your success</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">SBA Preferred</h3>
                <p className="text-foreground">SBA Preferred Lender with proven track record</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
                <p className="text-foreground">Customized financing solutions for your business</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Growth Focus</h3>
                <p className="text-foreground">Committed to fueling your business growth</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Meet the experienced professionals leading Halo Business Finance with decades of combined expertise in commercial lending and business finance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src="/lovable-uploads/2a9e367f-246a-4c3f-a2a2-13e7f71d47f4.png" alt="Varda Dinkha, Founder & CEO of Halo Business Finance" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Varda Dinkha</h3>
                <p className="text-primary font-medium text-center mb-3">Founder & CEO</p>
                <p className="text-sm text-foreground mb-3">
                  Varda founded Halo Business Finance in 2015 to revolutionize how businesses access capital through innovative technology. As a full stack engineer with expertise in fintech, AI, and blockchain, he combines technical innovation with deep financial industry knowledge.
                </p>
                <div className="text-xs text-foreground">
                  <p>• NMLS Broker License (ID: 2272778)</p>
                  <p>• California Finance Lender Law (ID: 60DBO-183282)</p>
                  <p>• IBM Enterprise Design Thinking Certified</p>
                  <p>• Full Stack Engineer</p>
                  <p>• Fintech, AI & Blockchain Graduate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src={businessGrowth} alt="Sarah Chen, COO" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Sarah Chen</h3>
                <p className="text-primary font-medium text-center mb-3">Chief Operating Officer</p>
                <p className="text-sm text-foreground mb-3">
                  Sarah leads operations with 15+ years in fintech and lending operations. Previously managed lending operations for a $2B portfolio at JPMorgan Chase.
                </p>
                <div className="text-xs text-foreground">
                  <p>• MS Operations Management, MIT</p>
                  <p>• Six Sigma Black Belt</p>
                  <p>• Certified Lending Compliance Officer</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src={loanConsultation} alt="David Thompson, CRO" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">David Thompson</h3>
                <p className="text-primary font-medium text-center mb-3">Chief Revenue Officer</p>
                <p className="text-sm text-foreground mb-3">
                  David drives business development and lender relationships. 18 years in commercial finance with expertise in SBA lending and equipment financing.
                </p>
                <div className="text-xs text-foreground">
                  <p>• BA Economics, Stanford University</p>
                  <p>• Certified Commercial Loan Officer</p>
                  <p>• SBA Lending Specialist</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src={businessGrowth} alt="Lisa Park, Head of Underwriting" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Lisa Park</h3>
                <p className="text-primary font-medium text-center mb-3">Head of Underwriting</p>
                <p className="text-sm text-foreground mb-3">
                  Lisa oversees credit analysis and risk management with 12+ years in commercial underwriting. Former Senior Underwriter at Bank of America.
                </p>
                <div className="text-xs text-foreground">
                  <p>• MS Finance, UC Berkeley</p>
                  <p>• CFA Charterholder</p>
                  <p>• Commercial Credit Analyst Certification</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src={loanConsultation} alt="James Wilson, Head of Technology" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">James Wilson</h3>
                <p className="text-primary font-medium text-center mb-3">Head of Technology</p>
                <p className="text-sm text-foreground mb-3">
                  James leads our technology initiatives and platform development. 10+ years in fintech with previous roles at LendingClub and Kabbage.
                </p>
                <div className="text-xs text-foreground">
                  <p>• MS Computer Science, Carnegie Mellon</p>
                  <p>• AWS Certified Solutions Architect</p>
                  <p>• Fintech Security Specialist</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img src={businessGrowth} alt="Maria Gonzalez, Head of Customer Success" className="w-24 h-24 rounded-full mx-auto object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Maria Gonzalez</h3>
                <p className="text-primary font-medium text-center mb-3">Head of Customer Success</p>
                <p className="text-sm text-foreground mb-3">
                  Maria ensures exceptional client experience throughout the lending process. 8+ years in customer success and relationship management.
                </p>
                <div className="text-xs text-foreground">
                  <p>• BA Business Administration, UCLA</p>
                  <p>• Certified Customer Success Manager</p>
                  <p>• Financial Services Excellence Award</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-center mb-6">Our Leadership Principles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Integrity First</h4>
                <p className="text-sm text-foreground">Every decision is guided by honesty, transparency, and ethical business practices.</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Client-Centric</h4>
                <p className="text-sm text-foreground">Our clients' success is our success. We prioritize their needs in everything we do.</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Innovation Drive</h4>
                <p className="text-sm text-foreground">Continuously improving our platform and processes to better serve our clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default AboutUsPage;