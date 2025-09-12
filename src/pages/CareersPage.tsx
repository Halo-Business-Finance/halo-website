import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp, 
  Heart, 
  Award,
  Briefcase,
  Building,
  ChevronRight,
  Target,
  Shield,
  Zap
} from "lucide-react";
import careersHeader from "@/assets/careers-header.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";

const CareersPage = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Comprehensive Benefits",
      description: "Full health, dental, vision insurance, 401(k) matching, and flexible PTO policy."
    },
    {
      icon: TrendingUp,
      title: "Career Development",
      description: "Mentorship programs, professional development budget, and clear advancement paths."
    },
    {
      icon: Shield,
      title: "Job Security",
      description: "Stable industry leader with consistent growth and expansion opportunities."
    },
    {
      icon: Zap,
      title: "Innovation Culture",
      description: "Work with cutting-edge fintech solutions and contribute to industry advancement."
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Cross-functional teams, open communication, and inclusive workplace culture."
    },
    {
      icon: Target,
      title: "Performance Recognition",
      description: "Merit-based bonuses, performance incentives, and annual recognition programs."
    }
  ];

  const departments = [
    {
      title: "Sales & Business Development",
      description: "Drive revenue growth and build strategic partnerships",
      positions: ["Senior Loan Officer", "Business Development Manager", "Sales Director"],
      icon: Briefcase
    },
    {
      title: "Technology & Engineering",
      description: "Build and maintain our fintech platform",
      positions: ["Full Stack Developer", "DevOps Engineer", "Product Manager"],
      icon: Building
    },
    {
      title: "Operations & Support", 
      description: "Ensure seamless customer experience and operations",
      positions: ["Operations Manager", "Customer Success Manager", "Compliance Officer"],
      icon: Users
    }
  ];

  const openPositions = [
    {
      title: "Senior Loan Officer",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead commercial lending relationships and help businesses secure financing solutions. Work with diverse portfolio of clients ranging from small businesses to enterprise accounts."
    },
    {
      title: "Business Development Manager",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time", 
      experience: "5+ years",
      description: "Drive business growth through strategic partnerships and new market development. Build relationships with brokers, referral partners, and enterprise clients."
    },
    {
      title: "Full Stack Developer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Develop and maintain our loan marketplace platform using React, Node.js, and cloud technologies. Work on features that directly impact customer experience."
    },
    {
      title: "Compliance Officer",
      department: "Operations",
      location: "Hybrid",
      type: "Full-time",
      experience: "6+ years",
      description: "Ensure regulatory compliance across all business operations. Monitor lending practices, manage audit processes, and maintain industry certifications."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <img 
          src={careersHeader} 
          alt="Professional team collaboration in modern office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Build Your Career With Industry Leaders
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Join our mission to transform business financing through technology, innovation, and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black px-8 py-3">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$2B+</div>
              <div className="text-gray-600">Loans Facilitated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Businesses Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Halo Business Finance?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer more than just a job – we provide a platform for professional growth, innovation, and meaningful impact in the business finance industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Culture Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={teamCollaboration} 
              alt="Team collaboration in modern workspace"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Innovation Through Collaboration</h3>
              <p className="text-lg">Where diverse perspectives drive breakthrough solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Departments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your place in our growing organization across multiple disciplines and specializations.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <dept.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{dept.title}</CardTitle>
                  <p className="text-muted-foreground">{dept.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Open Roles
                    </h4>
                    {dept.positions.map((position, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <span className="text-sm">{position}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    View Positions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Current Opportunities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our team and help shape the future of business financing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <Badge variant="secondary">{position.department}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {position.experience}
                        </div>
                      </div>
                    </div>
                    <Button className="lg:ml-4 shrink-0" asChild>
                      <a href="https://preview--hbf-application.lovable.app/auth">
                        Apply Now
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {position.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see the right role? We're always looking for exceptional talent.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <a href="https://preview--hbf-application.lovable.app/auth">
                Submit General Application
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Shape the Future of Business Finance?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our mission to empower businesses through innovative financing solutions. 
              Your career growth and success are our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8">
                Browse All Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary px-8">
                Learn About Benefits
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