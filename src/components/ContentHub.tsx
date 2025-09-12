import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  Users, 
  Building2, 
  Award,
  Download,
  ExternalLink,
  Clock,
  BookOpen
} from "lucide-react";

const ContentHub = () => {
  const guides = [
    {
      title: "Complete SBA Loan Guide 2024",
      description: "Everything you need to know about SBA 7(a), 504, and Express loans with current rates and requirements.",
      category: "SBA Loans",
      readTime: "15 min read",
      link: "/resources/sba-loan-guide",
      featured: true
    },
    {
      title: "Business Loan Application Checklist",
      description: "Step-by-step checklist and required documents for different types of business loans.",
      category: "Application Process",
      readTime: "8 min read", 
      link: "/resources/loan-application-checklist",
      featured: false
    },
    {
      title: "Equipment Financing vs Leasing Guide",
      description: "Compare financing options for business equipment with pros, cons, and cost analysis.",
      category: "Equipment Financing",
      readTime: "12 min read",
      link: "/resources/equipment-financing-guide",
      featured: false
    },
    {
      title: "Working Capital Solutions for Cash Flow",
      description: "Strategies to manage cash flow gaps and optimize working capital for business growth.",
      category: "Working Capital",
      readTime: "10 min read",
      link: "/resources/working-capital-guide",
      featured: false
    }
  ];

  const tools = [
    {
      title: "SBA Loan Payment Calculator",
      description: "Calculate monthly payments for SBA 7(a) and 504 loans with current interest rates.",
      icon: Calculator,
      link: "/tools/sba-loan-calculator",
      category: "Calculator"
    },
    {
      title: "Business Loan Comparison Tool", 
      description: "Compare different loan types, rates, and terms to find the best financing option.",
      icon: TrendingUp,
      link: "/tools/loan-comparison",
      category: "Comparison"
    },
    {
      title: "Cash Flow Projector",
      description: "Project future cash flows and determine optimal loan amounts and repayment terms.",
      icon: Building2,
      link: "/tools/cash-flow-projector",
      category: "Planning"
    },
    {
      title: "ROI Calculator for Equipment",
      description: "Calculate return on investment for equipment purchases with financing options.",
      icon: Award,
      link: "/tools/roi-calculator",
      category: "ROI"
    }
  ];

  const industryReports = [
    {
      title: "2024 Small Business Lending Report",
      description: "Annual analysis of small business lending trends, approval rates, and market insights.",
      downloadLink: "/downloads/2024-lending-report.pdf",
      pages: "45 pages",
      type: "Annual Report"
    },
    {
      title: "SBA Loan Market Analysis Q4 2024",
      description: "Quarterly analysis of SBA loan performance, rates, and industry trends.",
      downloadLink: "/downloads/q4-2024-sba-analysis.pdf", 
      pages: "28 pages",
      type: "Quarterly Report"
    },
    {
      title: "Equipment Financing Trends 2024",
      description: "Industry analysis of equipment financing growth across different business sectors.",
      downloadLink: "/downloads/equipment-financing-trends-2024.pdf",
      pages: "32 pages", 
      type: "Industry Analysis"
    }
  ];

  const externalResources = [
    {
      title: "SBA.gov Official Resources",
      description: "Official Small Business Administration guides and resources for business owners.",
      url: "https://www.sba.gov/business-guide",
      domain: "sba.gov"
    },
    {
      title: "SCORE Business Planning Tools",
      description: "Free business planning templates and mentoring resources from SCORE.",
      url: "https://www.score.org/take-course",
      domain: "score.org"
    },
    {
      title: "Federal Reserve Economic Data",
      description: "Current economic indicators and interest rate trends affecting business lending.",
      url: "https://fred.stlouisfed.org",
      domain: "stlouisfed.org"
    }
  ];

  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Finance Resource Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides, tools, and insights to help you make informed business financing decisions. 
            Stay updated with the latest trends and expert analysis in commercial lending.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Expert Guides & Articles</h2>
            <Link to="/resources" className="text-primary hover:underline">View All Resources →</Link>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow ${guide.featured ? 'border-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={guide.featured ? "default" : "secondary"}>
                      {guide.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {guide.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <Button asChild variant={guide.featured ? "default" : "outline"} className="w-full">
                    <Link to={guide.link} className="inline-flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Read Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Business Finance Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={tool.link}>Use Tool</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Reports */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Industry Reports & Research</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {industryReports.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <span className="text-sm text-muted-foreground">{report.pages}</span>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <Button asChild className="w-full">
                    <a href={report.downloadLink} className="inline-flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Report
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Trusted Industry Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {externalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-primary">{resource.domain}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Resource
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
          <Card className="bg-gradient-to-r from-primary to-financial-navy text-white">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Apply Your Knowledge?</h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                Use these resources to prepare your business for financing, then get pre-qualified to see your options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link to="/auth">Get Pre-Qualified</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
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

export default ContentHub;