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
  }, {
    title: "Debt and Equity",
    href: "/debt-and-equity",
    items: [{
      title: "Debt Financing",
      href: "/debt-financing"
    }, {
      title: "Equity Financing",
      href: "/equity-financing"
    }, {
      title: "Mezzanine Financing",
      href: "/mezzanine-financing"
    }, {
      title: "Private Placement",
      href: "/private-placement"
    }]
  }];
  return <header className="relative bg-white z-30">
      {/* Primary Navigation Bar - Hidden on mobile, only visible on desktop */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-12 px-6">
            {/* Left Side - Company and Resources Navigation */}
            <nav className="flex items-center space-x-6">
              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors group">
                  Company
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/company-overview" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Company Overview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/how-it-works" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        How it Works
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/marketplace-benefits" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Marketplace Benefits
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/careers" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Careers
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Marketplace Benefits Button */}
              <Link to="/marketplace-benefits" className="px-2 py-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                Marketplace Benefits
              </Link>
              
              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors group">
                  Resources
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/loan-calculator" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Loan Calculator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/industry-solutions" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Industry Solutions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/sba-loans" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        SBA Resources
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Partners Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors group">
                  Partners
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/brokers" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Brokers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/lenders" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Lenders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/referral-partners" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Referral Partners
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Side - Search, Customer Support and Sign In */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-primary">
                <Search className="h-5 w-5" />
              </button>
              
              
              
              {/* Customer Support Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center gap-1 text-xs text-gray-600 hover:text-primary transition-colors group">
                  <Phone className="h-3 w-3" />
                  Customer Support
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <a href="tel:+18007308461" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        <Phone className="h-4 w-4 mr-3" />
                        Call (800) 730-8461
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/contact-us" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Contact Us
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/customer-service" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Customer Service
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/technical-support" className="flex items-center text-gray-700 hover:text-primary font-medium">
                        Technical Support
                      </Link>
                    </DropdownMenuItem>
                    <ConsultationPopup trigger={<DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1">
                          <span className="flex items-center text-gray-700 hover:text-primary font-medium cursor-pointer">
                            Schedule Consultation
                          </span>
                        </DropdownMenuItem>} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <a href="https://app.halolending.com/login" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-sm uppercase tracking-wide flex items-center gap-1 transition-colors px-[10px] py-[10px]">
                <Shield className="h-2.5 w-2.5" />
                CLIENT PORTAL
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Row - Second tier */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-[24px]">
            {/* Mobile Menu Button */}
            <button className={`lg:hidden p-2 rounded-md hover:bg-gray-100 z-[80] ${isOpen ? 'hidden' : 'flex items-center justify-center'}`} onClick={handleMobileMenuToggle} aria-label="Toggle navigation">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Logo - centered on mobile, left-aligned on desktop */}
            <Link to="/" className={`flex items-center transition-all duration-300 ${isOpen ? 'justify-center flex-1' : 'lg:flex-none flex-1 lg:flex-initial justify-center lg:justify-start'}`}>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap leading-none lg:text-xl">
                HALO BUSINESS FINANCE
              </span>
            </Link>
            
            {/* Spacer for mobile to center logo when menu button is present */}
            <div className="lg:hidden w-10"></div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar - Third tier */}
      <div className="bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-12 px-4 sm:px-6">
            {/* Secondary Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1">
              {secondaryNavWithDropdowns.map(item => <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2 px-1 group">
                    {item.title}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                    <div className="py-1">
                      {item.items.map(subItem => <DropdownMenuItem key={subItem.title} className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                          <Link to={subItem.href} className="flex items-center text-gray-700 hover:text-primary font-medium text-sm">
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>)}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>)}
            </nav>
            
            {/* Get Started Button - positioned at the right */}
            <div className="hidden lg:block ml-auto">
              <Button className="bg-primary hover:bg-primary/90 text-white text-base font-bold px-4 py-2 rounded-md flex items-center gap-1" asChild>
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