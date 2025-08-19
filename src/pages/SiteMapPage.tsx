import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import sitemapHeader from "@/assets/sitemap-header.jpg";

const SiteMapPage = () => {
  const siteStructure = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "Company Overview", url: "/company-overview" },
        { name: "How It Works", url: "/how-it-works" },
        { name: "Marketplace Benefits", url: "/marketplace-benefits" },
        { name: "Contact Us", url: "/contact-us" },
        { name: "Business Finance Resources", url: "/business-finance-resources" },
        { name: "Customer Service", url: "/customer-service" },
        { name: "Technical Support", url: "/technical-support" }
      ]
    },
    {
      category: "SBA & USDA Loans",
      links: [
        { name: "SBA Loans Overview", url: "/sba-loans" },
        { name: "SBA 7(a) Loans", url: "/sba-7a-loans" },
        { name: "SBA 504 Loans", url: "/sba-504-loans" },
        { name: "SBA Express Loans", url: "/sba-express-loans" },
        { name: "SBA Microloans", url: "/sba-microloans" },
        { name: "USDA B&I Loans", url: "/usda-bi-loans" }
      ]
    },
    {
      category: "Commercial Loans",
      links: [
        { name: "Commercial Loans Overview", url: "/commercial-loans" },
        { name: "Conventional Loans", url: "/conventional-loans" },
        { name: "CMBS Loans", url: "/cmbs-loans" },
        { name: "Portfolio Loans", url: "/portfolio-loans" },
        { name: "Construction Loans", url: "/construction-loans" },
        { name: "Bridge Financing", url: "/bridge-financing" },
        { name: "Multifamily Loans", url: "/multifamily-loans" },
        { name: "Asset-Based Loans", url: "/asset-based-loans" }
      ]
    },
    {
      category: "Equipment Financing",
      links: [
        { name: "Equipment Financing Overview", url: "/equipment-financing" },
        { name: "Equipment Loans", url: "/equipment-loans" },
        { name: "Equipment Leasing", url: "/equipment-leasing" },
        { name: "Heavy Equipment", url: "/heavy-equipment" },
        { name: "Medical Equipment", url: "/medical-equipment" }
      ]
    },
    {
      category: "Capital Markets",
      links: [
        { name: "Capital Markets Overview", url: "/capital-markets" },
        { name: "Working Capital", url: "/working-capital" },
        { name: "Business Line of Credit", url: "/business-line-of-credit" },
        { name: "Term Loans", url: "/term-loans" },
        { name: "Factoring-Based Financing", url: "/factoring-based-financing" }
      ]
    },
    {
      category: "Tools & Resources",
      links: [
        { name: "Loan Calculator", url: "/loan-calculator" },
        { name: "Industry Solutions", url: "/industry-solutions" }
      ]
    },
    {
      category: "Loan Applications",
      links: [
        { name: "SBA Loan Application", url: "/sba-loan-application" },
        { name: "SBA 504 Loan Application", url: "/sba-504-application" },
        { name: "Equipment Loan Application", url: "/equipment-loan-application" },
        { name: "Working Capital Application", url: "/working-capital-application" },
        { name: "Commercial Real Estate Application", url: "/commercial-real-estate-application" },
        { name: "Conventional Loan Application", url: "/conventional-loan-application" },
        { name: "Bridge Loan Application", url: "/bridge-loan-application" },
        { name: "Business Line of Credit Application", url: "/business-line-of-credit-application" },
        { name: "Term Loan Application", url: "/term-loan-application" }
      ]
    },
    {
      category: "Partners & Professionals",
      links: [
        { name: "Brokers", url: "/brokers" },
        { name: "Lenders", url: "/lenders" },
        { name: "Careers", url: "/careers" }
      ]
    },
    {
      category: "Security & Compliance",
      links: [
        { name: "Security", url: "/security" },
        { name: "Security Dashboard", url: "/security-dashboard" },
        { name: "NMLS Compliance", url: "/nmls-compliance" },
        { name: "Company Licenses", url: "/company-licenses" }
      ]
    },
    {
      category: "Legal & Information",
      links: [
        { name: "Privacy Policy", url: "/privacy-policy" },
        { name: "Terms of Service", url: "/terms-of-service" },
        { name: "Accessibility", url: "/accessibility" },
        { name: "Site Map", url: "/sitemap" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={sitemapHeader} 
          alt="Website organization and navigation structure in professional business setting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <MapPin className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Site Map</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Navigate our website easily with this comprehensive overview of all our pages and resources.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {siteStructure.map((section, index) => (
                <Card key={index} className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">{section.category}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.url}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{link.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Card className="inline-block">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                      <a href="https://preview--hbf-application.lovable.app/auth">Get Pre-Qualified</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/loan-calculator">Calculate Payment</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact-us">Contact Us</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 bg-muted rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Need Help Finding Something?</h2>
              <p className="text-muted-foreground text-center mb-6">
                Can't find what you're looking for? Our team is here to help you navigate our services and find the right financing solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/contact-us">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:(800) 730-8461">Call (800) 730-8461</a>
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Last updated: December 2024</p>
              <p className="mt-2">
                This site map provides an overview of our main pages. Some pages may have additional sub-sections or related content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SiteMapPage;