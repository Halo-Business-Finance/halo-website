import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock, Star } from "lucide-react";

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;