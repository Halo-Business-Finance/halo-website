import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Phone, ChevronDown, Shield, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
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
    console.log("Mobile menu button clicked, current state:", isOpen);
    setIsOpen(!isOpen);
    console.log("Setting menu to:", !isOpen);
  };

  // Primary navigation (top level)
  const primaryNav = [
    { title: "Company", href: "/company" },
    { title: "Business", href: "/business", active: true },
    { title: "Commercial", href: "/commercial" },
    { title: "Equipment", href: "/equipment" },
    { title: "Resources", href: "/resources" },
    { title: "About Us", href: "/company-overview" }
  ];

  // Secondary navigation (under Business)
  const secondaryNav = [
    { title: "SBA Loans", href: "/sba-loans" },
    { title: "Commercial Loans", href: "/commercial-loans" },
    { title: "Equipment Financing", href: "/equipment-financing" },
    { title: "Business Capital", href: "/business-capital" },
    { title: "Loan Calculator", href: "/loan-calculator" }
  ];

  const menuItems = {
    "Company": {
      title: "Company",
      href: "/company",
      items: ["Company Overview", "How it Works", "Marketplace Benefits", "Contact Us"]
    },
    "SBA & USDA Loans": {
      title: "SBA & USDA Loans",
      href: "/sba-loans",
      items: ["SBA 7(a) Loans", "SBA 504 Loans", "USDA B&I Loans"]
    },
    "Commercial Loans": {
      title: "Commercial Loans", 
      href: "/commercial-loans",
      items: ["Conventional Loans", "CMBS Loans", "Portfolio Loans", "Construction Loans", "Bridge Financing", "Multifamily Loans", "Asset-Based Loans"]
    },
    "Equipment Financing": {
      title: "Equipment Financing",
      href: "/equipment-financing", 
      items: ["Equipment Loans", "Equipment Leasing", "Heavy Equipment", "Medical Equipment"]
    },
    "Business Capital": {
      title: "Business Capital",
      href: "/business-capital",
      items: ["Working Capital", "Business Line of Credit", "Term Loans", "SBA Express Loans", "Factoring-Based Financing"]
    },
    "Resources": {
      title: "Resources",
      href: "/resources",
      items: ["Business Resources", "Loan Calculator", "Industry Solutions", "Customer Service", "Technical Support"]
    }
  };

  const linkMap: { [key: string]: { [key: string]: string } } = {
    "Company": {
      "Company Overview": "/company-overview",
      "How it Works": "/how-it-works",
      "Marketplace Benefits": "/marketplace-benefits",
      "Contact Us": "/contact-us"
    },
    "SBA & USDA Loans": {
      "SBA 7(a) Loans": "/sba-7a-loans",
      "SBA 504 Loans": "/sba-504-loans", 
      "USDA B&I Loans": "/usda-bi-loans"
    },
    "Commercial Loans": {
      "Conventional Loans": "/conventional-loans",
      "CMBS Loans": "/cmbs-loans",
      "Portfolio Loans": "/portfolio-loans",
      "Construction Loans": "/construction-loans",
      "Bridge Financing": "/bridge-financing",
      "Multifamily Loans": "/multifamily-loans",
      "Asset-Based Loans": "/asset-based-loans"
    },
    "Equipment Financing": {
      "Equipment Loans": "/equipment-loans",
      "Equipment Leasing": "/equipment-leasing",
      "Heavy Equipment": "/heavy-equipment",
      "Medical Equipment": "/medical-equipment"
    },
    "Business Capital": {
      "Working Capital": "/working-capital",
      "Business Line of Credit": "/business-line-of-credit",
      "Term Loans": "/term-loans",
      "SBA Express Loans": "/sba-express-loans",
      "Factoring-Based Financing": "/factoring-based-financing"
    },
    "Resources": {
      "Business Resources": "/business-finance-resources",
      "Loan Calculator": "/loan-calculator",
      "Industry Solutions": "/industry-solutions",
      "Customer Service": "/customer-service",
      "Technical Support": "/technical-support"
    }
  };

  const getItemLink = (parentTitle: string, itemTitle: string) => {
    return linkMap[parentTitle]?.[itemTitle] || "#";
  };

  return (
    <header className="relative bg-white shadow-sm border-b border-gray-200 z-40">
      {/* BMO-style two-tier navigation */}
      <div className="w-full">
        {/* Primary Navigation Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              {/* Primary Navigation Links */}
              <nav className="flex items-center space-x-8">
                {primaryNav.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={`text-sm font-medium transition-colors relative ${
                      item.active 
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-3' 
                        : 'text-gray-700 hover:text-blue-600 pb-3'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Right Side - Phone and Sign In */}
              <div className="flex items-center space-x-4">
                <a 
                  href="tel:+18007308461" 
                  className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  (800) 730-8461
                </a>
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-sm font-medium px-3 py-1 h-8">
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
                        <DropdownMenuItem asChild>
                          <Link to="/security-dashboard">
                            <Shield className="h-4 w-4 mr-2" />
                            Security Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md" 
                    asChild
                  >
                    <Link to="/auth">
                      SIGN IN
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png"
                  alt="Halo Business Finance"
                  className="h-12 w-auto"
                />
              </Link>

              {/* Secondary Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2"
                onClick={handleMobileMenuToggle}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
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
            <div className="flex flex-col gap-4 p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <span className="text-lg">×</span>
                </Button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="space-y-4">
                {primaryNav.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block text-gray-600 hover:text-blue-600 py-1 pl-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                
                {!user && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;