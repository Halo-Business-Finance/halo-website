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
  const loanPrograms = [
    "SBA 7(a) Loans",
    "SBA 504 Loans", 
    "Commercial Real Estate",
    "Equipment Financing",
    "Working Capital",
    "Business Line of Credit"
  ];

  const industries = [
    "Retail Industry",
    "Auto Repair",
    "Medical Industry",
    "Food & Beverage",
    "Manufacturing",
    "Professional Services"
  ];

  const supportLinks = [
    "Loan Calculator",
    "Pre-qualification",
    "Contact Us",
    "Get Started",
    "Learn More",
    "Industry Solutions"
  ];

  const companyLinks = [
    "About Us",
    "How It Works",
    "Marketplace Benefits",
    "NMLS Compliance",
    "Privacy Policy",
    "Terms of Service"
  ];

  const brokerLinks = [
    "Become a Broker Partner",
    "Broker Portal",
    "Commission Structure",
    "Marketing Resources",
    "Training & Support",
    "Broker Application"
  ];

  const lenderLinks = [
    "Become a Lender",
    "Lender Portal",
    "Loan Requirements",
    "Underwriting Guidelines",
    "Platform Benefits",
    "Lender Application"
  ];

  return (
    <footer className="bg-financial-navy text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-8 gap-8 mb-8">
          {/* Company info and newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">
                HALO <span className="text-primary">BUSINESS FINANCE</span>
              </h3>
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

            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(800) 730-8461</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@halobusinessfinance.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Irvine, California</span>
              </div>
            </div>
          </div>

          {/* Loan Programs */}
          <div>
            <h4 className="font-semibold mb-4">Loan Programs</h4>
            <ul className="space-y-2">
              {loanPrograms.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold mb-4">Industries We Serve</h4>
            <ul className="space-y-2">
              {industries.map((link) => (
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

          {/* Broker Links */}
          <div>
            <h4 className="font-semibold mb-4">For Brokers</h4>
            <ul className="space-y-2">
              {brokerLinks.map((link) => (
                <li key={link}>
                  <a href="/brokers" className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Lender Links */}
          <div>
            <h4 className="font-semibold mb-4">For Lenders</h4>
            <ul className="space-y-2">
              {lenderLinks.map((link) => (
                <li key={link}>
                  <a href="/lenders" className="text-sm text-gray-300 hover:text-white transition-colors">
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
              <p>© 2024 Halo Business Finance. All rights reserved.</p>
              <p>
                NMLS ID: 2272778. Commercial Loan Marketplace. 
                Loan programs subject to credit approval and terms may vary by lender.
              </p>
              <p>
                Halo Business Finance is a commercial loan marketplace connecting borrowers with lenders. 
                We are not a direct lender.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;