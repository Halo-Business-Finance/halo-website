import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Phone, ChevronDown, Shield, User, LogOut, Lock, LayoutDashboard, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  // Keep primary nav for mobile menu only
  const primaryNav = [{
    title: "Personal",
    href: "/"
  }, {
    title: "Business",
    href: "/",
    active: true
  }, {
    title: "Commercial",
    href: "/commercial-loans"
  }, {
    title: "Equipment",
    href: "/equipment-financing"
  }, {
    title: "Capital Markets",
    href: "/capital-markets"
  }, {
    title: "Resources",
    href: "/resources"
  }, {
    title: "About Us",
    href: "/company-overview"
  }];

  // Secondary navigation without Resources (moved to top bar)
  const secondaryNavWithDropdowns = [{
    title: "SBA Loans",
    href: "/sba-loans",
    items: [{
      title: "SBA 7(a) Loans",
      href: "/sba-7a-loans"
    }, {
      title: "SBA 504 Loans",
      href: "/sba-504-loans"
    }, {
      title: "SBA Express Loans",
      href: "/sba-express-loans"
    }]
  }, {
    title: "USDA Loans",
    href: "/usda-bi-loans",
    items: [{
      title: "USDA B&I Loans",
      href: "/usda-bi-loans"
    }, {
      title: "USDA Rural Development",
      href: "/usda-rural-development"
    }]
  }, {
    title: "Commercial Loans",
    href: "/commercial-loans",
    items: [{
      title: "Conventional Loans",
      href: "/conventional-loans"
    }, {
      title: "CMBS Loans",
      href: "/cmbs-loans"
    }, {
      title: "Portfolio Loans",
      href: "/portfolio-loans"
    }, {
      title: "Construction Loans",
      href: "/construction-loans"
    }, {
      title: "Bridge Financing",
      href: "/bridge-financing"
    }, {
      title: "Multifamily Loans",
      href: "/multifamily-loans"
    }, {
      title: "Asset-Based Loans",
      href: "/asset-based-loans"
    }]
  }, {
    title: "Equipment Financing",
    href: "/equipment-financing",
    items: [{
      title: "Equipment Loans",
      href: "/equipment-loans"
    }, {
      title: "Equipment Leasing",
      href: "/equipment-leasing"
    }, {
      title: "Heavy Equipment",
      href: "/heavy-equipment"
    }, {
      title: "Medical Equipment",
      href: "/medical-equipment"
    }]
  }, {
    title: "Capital Markets",
    href: "/capital-markets",
    items: [{
      title: "Working Capital",
      href: "/working-capital"
    }, {
      title: "Business Line of Credit",
      href: "/business-line-of-credit"
    }, {
      title: "Term Loans",
      href: "/term-loans"
    }, {
      title: "Factoring-Based Financing",
      href: "/factoring-based-financing"
    }]
  }];
  return <header className="relative z-50 w-full">
      {/* Combined Logo and Utility Bar */}
      <div className="border-b border-white/10" style={{ backgroundColor: '#0a1628' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between h-12 px-4 sm:px-8">
            {/* Mobile Menu Button */}
            <button className={`lg:hidden p-2 rounded-md hover:bg-white/10 z-[80] ${isOpen ? 'hidden' : 'flex items-center justify-center'}`} onClick={handleMobileMenuToggle} aria-label="Toggle navigation">
              <Menu className="h-6 w-6 text-white/80" />
            </button>
            
            {/* Logo */}
            <Link to="/" className={`flex items-center transition-all duration-300 ${isOpen ? 'justify-center flex-1' : 'lg:flex-none flex-1 lg:flex-initial justify-center lg:justify-start lg:ml-4'}`}>
              <span className="text-xl sm:text-2xl lg:text-[22px] font-bold text-white whitespace-nowrap leading-none tracking-tight">
                HALO BUSINESS FINANCE
              </span>
            </Link>
            
            {/* Spacer for mobile to center logo when menu button is present */}
            <div className="lg:hidden w-10"></div>

            {/* Right Side - Search, Customer Support and Sign In (Desktop only) */}
            <div className="hidden lg:flex items-center gap-6">
              <button className="text-white/60 hover:text-white transition-colors" aria-label="Search">
                <Search className="h-4 w-4" />
              </button>
              
              {/* Customer Support Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[13px] font-medium text-white/80 hover:text-white transition-colors group">
                  <Phone className="h-3 w-3" />
                  Customer Support
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-md p-1 min-w-[200px] mt-1 z-50">
                  <DropdownMenuItem className="rounded-sm hover:bg-gray-50 transition-colors p-2" asChild>
                    <a href="tel:+18007308461" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium">
                      <Phone className="h-4 w-4 mr-2" />
                      Call (800) 730-8461
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-sm hover:bg-gray-50 transition-colors p-2" asChild>
                    <Link to="/contact-us" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Contact Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-sm hover:bg-gray-50 transition-colors p-2" asChild>
                    <Link to="/customer-service" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Customer Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-sm hover:bg-gray-50 transition-colors p-2" asChild>
                    <Link to="/technical-support" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Technical Support
                    </Link>
                  </DropdownMenuItem>
                  <ConsultationPopup trigger={<DropdownMenuItem className="rounded-sm hover:bg-gray-50 transition-colors p-2">
                        <span className="text-sm text-gray-700 hover:text-primary font-medium cursor-pointer">
                          Schedule Consultation
                        </span>
                      </DropdownMenuItem>} />
                </DropdownMenuContent>
              </DropdownMenu>
              
              <a href="https://app.halolending.com/login" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white text-[13px] font-bold rounded-md flex items-center gap-1 transition-colors px-4 py-1.5">
                <Shield className="h-4 w-4" />
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar - Third tier with horizontal menu items */}
      <div className="hidden lg:block border-b border-white/5" style={{ backgroundColor: '#112845' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center h-12 px-8">
            {/* Horizontal Navigation - All items visible */}
            <nav className="flex items-center gap-2 flex-1">
              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[14px] font-semibold text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all whitespace-nowrap group">
                  Company
                  <ChevronDown className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-xl rounded-lg p-2 min-w-[240px] mt-1 z-50">
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/company-overview" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Company Overview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/how-it-works" className="text-sm text-gray-700 hover:text-primary font-medium">
                      How it Works
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/marketplace-benefits" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Marketplace Benefits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/careers" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Careers
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {secondaryNavWithDropdowns.map(item => (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-[14px] font-semibold text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all whitespace-nowrap group">
                    {item.title}
                    <ChevronDown className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-xl rounded-lg p-2 min-w-[240px] mt-1 z-50">
                    {item.items.map(subItem => (
                      <DropdownMenuItem key={subItem.title} className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                        <Link to={subItem.href} className="text-sm text-gray-700 hover:text-primary font-medium">
                          {subItem.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
              
              {/* Partners Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[14px] font-semibold text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all whitespace-nowrap group">
                  Partners
                  <ChevronDown className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-xl rounded-lg p-2 min-w-[240px] mt-1 z-50">
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/brokers" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Brokers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/lenders" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Lenders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/referral-partners" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Referral Partners
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[14px] font-semibold text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all whitespace-nowrap group">
                  Resources
                  <ChevronDown className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-xl rounded-lg p-2 min-w-[240px] mt-1 z-50">
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/loan-calculator" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Loan Calculator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/industry-solutions" className="text-sm text-gray-700 hover:text-primary font-medium">
                      Industry Solutions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md hover:bg-primary/5 transition-colors p-2.5 cursor-pointer" asChild>
                    <Link to="/sba-loans" className="text-sm text-gray-700 hover:text-primary font-medium">
                      SBA Resources
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            
            {/* Get Started Button */}
            <div className="ml-auto">
              <Button className="bg-primary hover:bg-primary/90 text-white text-[14px] font-bold px-5 py-2 rounded-md flex items-center gap-2 shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/loan-calculator">
                  <Lock className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && <>
          <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden transition-opacity duration-300" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl overflow-y-auto lg:hidden transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">HALO BUSINESS FINANCE</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl text-gray-500 leading-none">×</span>
              </Button>
            </div>
            
            <div className="px-4 py-6">
              {/* Get Started CTA */}
              <div className="mb-6">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200" asChild>
                  <Link to="/loan-calculator" onClick={() => setIsOpen(false)}>
                    Get Pre-Qualified Now
                  </Link>
                </Button>
              </div>

              {/* Contact Information */}
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+18007308461" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                    (800) 730-8461
                  </a>
                </div>
                <p className="text-sm text-gray-600">Speak with a loan specialist</p>
              </div>
              
              {/* Navigation Sections */}
              <div className="space-y-4">
                {/* Company Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Company</h3>
                  <div className="space-y-1">
                    <Link to="/company-overview" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Company Overview
                    </Link>
                    <Link to="/how-it-works" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      How it Works
                    </Link>
                    <Link to="/marketplace-benefits" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Marketplace Benefits
                    </Link>
                    <Link to="/careers" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Careers
                    </Link>
                  </div>
                </div>

                {/* Loan Services Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Loan Services</h3>
                  <div className="space-y-3">
                    {secondaryNavWithDropdowns.map(item => <div key={item.title} className="space-y-1">
                        <div className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-50 rounded-md">
                          {item.title}
                        </div>
                         <div className="pl-3 space-y-1">
                           {item.items.map(subItem => <Link key={subItem.title} to={subItem.href} className="block py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                               {subItem.title}
                             </Link>)}
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Resources Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Resources</h3>
                  <div className="space-y-1">
                    <Link to="/loan-calculator" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Loan Calculator
                    </Link>
                    <Link to="/industry-solutions" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Industry Solutions
                    </Link>
                    <Link to="/sba-loans" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      SBA Resources
                    </Link>
                  </div>
                </div>

                {/* Partners Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Partners</h3>
                  <div className="space-y-1">
                    <Link to="/brokers" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Brokers
                    </Link>
                    <Link to="/lenders" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Lenders
                    </Link>
                    <Link to="/referral-partners" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Referral Partners
                    </Link>
                  </div>
                </div>

                {/* Support Section */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Support</h3>
                  <div className="space-y-1">
                    <Link to="/contact-us" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Contact Us
                    </Link>
                    <Link to="/customer-service" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Customer Service
                    </Link>
                    <Link to="/technical-support" className="flex items-center py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium" onClick={() => setIsOpen(false)}>
                      Technical Support
                    </Link>
                    <ConsultationPopup trigger={<button className="flex items-center w-full py-2.5 px-3 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 font-medium text-left">
                          Schedule Consultation
                        </button>} />
                  </div>
                </div>
                
                {/* Client Portal Section */}
                <div className="border-t border-gray-100 pt-4">
                  <a href="https://app.halolending.com/login" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center" onClick={() => setIsOpen(false)}>
                    Client Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>}
    </header>;
};
export default Header;