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
    <header className="relative shadow-lg border-b border-slate-200/60 z-40 bg-white">
      {/* Top utility bar - Professional banking style */}
      <div className="bg-white">
        <div className="max-w-full mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden sm:block"></div> {/* Left spacer for desktop */}
            <span className="hidden sm:inline text-black font-bold text-center">Nationwide SBA & Commercial Loan Marketplace</span>
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <a href="tel:+18007308461" className="flex items-center gap-1 sm:gap-2 hover:text-financial-blue transition-colors font-medium text-slate-700 border-r border-slate-200 pr-2 sm:pr-4 text-xs sm:text-sm">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">(800) 730-8461</span>
                <span className="xs:hidden">Call</span>
              </a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-700 hover:text-financial-blue font-medium text-sm px-3 py-1 h-8">
                      <User className="h-4 w-4 mr-2" />
                      {user.user_metadata?.display_name || user.email}
                      <ChevronDown className="h-4 w-4 ml-2" />
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
                <Button variant="ghost" className="text-slate-700 hover:text-financial-blue font-medium text-sm px-3 py-1 h-8" asChild>
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="w-full px-4 pt-1 bg-white" aria-label="Main navigation">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-auto">
          {/* Logo and Menu Button Row */}
          <div className="relative flex justify-center items-center h-fit py-0.5">
            <Link to="/" className="block">
              <img
                src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png"
                alt="Halo Business Finance logo"
                className="h-20 w-auto relative z-10 drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }}
                loading="eager"
                decoding="async"
              />
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-financial-navy text-white p-3 rounded-lg z-[999] hover:bg-financial-navy/90 transition-colors"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu Overlay - Custom implementation */}
            {isOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsOpen(false)}
                />
                
                {/* Menu Panel */}
                <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto">
                  <div className="flex flex-col gap-4 p-4">
                    {/* Close button */}
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold text-financial-navy">Menu</h2>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0"
                      >
                        <span className="text-lg">×</span>
                      </Button>
                    </div>
                    
                    {/* Mobile CTA buttons */}
                    <div className="flex flex-col gap-3">
                      {user ? (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {user.user_metadata?.display_name || user.email}
                            {userRole && <span className="ml-2 text-xs">({userRole})</span>}
                          </div>
                          {isAdmin && (
                            <Button variant="outline" className="justify-start border-2" asChild>
                              <Link to="/security-dashboard" onClick={() => setIsOpen(false)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Security Dashboard
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" className="justify-start border-2" onClick={() => { signOut(); setIsOpen(false); }}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="justify-start border-2" asChild>
                          <Link to="/auth" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                      )}
                      <Button className="justify-start bg-financial-navy" asChild>
                        <Link to={user ? "/loan-calculator" : "/auth"} onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Mobile navigation */}
                    <div className="border-t pt-3 flex-1">
                      <nav className="flex flex-col gap-3">
                        {Object.entries(menuItems).map(([key, item]) => (
                          <div key={key} className="space-y-2">
                            <h3 className="font-bold text-base text-financial-navy">{item.title}</h3>
                            <div className="pl-3 space-y-1">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem}
                                  to={getItemLink(item.title, subItem)}
                                  className="block text-slate-600 hover:text-financial-blue transition-colors py-0.5 text-sm"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center h-16 w-full pt-1">
          {/* Desktop Navigation - Centered */}
          <div className="flex items-center justify-center flex-1 space-x-1">
            <Link to="/" className="mr-8 block relative">
              <img
                src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png"
                alt="Halo Business Finance logo"
                className="h-40 w-auto relative z-10 drop-shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ filter: 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.2))' }}
                loading="eager"
                decoding="async"
              />
            </Link>
            {Object.entries(menuItems).map(([key, item]) => (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger className="flex items-center px-4 py-3 text-slate-700 hover:text-financial-blue hover:bg-slate-50/80 font-medium text-sm transition-all duration-200 rounded-lg group relative mx-1">
                  {item.title}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-financial-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-slate-200 shadow-[var(--shadow-professional)] rounded-xl p-3 min-w-[260px] mt-2 z-50">
                  <div className="py-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                      {item.title}
                    </div>
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem} className="rounded-lg hover:bg-slate-50 transition-colors duration-200 p-3 mb-1" asChild>
                        <Link to={getItemLink(item.title, subItem)} className="flex items-center text-slate-700 hover:text-financial-blue font-medium group">
                          <div className="w-2 h-2 bg-financial-blue/20 rounded-full mr-3 group-hover:bg-financial-blue transition-colors duration-200"></div>
                          {subItem}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            
            {/* Get Started Button in Navigation */}
            <Button className="bg-financial-navy text-white font-semibold px-6 shadow-[var(--shadow-button)] hover:shadow-lg transition-all duration-300 ml-4" asChild>
              <Link to={user ? "/loan-calculator" : "/auth"}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;