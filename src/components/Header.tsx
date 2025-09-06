import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Phone, ChevronDown, Shield, User, LogOut, Lock, LayoutDashboard, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ConsultationPopup from "@/components/ConsultationPopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Simplified for public website - no auth required
  const user = null;
  const userRole = null;
  const isAdmin = false;
  const signOut = async () => {};

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
        { title: "Asset Based Loans", href: "/asset-based-loans" }
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
      title: "Business Capital", 
      href: "/capital-markets",
      items: [
        { title: "Term Loans", href: "/term-loans" },
        { title: "Working Capital", href: "/working-capital" },
        { title: "Business Line of Credit", href: "/business-line-of-credit" },
        { title: "Factoring Based Financing", href: "/factoring-based-financing" }
      ]
    },
    { 
      title: "Industry Solutions", 
      href: "/industry-solutions",
      items: [
        { title: "Restaurant Financing", href: "/industry-solutions#restaurant" },
        { title: "Healthcare Financing", href: "/industry-solutions#healthcare" },
        { title: "Manufacturing", href: "/industry-solutions#manufacturing" },
        { title: "Retail Financing", href: "/industry-solutions#retail" },
        { title: "Construction", href: "/industry-solutions#construction" },
        { title: "Transportation", href: "/industry-solutions#transportation" }
      ]
    }
  ];

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-financial-navy text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:(800) 730-8461" className="hover:text-primary-glow transition-colors">
                (800) 730-8461
              </a>
            </span>
            <span className="hidden md:inline">Mon-Fri 8AM-6PM PST</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/resources" className="hover:text-primary-glow transition-colors text-sm">
              Resources
            </Link>
            <Link to="/company-overview" className="hover:text-primary-glow transition-colors text-sm">
              About
            </Link>
            <Link to="/contact-us" className="hover:text-primary-glow transition-colors text-sm">
              Contact
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-financial-blue">
                    <User className="h-4 w-4 mr-2" />
                    Account
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/security-dashboard" className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Security Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/soc-compliance" className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      SOC Compliance
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/zero-trust" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Zero Trust Security
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="text-white hover:text-primary-glow transition-colors text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-financial-blue to-financial-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-bold text-foreground">Halo Business Finance</div>
                <div className="text-xs text-muted-foreground">Commercial Loan Marketplace</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {secondaryNavWithDropdowns.map((item) => (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-foreground hover:text-primary">
                    <span>{item.title}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.items?.map((subItem) => (
                    <DropdownMenuItem key={subItem.title} asChild>
                      <Link to={subItem.href} className="w-full">
                        {subItem.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-primary"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            
            <ConsultationPopup trigger={
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                Get Free Consultation
              </Button>
            } />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {primaryNav.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={`block py-2 text-base font-medium ${
                  item.active
                    ? "text-primary border-l-4 border-primary pl-4"
                    : "text-muted-foreground hover:text-primary pl-4"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <ConsultationPopup trigger={
                <Button variant="default" className="w-full">
                  Get Free Consultation
                </Button>
              } />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
