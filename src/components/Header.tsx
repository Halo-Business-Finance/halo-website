import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Phone, ChevronDown, Shield, User, LogOut, Lock, LayoutDashboard, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import ConsultationPopup from "@/components/ConsultationPopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, userRole, isAdmin } = useAuth();

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  // Keep primary nav for mobile menu only
  const primaryNav = [
    { title: "Personal", href: "/" },
    { title: "Business", href: "/", active: true },
    { title: "Commercial", href: "/commercial-loans" },
    { title: "Equipment", href: "/equipment-financing" },
    { title: "Capital Markets", href: "/capital-markets" },
    { title: "Resources", href: "/resources" },
    { title: "About Us", href: "/company-overview" }
  ];

  // Secondary navigation without Resources (moved to top bar)
  const secondaryNavWithDropdowns = [
    { 
      title: "SBA Loans", 
      href: "/sba-loans",
      items: [
        { title: "SBA 7(a) Loans", href: "/sba-7a-loans" },
        { title: "SBA 504 Loans", href: "/sba-504-loans" },
        { title: "SBA Express Loans", href: "/sba-express-loans" }
      ]
    },
    { 
      title: "USDA Loans", 
      href: "/usda-bi-loans",
      items: [
        { title: "USDA B&I Loans", href: "/usda-bi-loans" },
        { title: "USDA Rural Development", href: "/usda-rural-development" }
      ]
    },
    { 
      title: "Commercial Loans", 
      href: "/commercial-loans",
      items: [
        { title: "Conventional Loans", href: "/conventional-loans" },
        { title: "CMBS Loans", href: "/cmbs-loans" },
        { title: "Portfolio Loans", href: "/portfolio-loans" },
        { title: "Construction Loans", href: "/construction-loans" },
        { title: "Bridge Financing", href: "/bridge-financing" },
        { title: "Multifamily Loans", href: "/multifamily-loans" },
        { title: "Asset-Based Loans", href: "/asset-based-loans" }
      ]
    },
    { 
      title: "Equipment Financing", 
      href: "/equipment-financing",
      items: [
        { title: "Equipment Loans", href: "/equipment-loans" },
        { title: "Equipment Leasing", href: "/equipment-leasing" },
        { title: "Heavy Equipment", href: "/heavy-equipment" },
        { title: "Medical Equipment", href: "/medical-equipment" }
      ]
    },
    { 
      title: "Capital Markets", 
      href: "/capital-markets",
      items: [
        { title: "Working Capital", href: "/working-capital" },
        { title: "Business Line of Credit", href: "/business-line-of-credit" },
        { title: "Term Loans", href: "/term-loans" },
        { title: "Factoring-Based Financing", href: "/factoring-based-financing" }
      ]
    },
    { 
      title: "Debt and Equity", 
      href: "/debt-and-equity",
      items: [
        { title: "Debt Financing", href: "/debt-financing" },
        { title: "Equity Financing", href: "/equity-financing" },
        { title: "Mezzanine Financing", href: "/mezzanine-financing" },
        { title: "Private Placement", href: "/private-placement" }
      ]
    }
  ];

  return (
    <header className="relative bg-white z-40">
      {/* Primary Navigation Bar - Hidden on mobile, only visible on desktop */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-12 px-6">
            {/* Left Side - Company and Resources Navigation */}
            <nav className="flex items-center space-x-6">
              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
                  Company
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/company-overview" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Company Overview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/how-it-works" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        How it Works
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/marketplace-benefits" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Marketplace Benefits
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/careers" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Careers
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Marketplace Benefits Button */}
              <Link 
                to="/marketplace-benefits" 
                className="px-2 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Marketplace Benefits
              </Link>
              
              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
                  Resources
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/loan-calculator" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Loan Calculator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/industry-solutions" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Industry Solutions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/sba-loans" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        SBA Resources
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Partners Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
                  Partners
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/brokers" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Brokers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/lenders" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Lenders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/referral-partners" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Referral Partners
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Side - Search, Customer Support and Sign In */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600">
                <Search className="h-5 w-5" />
              </button>
              
              
              
              {/* Customer Support Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors group">
                  <Phone className="h-3 w-3" />
                  Customer Support
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                  <div className="py-1">
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <a href="tel:+18007308461" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        <Phone className="h-4 w-4 mr-3" />
                        Call (800) 730-8461
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/contact-us" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Contact Us
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/customer-service" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Customer Service
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                      <Link to="/technical-support" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                        Technical Support
                      </Link>
                    </DropdownMenuItem>
                    <ConsultationPopup 
                      trigger={
                        <DropdownMenuItem className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1">
                          <span className="flex items-center text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
                            Schedule Consultation
                          </span>
                        </DropdownMenuItem>
                      }
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium px-3 py-1 h-8 text-gray-700 hover:text-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      {user.user_metadata?.display_name || user.email}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userRole && (
                      <DropdownMenuItem disabled>
                        <Shield className="h-4 w-4 mr-2" />
                        Role: {userRole}
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/soc-compliance">
                            <Award className="h-4 w-4 mr-2" />
                            SOC Compliance
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/security-dashboard">
                            <Shield className="h-4 w-4 mr-2" />
                            Security Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1 rounded-sm uppercase tracking-wide flex items-center gap-1" 
                  asChild
                >
                  <Link to="/auth">
                    <Shield className="h-2.5 w-2.5" />
                    SIGN IN
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logo Row - Second tier */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center lg:justify-between h-8 lg:h-12 px-4 sm:px-6">
            {/* Logo and Mobile Menu Button Container - Centered on mobile/tablet */}
            <div className="flex items-center justify-center gap-2">
              <Link to="/" className="flex items-center justify-center">
                <span className="text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap leading-none">
                  HALO BUSINESS FINANCE
                </span>
              </Link>
              
              {/* Mobile Menu Button - positioned next to logo */}
              <button 
                className="lg:hidden p-1.5 lg:p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
                onClick={handleMobileMenuToggle}
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar - Third tier */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-12 px-4 sm:px-6">
            {/* Secondary Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1">
              {secondaryNavWithDropdowns.map((item) => (
                <DropdownMenu key={item.title}>
                  <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 px-1 group">
                    {item.title}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[240px] mt-2 z-50">
                    <div className="py-1">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.title} className="rounded-md hover:bg-gray-50 transition-colors duration-200 p-2 mb-1" asChild>
                          <Link to={subItem.href} className="flex items-center text-gray-700 hover:text-blue-600 font-medium text-sm">
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
            
            {/* Get Started Button - positioned at the right */}
            <div className="hidden lg:block ml-auto">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-4 py-2 rounded-md flex items-center gap-1" 
                asChild
              >
                <Link to={user ? "/loan-calculator" : "/auth"}>
                  <Lock className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto lg:hidden">
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="space-y-6">
                {/* Company Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Company</h3>
                  <div className="space-y-2">
                    <Link to="/company-overview" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Company Overview
                    </Link>
                    <Link to="/how-it-works" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      How it Works
                    </Link>
                    <Link to="/marketplace-benefits" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Marketplace Benefits
                    </Link>
                    <Link to="/careers" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Careers
                    </Link>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resources</h3>
                  <div className="space-y-2">
                    <Link to="/loan-calculator" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Loan Calculator
                    </Link>
                    <Link to="/industry-solutions" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Industry Solutions
                    </Link>
                    <Link to="/sba-loans" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      SBA Resources
                    </Link>
                  </div>
                </div>

                {/* Partners Section */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Partners</h3>
                  <div className="space-y-2">
                    <Link to="/brokers" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Brokers
                    </Link>
                    <Link to="/lenders" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Lenders
                    </Link>
                    <Link to="/referral-partners" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Referral Partners
                    </Link>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Loan Services</h3>
                  {secondaryNavWithDropdowns.map((item) => (
                    <div key={item.title} className="mb-4">
                      <div className="font-medium text-gray-700 mb-2">{item.title}</div>
                      <div className="pl-4 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Support Section */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Customer Support</h3>
                  <div className="space-y-2">
                    <a 
                      href="tel:+18007308461" 
                      className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Call (800) 730-8461
                    </a>
                    <Link to="/contact-us" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Contact Us
                    </Link>
                    <Link to="/customer-service" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Customer Service
                    </Link>
                    <Link to="/technical-support" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
                      Technical Support
                    </Link>
                    <ConsultationPopup 
                      trigger={
                        <button className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors text-left w-full">
                          Schedule Consultation
                        </button>
                      }
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  
                  {!user && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;