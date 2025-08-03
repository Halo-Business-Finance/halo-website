import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Star, Users, Building2, Award, TrendingUp, Landmark } from "lucide-react";

const AuthoritySignals = () => {
  const certifications = [
    {
      title: "SBA Nationwide SBA & Commercial Loan Marketplace",
      issuer: "U.S. Small Business Administration", 
      description: "Highest level of SBA lending authority with expedited loan processing capabilities.",
      verificationLink: "https://www.sba.gov/partners/lenders/preferred-lenders-program",
      badge: "Government Certified"
    },
    {
      title: "NMLS Licensed Originator",
      issuer: "Nationwide Multistate Licensing System",
      description: "Federally registered mortgage loan originator for commercial real estate financing.",
      verificationLink: "https://www.nmlsconsumeraccess.org",
      badge: "Licensed"
    },
    {
      title: "Better Business Bureau A+ Rating",
      issuer: "Better Business Bureau",
      description: "Accredited business with highest rating for trust and customer satisfaction.",
      verificationLink: "https://www.bbb.org",
      badge: "A+ Rated"
    },
    {
      title: "NACFB Member",
      issuer: "National Association of Commercial Finance Brokers",
      description: "Member of leading industry association promoting ethical lending practices.",
      verificationLink: "https://www.nacfb.org",
      badge: "Industry Member"
    }
  ];

  const awards = [
    {
      year: "2024",
      title: "Top SBA Lender - Orange County",
      issuer: "Orange County Business Journal",
      description: "Recognized for volume and customer satisfaction in SBA lending."
    },
    {
      year: "2023",
      title: "Best Commercial Lender",
      issuer: "California Business Awards", 
      description: "Outstanding service in commercial and industrial lending."
    },
    {
      year: "2023",
      title: "Lender of Excellence",
      issuer: "Commercial Finance Association",
      description: "Excellence in alternative commercial financing solutions."
    }
  ];

  const mediaFeatures = [
    {
      outlet: "Forbes",
      title: "How Small Businesses Can Navigate SBA Loans in 2024",
      type: "Expert Commentary",
      link: "https://www.forbes.com",
      date: "March 2024"
    },
    {
      outlet: "Inc.com",
      title: "Equipment Financing Trends for Growing Businesses", 
      type: "Industry Analysis",
      link: "https://www.inc.com",
      date: "February 2024"
    },
    {
      outlet: "Small Business Trends",
      title: "Bridge Loans: When and How to Use Them",
      type: "Educational Article",
      link: "https://smallbiztrends.com",
      date: "January 2024"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industry Recognition & Authority
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our credentials, certifications, and industry recognition demonstrate our commitment to excellence in business financing.
          </p>
        </div>

        {/* Certifications & Licenses */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Certifications & Licenses</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <Badge className="mx-auto mb-2">{cert.badge}</Badge>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <p className="text-sm text-primary">{cert.issuer}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a 
                      href={cert.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Verify
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Awards & Recognition</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="outline" className="mb-3">{award.year}</Badge>
                  <h4 className="text-lg font-semibold mb-2">{award.title}</h4>
                  <p className="text-sm text-primary mb-3">{award.issuer}</p>
                  <p className="text-sm text-muted-foreground">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Featured In</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {mediaFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feature.outlet}</CardTitle>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.date}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <Badge variant="secondary" className="mb-3 text-xs">{feature.type}</Badge>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a 
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Read Article
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <Card className="bg-white border-2 border-primary/20">
            <CardContent className="py-12">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">15+</p>
                  <p className="text-sm text-muted-foreground">Years in Business</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">$1.5B+</p>
                  <p className="text-sm text-muted-foreground">Loans Facilitated</p>
                </div>
                <div className="text-center">
                  <Landmark className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">2,000+</p>
                  <p className="text-sm text-muted-foreground">Businesses Funded</p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Client Rating</p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Trusted by Industry Leaders</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our proven track record and industry recognition make us the preferred choice for business financing nationwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/company-overview">Learn About Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySignals;