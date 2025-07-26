import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer = () => {
  const bankingLinks = [
    "Personal Banking",
    "Business Banking", 
    "Commercial Banking",
    "Wealth Management",
    "Investment Services",
    "Insurance Services"
  ];

  const productLinks = [
    "Checking Accounts",
    "Savings Accounts",
    "Credit Cards",
    "Home Loans",
    "Auto Loans",
    "Personal Loans"
  ];

  const supportLinks = [
    "Customer Service",
    "Contact Us",
    "Find a Branch",
    "ATM Locator",
    "Security Center",
    "Help & FAQs"
  ];

  const companyLinks = [
    "About Us",
    "Careers",
    "Investor Relations",
    "Press Room",
    "Community",
    "Sustainability"
  ];

  return (
    <footer className="bg-financial-navy text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company info and newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">
                HALO <span className="text-primary">FINANCE</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Your trusted financial partner for over 50 years. Experience modern banking with the personal touch you deserve.
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

            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-HALO-BANK</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@halofinance.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Find a Branch Near You</span>
              </div>
            </div>
          </div>

          {/* Banking links */}
          <div>
            <h4 className="font-semibold mb-4">Banking</h4>
            <ul className="space-y-2">
              {bankingLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products links */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media and bottom info */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social media */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Follow Us:</span>
              <div className="flex gap-3">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors">Site Map</a>
            </div>
          </div>

          {/* Copyright and disclosures */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-xs text-gray-400 space-y-2">
              <p>© 2024 Halo Finance. All rights reserved.</p>
              <p>
                Member FDIC. Equal Housing Lender. NMLS ID #123456. 
                Investment products are not FDIC insured, are not bank guaranteed, and may lose value.
              </p>
              <p>
                Halo Finance is a trademark of Halo Financial Corporation. 
                All other trademarks are the property of their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;