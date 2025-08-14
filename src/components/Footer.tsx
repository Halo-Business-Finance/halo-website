import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer = () => {
  const loanPrograms = [
    { name: "SBA 7a Loans", link: "/sba-7a-loans" },
    { name: "SBA 504 Loans", link: "/sba-504-loans" },
    { name: "Bridge Loans", link: "/bridge-financing" },
    { name: "Conventional Loans", link: "/conventional-loans" },
    { name: "USDA Loans", link: "/usda-bi-loans" },
    { name: "Equipment Financing", link: "/equipment-financing" },
    { name: "Working Capital", link: "/working-capital" },
    { name: "Business Line of Credit", link: "/business-line-of-credit" }
  ];

  const partnerLinks = [
    { name: "Become a Broker", link: "/brokers" },
    { name: "Broker Resources", link: "/brokers" },
    { name: "Become a Lender", link: "/lenders" },
    { name: "Partnership Benefits", link: "/lenders" }
  ];

  const supportLinks = [
    { name: "Customer Service", link: "/customer-service" },
    { name: "Technical Support", link: "/technical-support" }
  ];

  const resourceLinks = [
    { name: "Business Resources", link: "/business-finance-resources" },
    { name: "Loan Calculator", link: "/loan-calculator" },
    { name: "Industry Solutions", link: "/industry-solutions" },
    { name: "SBA Resources", link: "/sba-loans" },
    { name: "Market Insights", link: "/resources" }
  ];

  const companyLinks = [
    { name: "Company Overview", link: "/company-overview" },
    { name: "How It Works", link: "/how-it-works" },
    { name: "Marketplace Benefits", link: "/marketplace-benefits" },
    { name: "Contact Us", link: "/contact-us" },
    { name: "Careers", link: "/careers" }
  ];

  return (
    <footer className="bg-financial-navy text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-8 mb-8 items-start">
          {/* Company info and newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="inline-block mb-4">
                <img 
                  src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png" 
                  alt="Halo Business Finance logo" 
                  className="h-40 w-auto filter brightness-0 invert"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <p className="text-white mb-6">
                Nationwide commercial loan marketplace offering streamlined loan processes for SBA, commercial real estate, and equipment financing.
              </p>
            </div>

            {/* Newsletter signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Informed</h4>
              <p className="text-sm text-white mb-3">
                Get the latest financial insights and market updates.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button size="sm" className="bg-primary">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Company links - MOVED TO FIRST */}
          <div className="mt-16">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Programs */}
          <div className="mt-16">
            <h4 className="font-semibold mb-4">Loan Programs</h4>
            <ul className="space-y-2">
              {loanPrograms.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Links */}
          <div className="mt-16">
            <h4 className="font-semibold mb-4">Partner With Us</h4>
            <ul className="space-y-2">
              {partnerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="mt-16">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="mt-16">
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <ConsultationPopup 
                  trigger={
                    <button className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left bg-transparent border-none p-0 text-left cursor-pointer">
                      Schedule Consultation
                    </button>
                  }
                />
              </li>
              <li>
                <Link to="/security" className="text-sm text-white hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                  Security & Data Protection
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Social media and bottom info */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Better Business Bureau */}
            <div className="flex items-center gap-3">
              <a href="https://www.bbb.org/us/ca/irvine/profile/small-business-loans/halo-business-finance-corp-1126-1000144399/#sealclick" target="_blank" rel="nofollow">
                <img 
                  src="https://seal-central-northern-western-arizona.bbb.org/seals/blue-seal-96-50-bbb-1000144399.png" 
                  style={{border: 0}} 
                  alt="Halo Business Finance Corp BBB Business Review" 
                  className="h-12 w-auto"
                />
              </a>
              <div className="text-sm">
                <div className="font-semibold">BBB Accredited</div>
                <div className="text-white">Business Since 2019</div>
              </div>
            </div>

            {/* Social media */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Follow Us:</span>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/HaloBusinessFinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200">
                  <Facebook className="h-4 w-4 text-white" />
                </a>
                <a href="https://x.com/halobizfinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200">
                  <Twitter className="h-4 w-4 text-white" />
                </a>
                <a href="https://www.linkedin.com/company/halobusinessfinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200">
                  <Linkedin className="h-4 w-4 text-white" />
                </a>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <Link to="/company-licenses" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Company Licenses</Link>
              <Link to="/nmls-compliance" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">NMLS Compliance</Link>
              <Link to="/cfipa" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">CFIPA</Link>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Terms of Use</Link>
              <Link to="/accessibility" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-primary transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Site Map</Link>
            </div>
          </div>

          {/* Copyright and disclosures */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-xs text-white space-y-2">
              <p>© 2025 Halo Business Finance. All rights reserved.</p>
              <p>
                DFPI CFL License No. 60DBO-178064. California Commercial Financing Law disclosures available upon request.
              </p>
              <p>
                NMLS ID: 2272778. Commercial Loan Marketplace. 
                Loan programs subject to credit approval and terms may vary by lender.
              </p>
              <p>
                Halo Business Finance is a direct CRE & equipment lender providing commercial financing solutions 
                to businesses nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;