import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock, Star } from "lucide-react";
import careersHeader from "@/assets/careers-header.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import businessDevelopmentTeam from "@/assets/business-development-team.jpg";
import loanOfficersWorking from "@/assets/loan-officers-working.jpg";
import careerSuccessCelebration from "@/assets/career-success-celebration.jpg";

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={careersHeader} 
          alt="Professional diverse business team working together in modern fintech office environment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Build your career with a leading business finance company. We're looking for passionate professionals to help businesses achieve their financial goals.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Great Team</h3>
                <p className="text-muted-foreground">Work with industry experts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Growth Opportunities</h3>
                <p className="text-muted-foreground">Advance your career</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Work-Life Balance</h3>
                <p className="text-muted-foreground">Flexible schedules</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={teamCollaboration} 
                alt="Professional business team collaboration meeting in modern fintech office"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Senior Loan Officer</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Remote</span>
                      <Badge>Full-time</Badge>
                    </div>
                  </div>
                   <Button asChild><a href="https://preview--hbf-application.lovable.app/auth">Apply Now</a></Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Help businesses secure financing solutions. 3+ years experience in commercial lending required.
                </p>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 items-center my-12">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={loanOfficersWorking} 
                  alt="Professional loan officers working at desk with financial documents"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Senior Loan Officer Position</h3>
                <p className="text-muted-foreground mb-4">
                  Join our lending team and help businesses secure the financing they need to grow. 
                  Work with a diverse portfolio of clients and gain expertise in commercial lending.
                </p>
                <Button asChild><a href="https://preview--hbf-application.lovable.app/auth">Learn More</a></Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Business Development Manager</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">New York, NY</span>
                      <Badge>Full-time</Badge>
                    </div>
                  </div>
                  <Button asChild><a href="https://preview--hbf-application.lovable.app/auth">Apply Now</a></Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Drive business growth through strategic partnerships and client relationships.
                </p>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8 items-center my-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Business Development Opportunities</h3>
                <p className="text-muted-foreground mb-4">
                  Drive growth through strategic partnerships and client relationships. 
                  Build lasting connections in the business finance industry.
                </p>
                <Button asChild><a href="https://preview--hbf-application.lovable.app/auth">Explore Roles</a></Button>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={businessDevelopmentTeam} 
                  alt="Professional business development meeting with diverse team"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-primary to-financial-navy rounded-2xl p-8 text-white mt-12">
              <div className="relative rounded-lg overflow-hidden shadow-lg mb-6 max-w-2xl mx-auto">
                <img 
                  src={careerSuccessCelebration} 
                  alt="Professional diverse team celebrating career success and professional growth"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Career With Us?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join our growing team and be part of a company that values professional development, innovation, and making a difference in the business finance industry.
              </p>
              <Button size="lg" className="bg-white text-primary font-semibold">
                View All Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;