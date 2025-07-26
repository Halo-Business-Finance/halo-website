import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
    { name: "SBA Loans", link: "/sba-loans" },
    { name: "Bridge Loans", link: "/bridge-loans" },
    { name: "Conventional Loans", link: "/conventional-loans" },
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
    { name: "Loan Calculator", link: "/loan-calculator" },
    { name: "Pre-qualification", link: "/pre-qualification" },
    { name: "Contact Us", link: "/contact-us" },
    { name: "Get Started", link: "/" },
    { name: "Learn More", link: "/resources" },
    { name: "Industry Solutions", link: "/industry-solutions" }
  ];

  const companyLinks = [
    { name: "Company Overview", link: "/company-overview" },
    { name: "About Us", link: "/about-us" },
    { name: "How It Works", link: "/how-it-works" },
    { name: "Marketplace Benefits", link: "/marketplace-benefits" },
    { name: "NMLS Compliance", link: "/nmls-compliance" }
  ];

  return (
    <footer className="bg-financial-navy text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company info and newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h3 className="text-2xl font-bold mb-4">
                  HALO <span className="text-primary">BUSINESS FINANCE</span>
                </h3>
              </Link>
              <p className="text-gray-300 mb-6">
                Nationwide commercial loan marketplace offering streamlined loan processes for SBA, commercial real estate, and equipment financing.
              </p>
            </div>

            {/* Newsletter signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Informed</h4>
              <p className="text-sm text-gray-300 mb-3">
                Get the latest financial insights and bank updates.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Company links - MOVED TO FIRST */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Programs */}
          <div>
            <h4 className="font-semibold mb-4">Loan Programs</h4>
            <ul className="space-y-2">
              {loanPrograms.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Links */}
          <div>
            <h4 className="font-semibold mb-4">Partner With Us</h4>
            <ul className="space-y-2">
              {partnerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Social media and bottom info */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Better Business Bureau */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-financial-navy font-bold text-lg leading-tight">
                  <div className="text-xs">BETTER</div>
                  <div className="text-xs">BUSINESS</div>
                  <div className="text-xs">BUREAU</div>
                  <div className="text-[10px] border-t border-financial-navy mt-1 pt-1">®</div>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">BBB Accredited</div>
                <div className="text-gray-300">Business Since 2019</div>
              </div>
            </div>

            {/* Social media */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Follow Us:</span>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/HaloBusinessFinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://x.com/halobizfinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/company/halobusinessfinance" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">Site Map</Link>
            </div>
          </div>

          {/* Copyright and disclosures */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-xs text-gray-400 space-y-2">
              <p>© 2024 Halo Business Finance. All rights reserved.</p>
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