import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ExternalLink, Star, Users, TrendingUp, Award, Landmark } from "lucide-react";

const PartnershipsSection = () => {
  const partnerships = [
    {
      name: "SBA Nationwide SBA & Commercial Loan Marketplace",
      type: "Government Partnership",
      description: "Official SBA Nationwide SBA & Commercial Loan Marketplace connecting businesses with multiple lenders for competitive rates and terms.",
      link: "https://www.sba.gov/partners/lenders/preferred-lenders-program",
      internal: false,
      badge: "Preferred Plus"
    },
    {
      name: "SCORE Business Mentors",
      type: "Educational Partnership", 
      description: "We partner with SCORE to provide free business mentoring and resources to our clients.",
      link: "https://www.score.org",
      internal: false,
      badge: "Mentor Partner"
    },
    {
      name: "National Association of Commercial Finance Brokers",
      type: "Industry Association",
      description: "Active member providing ethical lending practices and industry expertise.",
      link: "https://www.nacfb.org",
      internal: false,
      badge: "Member"
    },
    {
      name: "Local Chamber of Commerce",
      type: "Community Partnership",
      description: "Supporting local businesses through chamber partnerships across multiple markets.",
      link: "/industry-solutions",
      internal: true,
      badge: "Community"
    }
  ];

  const testimonials = [
    {
      quote: "Halo Business Finance helped us secure SBA financing when others said no. Their expertise made all the difference.",
      author: "Sarah Chen",
      company: "TechStart Solutions",
      amount: "$750,000 SBA 7(a) Loan"
    },
    {
      quote: "The bridge loan gave us the working capital we needed while our permanent financing was approved.",
      author: "Michael Rodriguez", 
      company: "Rodriguez Manufacturing",
      amount: "$2.1M Bridge Loan"
    },
    {
      quote: "Their equipment financing helped us expand our fleet without depleting our working capital.",
      author: "Jennifer Adams",
      company: "Adams Construction",
      amount: "$1.2M Equipment Loan"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Partnerships */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted Partnerships & Credentials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our partnerships with leading financial institutions and government agencies ensure you get access to the best financing options available.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerships.map((partnership, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {partnership.badge}
                  </Badge>
                  {!partnership.internal && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg">{partnership.name}</CardTitle>
                <p className="text-sm text-primary">{partnership.type}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {partnership.description}
                </p>
                {partnership.internal ? (
                  <Link 
                    to={partnership.link}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Learn More
                  </Link>
                ) : (
                  <a 
                    href={partnership.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                  >
                    Visit Site
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Success Stories */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Client Success Stories</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we've helped businesses like yours achieve their growth goals with the right financing solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {testimonial.amount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Recognition */}
        <div className="text-center">
          <Card className="bg-primary text-white">
            <CardContent className="py-12">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">$1.5B+</p>
                  <p className="text-sm opacity-90">Loans Facilitated</p>
                </div>
                <div className="text-center">
                  <Landmark className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">2,000+</p>
                  <p className="text-sm opacity-90">Businesses Funded</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.9/5</p>
                  <p className="text-sm opacity-90">Client Rating</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Our Success Stories</h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                Ready to become our next success story? Let us help you secure the financing your business needs to thrive.
              </p>
              <Link 
                to="/pre-qualification"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Today
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnershipsSection;