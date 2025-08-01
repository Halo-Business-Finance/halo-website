import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Calculator, Users, TrendingUp, Shield } from "lucide-react";

const ResourcesHub = () => {
  const internalResources = [
    {
      title: "Business Loan Calculator",
      description: "Calculate monthly payments and total costs for different loan amounts and terms.",
      icon: Calculator,
      link: "/loan-calculator",
      type: "tool"
    },
    {
      title: "How Our Process Works",
      description: "Step-by-step guide to getting approved for business financing.",
      icon: FileText,
      link: "/how-it-works",
      type: "guide"
    },
    {
      title: "Industry Solutions",
      description: "Specialized financing solutions for different business sectors.",
      icon: Users,
      link: "/industry-solutions", 
      type: "solutions"
    },
    {
      title: "SBA Loan Benefits",
      description: "Learn why SBA loans offer the best terms for small businesses.",
      icon: Shield,
      link: "/sba-loans",
      type: "education"
    }
  ];

  const externalResources = [
    {
      title: "SBA Official Website",
      description: "Official Small Business Administration resources and programs.",
      url: "https://www.sba.gov",
      domain: "sba.gov"
    },
    {
      title: "SCORE Business Mentors",
      description: "Free business mentoring and educational workshops.",
      url: "https://www.score.org",
      domain: "score.org"
    },
    {
      title: "Small Business Trends",
      description: "Latest news and insights for small business owners.",
      url: "https://smallbiztrends.com",
      domain: "smallbiztrends.com"
    },
    {
      title: "Inc.com Small Business",
      description: "Business advice, tips, and strategies for growth.",
      url: "https://www.inc.com/small-business",
      domain: "inc.com"
    },
    {
      title: "Forbes Small Business",
      description: "Expert insights and advice for entrepreneurs.",
      url: "https://www.forbes.com/small-business",
      domain: "forbes.com"
    },
    {
      title: "Entrepreneur.com",
      description: "Startup and business growth resources.",
      url: "https://www.entrepreneur.com",
      domain: "entrepreneur.com"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Business Resources
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive library of tools, guides, and trusted external resources to help your business succeed.
          </p>
        </div>

        {/* Internal Resources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Our Business Tools & Guides</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {internalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <resource.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={resource.link}>
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">Trusted Industry Resources</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-primary">{resource.domain}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Site
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="py-12">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                Use our resources to prepare, then get pre-qualified for business financing in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50 border-2 border-primary shadow-lg">
                  <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                </Button>
                <Button asChild size="lg" className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link to="/contact-us">Speak with Expert</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResourcesHub;